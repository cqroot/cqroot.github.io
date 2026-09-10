+++
date = '2026-09-06T23:53:01+08:00'
title = 'PCIe 设备查询'
+++

## 1. PCI 与 PCIe 的关系

**PCI**（Peripheral Component Interconnect）是 Intel 于 1992 年发布的并行总线标准，曾是 PC / 服务器上连接外设（网卡、声卡、显卡、RAID 卡）的主流接口。它采用 **并行共享总线** 架构，所有设备共享一组地址 / 数据 / 控制线，通过仲裁器调度，因此存在以下先天限制：

- 总线带宽由所有设备共享，扩展性差
- 单个设备的信号频率受限于总线长度
- 难以支持热插拔和高级电源管理

**PCIe**（PCI Express）是 2003 年由 PCI-SIG 发布的下一代标准，核心变化是用 **高速串行差分链路（Lane）** 取代了并行总线：

| 维度       | PCI                         | PCIe                                                                    |
| ---------- | --------------------------- | ----------------------------------------------------------------------- |
| 拓扑       | 并行共享总线                | 串行点对点链路，可级联 Switch                                           |
| 单链路速率 | 133 MB/s（32-bit @ 33 MHz） | 每代翻倍：Gen1 250 MB/s、Gen3 ~985 MB/s、Gen5 ~3.94 GB/s（均为单 Lane） |
| 通道聚合   | 不支持                      | x1 / x4 / x8 / x16 多 Lane 聚合                                         |
| 热插拔     | 原生不支持                  | 支持                                                                    |
| 电源管理   | 有限                        | 支持 ASPM、各链路独立 L0s / L1                                          |
| 中断       | 仅传统 IRQ                  | MSI / MSI-X（基于内存消息）                                             |
| 错误处理   | 简单                        | AER（Advanced Error Reporting）分层错误                                 |

PCI 与 PCIe **在软件层完全兼容**——Linux 内核的 PCI 子层同时管理两种设备，命令行工具（`lspci` 等）也不区分。即便主板上只有 PCIe 槽位，内核也仍按 PCI 命名（`pci_bus_type`、`/sys/bus/pci/`）。

下文统称 PCIe，但命令同样适用于 PCI 设备。

## 2. PCIe 版本、速率与带宽

PCI-SIG 从 2003 年发布 PCIe 1.0 至今，已迭代到 PCIe 7.0（已发布规范，设备在 2025+ 逐步推出）。每一代的关键变化是 **单 Lane 速率翻倍**，并通过 **Lane 聚合**（x1 / x4 / x8 / x16）进一步提升带宽。

### 2.1. 各版本参数

| 版本  | 规范年份 | 信号 |    编码    | 单 Lane 速率 |        单 Lane 带宽        |
| :---: | :------: | :--: | :--------: | :----------: | :------------------------: |
| Gen 1 |   2003   | NRZ  |   8b/10b   |   2.5 GT/s   |        **250 MB/s**        |
| Gen 2 |   2007   | NRZ  |   8b/10b   |   5.0 GT/s   |        **500 MB/s**        |
| Gen 3 |   2010   | NRZ  | 128b/130b  |   8.0 GT/s   | **~985 MB/s**（约 1 GB/s） |
| Gen 4 |   2017   | NRZ  | 128b/130b  |  16.0 GT/s   |       **~1.97 GB/s**       |
| Gen 5 |   2019   | NRZ  | 128b/130b  |  32.0 GT/s   |       **~3.94 GB/s**       |
| Gen 6 |   2022   | PAM4 | FLIT + FEC |  64.0 GT/s   |       **~7.56 GB/s**       |
| Gen 7 |   2025   | PAM4 | FLIT + FEC |  128.0 GT/s  |      **~15.13 GB/s**       |

> **GT/s**（Gigatransfers per second）是物理层符号率，不等于带宽；除以编码开销后才能得到有效带宽。

### 2.2. 常用 Lane 宽度下的总带宽

