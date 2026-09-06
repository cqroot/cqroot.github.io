+++
date = '2026-09-06T23:31:36+08:00'
title = 'Linux 软件 RAID'
+++

## 1. 什么是 RAID

RAID（Redundant Array of Independent Disks，独立磁盘冗余阵列）通过把多块物理磁盘组合成一个逻辑卷，在不同层级上做数据条带、镜像或校验，从而达到以下目的：

- **提高性能**：多块磁盘并行读写
- **提高可靠性**：单盘故障不丢数据
- **扩容**：把多块小盘合并成一块大卷

常见 RAID 级别：

|  级别   | 最小盘数 |   冗余    | 容量利用率 |             特点             |
| :-----: | :------: | :-------: | :--------: | :--------------------------: |
| RAID 0  |    2     |    无     |    100%    |    条带，速度最快，无冗余    |
| RAID 1  |    2     |   镜像    |    50%     |      完全镜像，可靠性高      |
| RAID 5  |    3     | 单盘校验  |  (n-1)/n   | 读写均衡，最常用的工业级方案 |
| RAID 6  |    4     | 双盘校验  |  (n-2)/n   |       允许同时坏两块盘       |
| RAID 10 |    4     | 镜像+条带 |    50%     |       性能和可靠性兼顾       |

本文以 Linux 软件 RAID 为例（使用 `mdadm` 工具），硬件 RAID 需要在 BIOS / RAID 卡上配置，不在此文范围。

## 2. 配置前的准备

### 2.1. 确认 mdadm 已安装

```bash
mdadm --version
```

如未安装：

```bash
# Debian / Ubuntu
sudo apt install mdadm

# RHEL / CentOS
sudo yum install mdadm
```

### 2.2. 识别目标磁盘

```bash
lsblk
lsblk -f
sudo fdisk -l
```

确认每块磁盘无重要内容（RAID 创建会擦除磁盘上原有数据），并记下设备名，例如 `/dev/sdb`、`/dev/sdc`、`/dev/sdd`。

### 2.3. 分区对齐（推荐）

用 `parted` 把每块盘分成单个 `Linux raid autodetect` 类型的分区（类型号 `fd`），便于后续替换整盘：

```bash
sudo parted /dev/sdb mklabel gpt
sudo parted /dev/sdb mkpart primary 1MiB 100%
sudo parted /dev/sdb set 1 raid on
```

对 `/dev/sdc`、`/dev/sdd` 重复同样操作。

也可以直接使用整盘（不分区），文中 `/dev/sdb` 等示例可直接替换为 `/dev/sdb1`。

## 3. 配置方法

下面以三块盘 `/dev/sdb`、`/dev/sdc`、`/dev/sdd` 组成 RAID 5 为例。

### 3.1. 创建阵列

```bash
sudo mdadm --create --verbose /dev/md0 \
    --level=5 \
    --raid-devices=3 \
    /dev/sdb /dev/sdc /dev/sdd
```

参数说明：

- `--level=5`：RAID 级别
- `--raid-devices=3`：成员磁盘数
- 最后一个设备名列表：参与阵列的磁盘

创建后内核会自动启动重建（resync），可用 `cat /proc/mdstat` 观察进度：

```bash
watch -n 1 cat /proc/mdstat
```

### 3.2. 创建文件系统

```bash
# 格式化为 ext4
sudo mkfs.ext4 /dev/md0

# 或格式化为 xfs
sudo mkfs.xfs /dev/md0
```

### 3.3. 挂载

```bash
sudo mkdir -p /mnt/raid5
sudo mount /dev/md0 /mnt/raid5
df -h /mnt/raid5
```

### 3.4. 持久化配置

#### 3.4.1. 生成配置文件

```bash
sudo mdadm --detail --scan | sudo tee -a /etc/mdadm.conf
```

> Debian / Ubuntu 使用 `/etc/mdadm/mdadm.conf`。如果文件已存在，确保用 `--append` 而不是覆盖：
>
> ```bash
> sudo mdadm --detail --scan | sudo tee -a /etc/mdadm/mdadm.conf
> ```

#### 3.4.2. 更新 initramfs

让系统在启动早期也能识别阵列：

```bash
# Debian / Ubuntu
sudo update-initramfs -u

# RHEL / CentOS
sudo dracut -f
```

#### 3.4.3. `/etc/fstab` 自动挂载

先用 `blkid` 获取 UUID：

```bash
sudo blkid /dev/md0
```

输出示例：

```
/dev/md0: UUID="a1b2c3d4-..." TYPE="ext4"
```

编辑 `/etc/fstab`：

```
UUID=a1b2c3d4-...  /mnt/raid5  ext4  defaults,nofail  0  2
```

