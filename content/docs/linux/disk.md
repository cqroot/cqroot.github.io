---
title: "Linux 分区管理"
weight: 1
---

# Linux 分区管理

- `fdisk`：传统分区工具，适用于 MBR 分区表（磁盘 ≤2TB，兼容旧系统）。
- `gdisk`：专为 GPT 设计的分区工具（磁盘 >2TB 或 UEFI 系统）。
- `parted`：高级分区工具，同时支持 MBR 和 GPT。

## 1. `fdisk` 和 `gdisk`

```bash
# 查看所有磁盘及分区信息
fdisk -l
gdisk -l
```

## 2. `parted`

### 2.1. 查看块设备分区信息

```bash
parted -l                      # 列出所有磁盘的分区表
parted /dev/sdX print          # 查看指定磁盘的分区表
```

### 2.2. 设置分区表类型

```bash
parted -s /dev/sdX mklabel gpt    # 将磁盘分区表设置为 GPT
parted -s /dev/sdX mklabel msdos  # 设置为 MBR 分区表
```

**警告**：执行前务必确认磁盘设备（例如通过 `lsblk` 检查），避免误操作。

### 2.3. 创建新分区

```bash
# MBR 分区表：需指定分区类型（primary/extended/logical）
parted -s /dev/sdX mkpart <PART-TYPE> [FS-TYPE] <START> <END>

# GPT 分区表：分区类型被替换为分区名（NAME），无 primary 等概念
parted -s /dev/sdX mkpart <NAME> [FS-TYPE] <START> <END>
```

`-s` 表示脚本模式，免交互。

- `PART-TYPE` 分区类型（仅 MBR）：
  - `primary`：主分区；
  - `extended`：扩展分区，用于容纳逻辑分区；
  - `logical`：逻辑分区，必须位于扩展分区内部；
- `NAME`：GPT 自定义分区名（仅 GPT），如 "boot", "root"；
- `FS-TYPE` 可选，文件系统类型。MBR 中为 1 字节 ID，GPT 中为 GUID。**并不实际创建文件系统**，仅用于告知系统分区用途；
- `START`：分区起始位置。建议第一个分区从 1MiB 开始。支持单位：`B`、`KB`、`MB`、`MiB`、`GB`、`GiB`、`%` 等；
- `END`：分区结束位置。可以带单位，也可以用百分比。例如 100% 表示使用剩余所有空间。

示例：

```bash
# MBR：创建一个主分区，从 1MiB 到 100%（占用整个盘）
parted -s /dev/sdX mkpart primary 1MiB 100%

# GPT：创建一个名为 "data" 的分区，类型标识为 ext4，从 1MiB 到 50GiB
parted -s /dev/sdX mkpart data ext4 1MiB 50GiB

# GPT：创建一个 2GiB 的 swap 分区，从 50GiB 到 52GiB
parted -s /dev/sdX mkpart swap linux-swap 50GiB 52GiB
```

分区创建完成后执行以下命令确认：

```bash
parted -s /dev/sdX print
```

### 2.4. 其他操作

```bash
wipefs -a /dev/sdX  # 清除磁盘上所有文件系统、RAID 及分区表签名。
partprobe /dev/sdX  # 通知内核重读分区表，若无效则需重启系统。
mkfs.ext4 /dev/sdX1 # 格式化分区为 ext4
mkswap /dev/sdX2    # 格式化为 Swap 分区
swapon /dev/sdX2    # 激活 Swap
```

## 3. MBR vs GPT

- MBR：兼容旧系统，最大支持 2TB，最多 4 个主分区，可通过扩展分区+逻辑分区突破数量限制。
- GPT：最大支持 8ZiB，默认 128 个分区（可修改），每个分区有唯一 GUID 和名称。UEFI 模式启动通常要求磁盘使用 GPT 分区表。