| 版本  |     x1      |     x4      |     x8      |     x16     |
| :---: | :---------: | :---------: | :---------: | :---------: |
| Gen 1 |  250 MB/s   |   1 GB/s    |   2 GB/s    |   4 GB/s    |
| Gen 2 |  500 MB/s   |   2 GB/s    |   4 GB/s    |   8 GB/s    |
| Gen 3 |  985 MB/s   | ~3.94 GB/s  | ~7.88 GB/s  | ~15.75 GB/s |
| Gen 4 | ~1.97 GB/s  | ~7.88 GB/s  | ~15.75 GB/s | ~31.5 GB/s  |
| Gen 5 | ~3.94 GB/s  | ~15.75 GB/s | ~31.5 GB/s  |  ~63 GB/s   |
| Gen 6 | ~7.56 GB/s  | ~30.25 GB/s | ~60.5 GB/s  |  ~121 GB/s  |
| Gen 7 | ~15.13 GB/s | ~60.5 GB/s  |  ~121 GB/s  |  ~242 GB/s  |

> 表中为 **单向**（单方向）带宽；PCIe 链路是全双工，所以上下行各能跑到这个数。

### 2.3. 几个关键概念

- **NRZ（Non-Return-to-Zero）**：Gen 1～5 用 2 电平表示 1 bit/UI（Unit Interval）。
- **PAM4（4-level Pulse Amplitude Modulation）**：Gen 6+ 用 4 电平表示 2 bit/UI，等效带宽翻倍但对信号完整性要求更高。
- **8b/10b 编码**（Gen 1-2）：每 10 bit 中有 2 bit 用于时钟恢复和数据校验，有效带宽损失 20%。
- **128b/130b 编码**（Gen 3-5）：开销约 1.5%，效率更高。
- **FLIT + FEC**（Gen 6+）：固定长度 FLIT 包 + 前向纠错，开销约 1.6%，并提供更强纠错能力。
- **Lane 协商**：x16 设备可降速到 x8 / x4 / x1 运行（链路训练时协商）；最大能力通过 `max_link_width` 查看。

### 2.4. 查询当前协商的速率和宽度

```bash
cat /sys/bus/pci/devices/0000:01:00.0/current_link_speed
cat /sys/bus/pci/devices/0000:01:00.0/current_link_width
cat /sys/bus/pci/devices/0000:01:00.0/max_link_speed
cat /sys/bus/pci/devices/0000:01:00.0/max_link_width
```

如果 `current_link_*` 明显低于 `max_link_*`，通常是链路训练异常（接触不良、BIOS 设置、固件 bug 等）。

## 3. PCIe 子系统简介

PCIe 把整个子系统抽象为三层：

- **Host / Root Complex**：CPU 端的根控制器，对应一个或多个 PCI 主桥
- **Bridge（桥）**：PCIe 交换机（Switch）或传统 PCI-to-PCI 桥，负责扩展总线层级
- **Device / Function（设备 / 功能）**：终端设备，例如网卡、GPU、NVMe SSD；多功能设备（如一个多功能网卡）有多个 Function

设备按 **BDF**（Bus:Device.Function）三元组寻址，例如 `0000:01:00.0`：

- `Domain`（通常为 `0000`）
- `Bus`（总线号）
- `Device`（设备号）
- `Function`（功能号，`0`～`7`）

## 4. 工具安装

```bash
# Debian / Ubuntu
sudo apt install pciutils

# RHEL / CentOS
sudo yum install pciutils

# Arch Linux
sudo pacman -S pciutils
```

核心工具：

- `lspci`：列出/查询 PCI / PCIe 设备（最常用）
- `setpci`：修改 PCI 配置空间（高级）

## 5. 列出所有设备

### 5.1. 简要列表

```bash
lspci
```

典型输出：

```
00:00.0 Host bridge: Intel Corporation Device 9a14 (rev 01)
00:02.0 VGA compatible controller: Intel Corporation Alder Lake-P Integrated Graphics Controller
00:14.0 USB controller: Intel Corporation Alder Lake PCH USB 3.2 xHCI Host Controller
01:00.0 Ethernet controller: Intel Corporation Ethernet Controller X710 for 10GbE SFP+ (rev 02)
01:00.1 Ethernet controller: Intel Corporation Ethernet Controller X710 for 10GbE SFP+ (rev 02)
02:00.0 Non-Volatile memory controller: Samsung Electronics Co Ltd NVMe SSD Controller SM981/PM981/PM983
```

### 5.2. 详细信息

```bash
lspci -v         # 中等详细
lspci -vv        # 更详细
lspci -vvv       # 包括 Capability 区域，最详细
```

关键字段：

