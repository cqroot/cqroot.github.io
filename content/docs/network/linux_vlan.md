+++
date = '2026-09-03T00:45:29+08:00'
title = 'Linux VLAN'
+++

## 1. 什么是 VLAN

VLAN（Virtual LAN，虚拟局域网）是 IEEE 802.1Q 标准定义的一项技术，通过在以太网帧中插入一个 4 字节的 `VLAN Tag`（其中包含 12-bit 的 VLAN ID），把一个物理交换机或一段物理网络在逻辑上划分成多个互相隔离的广播域。

常见用途：

- **网络分段**：将不同部门、业务的流量隔离开
- **多租户**：在共享基础设施上为不同客户提供独立的二层网络
- **简化管理**：逻辑拓扑不再受物理布线约束

Linux 上 VLAN 接口是建在物理网卡（或 bond、bridge 等）之上的虚拟设备，命名约定为 `<父接口>.<VLAN_ID>`，例如 `eth0.100` 表示在 `eth0` 上 VLAN ID 为 `100` 的子接口。

## 2. 配置前的准备

### 2.1. 确认内核模块已加载

VLAN 由 `8021q` 内核模块实现：

```bash
lsmod | grep 8021q
modinfo 8021q
```

如未加载：

```bash
sudo modprobe 8021q
echo "8021q" | sudo tee /etc/modules-load.d/8021q.conf
```

### 2.2. 确认父接口已启用

VLAN 子接口依赖父接口，必须先确保物理网卡（`eth0` 等）已 `up`，且对端交换机端口已配置为对应 VLAN 的 `trunk`（允许该 VLAN tag 通过）。

### 2.3. 注意 MTU

802.1Q 标签额外占用 4 字节，父接口的 MTU 通常需要设为 `1500 + 4 = 1504`（或更大）才能避免分片：

```bash
sudo ip link set eth0 mtu 1504
```

## 3. 配置方法

下面以在 `eth0` 上创建 VLAN ID 为 `100`、名为 `eth0.100` 的接口为例，IP 为 `192.168.100.10/24`。

### 3.1. NetworkManager（`nmcli`，推荐）

适用于 RHEL / CentOS 8+、Fedora、Ubuntu（带 NetworkManager 的发行版）。

#### 3.1.1. 创建 VLAN 连接

```bash
sudo nmcli connection add \
    type vlan \
    con-name eth0.100 \
    ifname eth0.100 \
    vlan.parent eth0 \
    vlan.id 100 \
    ipv4.method manual \
    ipv4.addresses 192.168.100.10/24
```

#### 3.1.2. 启动 VLAN

```bash
sudo nmcli connection up eth0.100
```

> 如果 `eth0` 上有同名自动连接（比如 `Wired connection 1`），需要先停用避免抢占父接口。

#### 3.1.3. 同时给父接口设置 MTU

```bash
sudo nmcli connection modify "Wired connection 1" 802-3-ethernet.mtu 1504
sudo nmcli connection up "Wired connection 1"
```

### 3.2. 配置文件（传统 RHEL / CentOS）

适用于 RHEL / CentOS 7 及更早版本，或不想用 NetworkManager 的环境。

#### 3.2.1. 父接口 `/etc/sysconfig/network-scripts/ifcfg-eth0`

```ini
DEVICE=eth0
TYPE=Ethernet
ONBOOT=yes
MTU=1504
```

#### 3.2.2. VLAN 子接口 `/etc/sysconfig/network-scripts/ifcfg-eth0.100`

```ini
DEVICE=eth0.100
VLAN=yes
VLAN_ID=100
TYPE=Vlan
ONBOOT=yes
BOOTPROTO=none
IPADDR=192.168.100.10
PREFIX=24
```

文件名必须是 `<父接口>.<VLAN_ID>` 格式，否则 `vlan` 子接口无法识别。

#### 3.2.3. 生效

```bash
sudo systemctl restart network
```

### 3.3. netplan（Ubuntu 18.04+）

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    eth0:
      mtu: 1504
  vlans:
    eth0.100:
      id: 100
      link: eth0
      addresses:
        - 192.168.100.10/24
```

应用配置：

```bash
sudo netplan apply
```

### 3.4. 临时配置（`ip` 命令）

不写入配置文件，重启或 `NetworkManager` 重启后失效：

```bash
sudo ip link add link eth0 name eth0.100 type vlan id 100
sudo ip addr add 192.168.100.10/24 dev eth0.100
sudo ip link set eth0.100 up
```

删除：

```bash
sudo ip link del eth0.100
```

## 4. 验证

### 4.1. 查看 VLAN 接口

```bash
ip -d link show eth0.100
```

正常输出包含 `vlan id 100`：

```
4: eth0.100@eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1504 qdisc noqueue state UP mode DEFAULT group default
    link/ether 52:54:00:12:34:56 brd ff:ff:ff:ff:ff:ff promiscuity 0
    vlan id 100 <REORDER_HDR>
```

### 4.2. 查看内核 VLAN 表

```bash
cat /proc/net/vlan/config
```

输出：

```
VLAN Dev name | VLAN ID
Number of VLANs with same hardware device: | 1
       eth0.100 | 100  | eth0
```

### 4.3. 查看接口 IP

```bash
ip addr show eth0.100
```

### 4.4. 测试连通性

```bash
ping -I eth0.100 192.168.100.1
```

### 4.5. 抓包确认 tag

在 `eth0` 上抓包，过滤 VLAN ID 100 的帧：

```bash
sudo tcpdump -nei eth0 vlan 100
```

正常会看到带 `802.1Q` 标签的数据包。

## 5. 常见问题

### 5.1. `ip link add` 报 `RTNETLINK answers: Operation not supported`

一般是 `8021q` 模块未加载：

```bash
sudo modprobe 8021q
```

### 5.2. 接口 `up` 了但 ping 不通

- 对端交换机端口没有把 VLAN 100 设为 `trunk` 或允许 VLAN 100 通过
- 父接口 `eth0` 没有 `UP`
- MTU 不够（父接口必须 ≥ 1504）

可在交换机上确认端口模式：

```bash
# Cisco 示例
show interfaces trunk
show vlan brief
```

### 5.3. 性能差 / 大包传输失败

MTU 没设到 1504，导致 1500 字节的帧因 VLAN 标签分片：

```bash
sudo ip link set eth0 mtu 1504
```

或者调小本端接口 MTU 到 1496（牺牲 VLAN tag 空间）：

```bash
sudo ip link set eth0.100 mtu 1496
```

### 5.4. `NetworkManager` 配置后接口消失

- `vlan.parent` 指定的父接口连接没 `up`
- 父接口 MTU 太小，VLAN 拒绝创建

查看详细日志：

```bash
journalctl -u NetworkManager -f
```

### 5.5. 多个 VLAN 共用一个父接口

直接为每个 VLAN 创建独立连接：

```bash
sudo nmcli connection add type vlan ifname eth0.200 vlan.parent eth0 vlan.id 200 ipv4.method manual ipv4.addresses 192.168.200.10/24
sudo nmcli connection add type vlan ifname eth0.300 vlan.parent eth0 vlan.id 300 ipv4.method manual ipv4.addresses 192.168.300.10/24
```

## 6. 参考

1. [IEEE 802.1Q — Wikipedia](https://en.wikipedia.org/wiki/IEEE_802.1Q)
2. [nmcli — NetworkManager Reference Manual](https://networkmanager.dev/docs/api/latest/nmcli.html)
3. [netplan — Reference](https://netplan.io/reference)