`nofail` 选项确保即使阵列没就绪也不会阻塞启动。

## 4. 验证

### 4.1. 查看阵列状态

```bash
cat /proc/mdstat
```

典型输出：

```
Personalities : [raid1] [raid5] [raid6]
md0 : active raid5 sdd[3] sdc[1] sdb[0]
      209612800 blocks super 1.2 level 5, 512k chunk, algorithm 2 [3/3] [UUU]
      [==>..................]  resync = 12.3% (25784320/209612800) finish=15.0min speed=204567K/sec
```

- `[3/3] [UUU]`：3 块盘全部 `up`
- `resync = 12.3%`：正在重建

### 4.2. 查看详情

```bash
sudo mdadm --detail /dev/md0
```

关键信息：

- `State : clean` / `State : clean, degraded` / `State : clean, recovering`
- `Active Devices / Total Devices / Failed Devices / Spare Devices`
- `Rebuild Status : 42% complete`
- `UUID`：唯一标识，写入 `/etc/fstab` 用

### 4.3. 查看成员盘

```bash
sudo mdadm --examine /dev/sdb /dev/sdc /dev/sdd
```

### 4.4. 测试读写

```bash
dd if=/dev/zero of=/mnt/raid5/test bs=1M count=1024 oflag=direct
dd if=/mnt/raid5/test of=/dev/null bs=1M iflag=direct
```

## 5. 常见操作

### 5.1. 模拟磁盘故障

把一块盘标记为故障（仅在演练时使用）：

```bash
sudo mdadm /dev/md0 --fail /dev/sdc
```

阵列会进入 `degraded` 状态，继续运行但没有冗余。再移除该盘：

```bash
sudo mdadm /dev/md0 --remove /dev/sdc
```

查看状态：

```bash
cat /proc/mdstat
sudo mdadm --detail /dev/md0
```

### 5.2. 替换故障盘

插入新盘（假设为 `/dev/sdc`），添加到阵列：

```bash
sudo mdadm /dev/md0 --add /dev/sdc
```

阵列会自动开始重建，可用 `cat /proc/mdstat` 查看进度。

### 5.3. 扩容（添加新盘）

把现有 RAID 5 从 3 盘扩到 4 盘：

```bash
sudo mdadm /dev/md0 --add /dev/sde
sudo mdadm --grow /dev/md0 --raid-devices=4
```

确认后 `cat /proc/mdstat` 会显示 `reshape` 进度。完成后还需要扩展文件系统：

```bash
# ext4
sudo resize2fs /dev/md0

# xfs
sudo xfs_growfs /mnt/raid5
```

### 5.4. 停止阵列

先卸载，再停用：

```bash
sudo umount /mnt/raid5
sudo mdadm --stop /dev/md0
```

### 5.5. 删除阵列（彻底擦除）

```bash
sudo mdadm --stop /dev/md0
sudo mdadm --zero-superblock /dev/sdb /dev/sdc /dev/sdd
```

## 6. 常见问题

### 6.1. 阵列不能自动启动

- `/etc/mdadm.conf` 没生成或没更新
- initramfs 没重建
- BIOS 关闭了对应磁盘

排查：

```bash
sudo mdadm --assemble --scan --verbose
```

### 6.2. `mdadm: cannot open /dev/sdb: Device or resource busy`

磁盘已被其他进程占用，可能挂在 `dm-*` 设备映射下。检查：

```bash
lsblk
dmsetup ls
sudo umount /dev/sdb1 2>/dev/null
```

### 6.3. `degraded` 状态无法重建

通常是替换的新盘已经有旧 RAID 元数据。清除后再加入：

```bash
sudo mdadm --zero-superblock /dev/sde
sudo mdadm /dev/md0 --add /dev/sde
```

### 6.4. 启动时提示 `mdadm: No arrays found in config file`

`/etc/mdadm.conf` 没有当前阵列的条目。重新生成：

```bash
sudo mdadm --detail --scan | sudo tee -a /etc/mdadm.conf
sudo update-initramfs -u   # 或 dracut -f
```

### 6.5. 监控告警（推荐配置邮件）

在 `/etc/mdadm.conf` 中添加：

```
MAILADDR your@email.com
```

触发条件：

- 阵列降级
- 磁盘故障
- 重建完成

需要本机有可用的邮件服务（或外部 SMTP 转发）。

## 7. 参考

1. [mdadm(8) — Linux manual page](https://man7.org/linux/man-pages/man8/mdadm.8.html)
2. [Linux RAID wiki — kernel.org](https://raid.wiki.kernel.org/)
3. [Software RAID HOWTO — tldp.org](https://tldp.org/HOWTO/Software-RAID-HOWTO.html)