- `Subsystem`：子系统厂商和设备 ID（用于定位 OEM 型号）
- `Flags`：总线能力（bus master、fast devsel 等）
- `Memory at <addr> [size=K]`：设备占用的 MMIO 地址段
- `Capabilities`：链路能力、AER、电源管理、MSI 等
- `Kernel driver in use`：当前绑定的内核驱动
- `Kernel modules`：可加载的模块名

### 5.3. 按数字 ID 输出

```bash
lspci -n
```

输出形如：

```
01:00.0 0200: 8086:1572 (rev 02)
```

`0200:8086:1572` 中：

- `0200`：设备类（以太网控制器）
- `8086`：Vendor ID（Intel）
- `1572`：Device ID

适合脚本中按 vendor:device 匹配。

### 5.4. 按指定维度过滤

```bash
lspci -nn                        # 同时显示数字 ID 和名称
lspci -d 8086:                   # 按 vendor ID 过滤（Intel）
lspci -d 8086:1572               # 按 vendor:device 过滤
lspci -d '::0200'                # 按设备类过滤（以太网）
lspci -s 01:00.0                 # 按 BDF 指定单设备
lspci -s 01:00                   # 按 bus:device 指定该设备的全部 function
lspci -b                         # 不通过 PCI 总线查询（绕过内核缓存）
```

## 6. 拓扑结构

### 6.1. 树状视图

```bash
lspci -t
```

示例：

```
-[0000:00]-+-00.0
           +-02.0
           +-14.0
           +-15.0
           +-16.0
           +-1c.0-[01]----00.0
           |               \-00.1
           \-1d.0-[02]----00.0
```

`-[\bus]` 表示一个 PCI 桥，下面列出挂载的设备。直观看到 Root Complex → 桥 → 设备 的层级关系。

### 6.2. 包含数字 ID

```bash
lspci -tv
lspci -t -nn
```

### 6.3. 通过 sysfs 查看

```bash
ls /sys/bus/pci/devices/
```

每个目录名形如 `0000:01:00.0`，对应一个 BDF。常用读取项：

```bash
# 设备目录
cd /sys/bus/pci/devices/0000:01:00.0

# 厂商 / 设备 ID
cat vendor device

# 当前绑定的驱动
cat driver           # 软链到 /sys/bus/pci/drivers/<drv>

# 链路状态（Speed / Width）
cat current_link_speed
cat current_link_width
cat max_link_speed
cat max_link_width

# IRQ / MSI
cat irq
```

## 7. 配置空间（高级）

### 7.1. 16 字节配置空间头

```bash
lspci -x -s 01:00.0
```

输出 64 个十六进制字节（前 16 字节是标准头，后 48 字节依赖设备类型）。

### 7.2. 完整 4 KB PCIe 配置空间

```bash
sudo lspci -xxxx -s 01:00.0
```

> 注意：旧 PCI 仅 256 字节，PCIe 扩展到 4 KB。

### 7.3. 读取 BAR（Base Address Register）

```bash
sudo setpci -s 01:00.0 BASE_ADDRESS_0.l
sudo setpci -s 01:00.0 BASE_ADDRESS_0.l 32
```

`BASE_ADDRESS_0`～`BASE_ADDRESS_5` 是 6 个 BAR，`BASE_ADDRESS_0.l` 表示读 32 位，`BASE_ADDRESS_0.4` 表示读高 32 位。

### 7.4. 修改寄存器（谨慎！）

```bash
# 先备份
sudo lspci -xxxx -s 01:00.0 > /tmp/pci.dump

# 例：向配置空间 0x40 字节处写入字节
sudo setpci -s 01:00.0 40.B=ff
```

> 修改配置空间可能让设备失能或系统崩溃，操作前必须确认目的寄存器含义。

## 8. 驱动绑定

### 8.1. 查看当前驱动

```bash
lspci -k -s 01:00.0
```

输出：

```
01:00.0 Ethernet controller: Intel Corporation Ethernet Controller X710 for 10GbE SFP+ (rev 02)
        Subsystem: Intel Corporation Ethernet X710 10GbE SFP+ DP
        Kernel driver in use: i40e
        Kernel modules: i40e
```

### 8.2. 手动解绑 / 重绑

