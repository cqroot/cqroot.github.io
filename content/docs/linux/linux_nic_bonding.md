+++
date = '2026-09-03T00:17:02+08:00'
title = 'Linux 网卡绑定'
+++

## 1. 什么是 Bond

Bond（网卡绑定）是 Linux 内核中的一项功能，一共有 7 种工作模式（mode 0~6），它能将多块物理网卡“虚拟”成一块逻辑网卡。这样做的主要目的是为了提升网络带宽、实现冗余备份（防止单点故障），或者两者兼顾。

查看 Bond 口运行模式的方法是：

```bash
grep '^Bonding Mode:' /proc/net/bonding/<BOND_NAME>
```

不同 Bond 模式的输出如下：

|  模式  | 名称           | Bonding Mode 输出                       |
| :----: | :------------- | :-------------------------------------- |
| mode 0 | balance-rrg    | `load balancing (round-robin)`          |
| mode 1 | active-backupg | `fault-tolerance (active-backup)`       |
| mode 2 | balance-xorg   | `load balancing (xor)`                  |
| mode 3 | broadcastg     | `fault-tolerance (broadcast)`           |
| mode 4 | 802.3adg       | `IEEE 802.3ad Dynamic link aggregation` |
| mode 5 | balance-tlbg   | `transmit load balancing`               |
| mode 6 | balance-albg   | `adaptive load balancing`               |

## 2. 配置前的准备

### 2.1. 确认内核模块已加载

```bash
modinfo bonding
lsmod | grep bonding
```

如未加载：

```bash
sudo modprobe bonding
echo "bonding" | sudo tee /etc/modules-load.d/bonding.conf
```

### 2.2. 关闭参与绑定的物理网卡

物理网卡加入 Bond 后不能再有自己的 IP，所有配置必须在 Bond 口上做。建议先 `ip link set <iface> down`。

## 3. 配置方法

下面以两块网卡 `eth0`、`eth1` 组成 `bond0`、模式为 `mode 4`（802.3ad 动态链路聚合）为例。

### 3.1. NetworkManager（`nmcli`，推荐）

适用于 RHEL / CentOS 8+、Fedora、Ubuntu（带 NetworkManager 的发行版）。

#### 3.1.1. 创建 Bond 连接

```bash
sudo nmcli connection add \
    type bond \
    con-name bond0 \
    ifname bond0 \
    bond.mode 802.3ad \
    bond.lacp_rate fast \
    ipv4.method manual \
    ipv4.addresses 192.168.1.100/24 \
    ipv4.gateway 192.168.1.1 \
    ipv4.dns 8.8.8.8
```

#### 3.1.2. 将物理网卡接入 Bond

```bash
sudo nmcli connection add \
    type ethernet \
    slave-type bond \
    con-name bond0-port1 \
    ifname eth0 \
    master bond0

sudo nmcli connection add \
    type ethernet \
    slave-type bond \
    con-name bond0-port2 \
    ifname eth1 \
    master bond0
```

#### 3.1.3. 启动 Bond

```bash
sudo nmcli connection up bond0
```

如果之前 `eth0` / `eth1` 上有 `Wired connection 1` 之类的自动连接，需要先停用避免冲突：

```bash
sudo nmcli connection down "Wired connection 1"
```

### 3.2. 配置文件（传统 RHEL / CentOS）

适用于 RHEL / CentOS 7 及更早版本，或不想用 NetworkManager 的环境。

#### 3.2.1. `/etc/sysconfig/network-scripts/ifcfg-bond0`

```ini
DEVICE=bond0
NAME=bond0
TYPE=Bond
BONDING_MASTER=yes
ONBOOT=yes
BOOTPROTO=none
IPADDR=192.168.1.100
PREFIX=24
GATEWAY=192.168.1.1
DNS1=8.8.8.8
BONDING_OPTS="mode=802.3ad lacp_rate=fast miimon=100"
```

#### 3.2.2. `/etc/sysconfig/network-scripts/ifcfg-eth0`

```ini
DEVICE=eth0
NAME=bond0-port1
TYPE=Ethernet
ONBOOT=yes
MASTER=bond0
SLAVE=yes
```

#### 3.2.3. `/etc/sysconfig/network-scripts/ifcfg-eth1`

```ini
DEVICE=eth1
NAME=bond0-port2
TYPE=Ethernet
ONBOOT=yes
MASTER=bond0
SLAVE=yes
```

#### 3.2.4. 生效

```bash
sudo systemctl restart network
```

### 3.3. netplan（Ubuntu 18.04+）

```yaml
network:
  version: 2
  renderer: networkd
  bonds:
    bond0:
      interfaces:
        - eth0
        - eth1
      addresses:
        - 192.168.1.100/24
      gateway4: 192.168.1.1
      nameservers:
        addresses: [8.8.8.8]
      parameters:
        mode: 802.3ad
        lacp-rate: fast
        mii-interval: 100
```

应用配置：

```bash
sudo netplan apply
```

## 4. 验证

### 4.1. 查看 Bond 状态

```bash
cat /proc/net/bonding/bond0
```

正常输出包含：

- `Bonding Mode: IEEE 802.3ad Dynamic link aggregation`
- `LACP rate: fast`
- `Slave Interface: eth0` / `Slave Interface: eth1`，且 `MII Status: up`、`Speed: 1000 Mbps`

### 4.2. 查看接口 IP

```bash
ip addr show bond0
```

### 4.3. 测试连通性

```bash
ping -I bond0 192.168.1.1
```

### 4.4. 验证冗余

拔掉 `eth0` 网线，观察 `cat /proc/net/bonding/bond0` 中 eth0 的状态是否变成 `down`，同时 `eth1` 接管流量，ping 不中断：

```bash
watch -n 1 'cat /proc/net/bonding/bond0 | grep -E "MII Status|Slave Interface"'
```

## 5. 常见问题

### 5.1. `bond0` 起不来，提示 `Device bond0 does not exist`

内核模块未加载。运行：

```bash
sudo modprobe bonding
```

### 5.2. Bond 起来但 ping 不通

- 交换机侧未配置 LACP（`mode 802.3ad` 要求双方都开启）
- 物理网卡速率 / 双工模式不一致

可以临时切到 `mode 0`（balance-rr）验证：

```bash
sudo nmcli connection modify bond0 bond.mode balance-rr
sudo nmcli connection up bond0
```

### 5.3. 重启后 Bond 配置丢失

检查 `/etc/modules-load.d/bonding.conf` 是否存在；NetworkManager 配置走 `nmcli c` 持久化，配置文件方式确认 `ONBOOT=yes`。

## 6. 参考

1. [Linux Bonding — kernel.org](https://www.kernel.org/doc/Documentation/networking/bonding.txt)
2. [nmcli — NetworkManager Reference Manual](https://networkmanager.dev/docs/api/latest/nmcli.html)
3. [netplan — Reference](https://netplan.io/reference)