```bash
echo "0000:01:00.0" | sudo tee /sys/bus/pci/drivers/i40e/unbind
echo "0000:01:00.0" | sudo tee /sys/bus/pci/drivers/i40e/bind
```

### 8.3. 强制绑定到特定驱动

```bash
# 把新驱动设为候选
echo "8086 1572" | sudo tee /sys/bus/pci/drivers/i40e/new_id

# 或者用 driver_override 临时覆盖
echo "i40e" | sudo tee /sys/bus/pci/devices/0000:01:00.0/driver_override
echo "0000:01:00.0" | sudo tee /sys/bus/pci/drivers_probe
```

解除覆盖：

```bash
echo "" | sudo tee /sys/bus/pci/devices/0000:01:00.0/driver_override
```

### 8.4. 重扫总线（设备热插后无显示）

```bash
echo 1 | sudo tee /sys/bus/pci/devices/0000:00:1c.0/../rescan
# 或
echo 1 | sudo tee /sys/bus/pci/rescan
```

## 9. 错误与调试

### 9.1. AER（Advanced Error Reporting）

PCIe 设备出现不可纠正错误时，AER 会写入日志：

```bash
dmesg | grep -i aer
sudo journalctl -k | grep -i aer
```

按级别分类：

- **Correctable（可纠正）**：CRC 错误、流控制更新等；一般自恢复
- **Uncorrectable（非致命）**：数据链路层错误、毒位错误等
- **Uncorrectable（致命）**：链路重训练、组件复位等

### 9.2. 启用 AER 详细日志

```bash
sudo setpci -s 01:00.0 CAP_EXP+8.B
# 查看 AER capability 是否启用

# 通过 sysfs 配置
echo 0xffff | sudo tee /sys/bus/pci/devices/0000:01:00.0/aer_dev_correctable
echo 0xffff | sudo tee /sys/bus/pci/devices/0000:01:00.0/aer_dev_fatal
echo 0xffff | sudo tee /sys/bus/pci/devices/0000:01:00.0/aer_dev_nonfatal
```

### 9.3. 查看链路层状态

```bash
# 协商速率（GT/s）
cat /sys/bus/pci/devices/0000:01:00.0/current_link_speed

# 协商宽度（x1 / x4 / x8 / x16）
cat /sys/bus/pci/devices/0000:01:00.0/current_link_width

# 期望最大值（设备能力）
cat /sys/bus/pci/devices/0000:01:00.0/max_link_speed
cat /sys/bus/pci/devices/0000:01:00.0/max_link_width
```

如果当前协商低于 max，多半是链路训练问题（接触不良、固件、BIOS 设置等）。

## 10. 电源管理（ASPM）

ASPM（Active State Power Management）允许 PCIe 链路在不传送数据时进入低功耗状态。Linux 默认对部分设备启用。

### 10.1. 查看 ASPM 策略

```bash
cat /sys/module/pcie_aspm/parameters/policy
```

返回 `default [performance]`、`powersave`、`off` 等。

### 10.2. 查看各设备 ASPM 状态

```bash
for d in /sys/bus/pci/devices/*/; do
  echo "$(basename "$d")  aspm=$(cat "$d/aspm_state" 2>/dev/null)"
done | head
```

### 10.3. 临时切换策略

```bash
echo powersupersave | sudo tee /sys/module/pcie_aspm/parameters/policy
```

> 持久化需要在启动参数加 `pcie_aspm=policy=powersupersave`。

## 11. NVMe / GPU 等典型设备速查

### 11.1. NVMe SSD

```bash
# 找到 NVMe 设备对应的 PCI BDF
lspci -d ::0108 -nn      # 0108 = Non-Volatile memory controller

# 配合 nvme list
sudo nvme list
```

### 11.2. GPU

```bash
lspci -d ::0300 -nn       # 0300 = VGA
```

### 11.3. 网络卡

```bash
lspci -d ::0200 -nn       # 0200 = Ethernet controller
```

## 12. 参考

1. [lspci(8) — Linux manual page](https://man7.org/linux/man-pages/man8/lspci.8.html)
2. [PCI Express — Wikipedia](https://en.wikipedia.org/wiki/PCI_Express)
3. [Linux PCI subsystem — kernel.org](https://docs.kernel.org/PCI/)
4. [sysfs 下的 PCI 设备目录](https://www.kernel.org/doc/Documentation/ABI/testing/sysfs-bus-pci)
