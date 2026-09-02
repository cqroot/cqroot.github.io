+++
date = '2026-08-30T22:31:25+08:00'
title = 'OpenStack Swift 中的一致性哈希算法'
+++

## 1. 创建 OpenStack Swift 环文件

了解 OpenStack Swift 的一致性哈希算法前，先看一下 OpenStack Swift 的一致性哈希环是如何生成的。

### 1.1. 创建环文件 (create)

首先，要为 Account、Container 和 Object 这三种服务分别创建环文件。

命令格式为：`swift-ring-builder <builder_file> create <part_power> <replicas> <min_part_hours>`

其中：

- `<builder_file>`: 为环指定的构建文件名，如 account.builder、container.builder、object.builder。
- `<part_power>`: 分区总数是 2 的 part_power 次方。例如，值为 10 则代表有 1024 个分区。
- `<replicas>`: 每个数据的副本数，生产环境通常为 3。
- `<min_part_hours>`: 一个分区被移动后，多少小时内不能再次移动，通常设为 1。

```bash
# 创建 Account 环
swift-ring-builder account.builder create 10 3 1

# 创建 Container 环
swift-ring-builder container.builder create 10 3 1

# 创建 Object 环
swift-ring-builder object.builder create 10 3 1
```

Account 环、Container 环、Object 环的操作方法类似，下文中将只对 Object 环进行操作。

### 1.2. 添加存储设备

使用 `add` 命令将你的所有存储节点和磁盘添加到刚才创建的环中。

命令格式为：`swift-ring-builder <builder_file> add --region <region> --zone <zone> --ip <ip> --port <port> --device <device> --weight <weight>`

关键参数说明：

- `--region`: 地域。
- `--zone`: 可用区，用于将数据副本分散到不同机架或电源，提高可用性。
- `--ip`: 存储节点的管理或数据网络 IP 地址。
- `--port`: 端口，比如 Account 环使用端口 `6002`，Container 环使用 `6001`，Object 环使用 `6000`。
- `--device`: 存储设备的名称，如 sdb 或 sdb1。
- `--weight`: 设备权重，代表其存储容量相对大小。例如，一个 2TB 的磁盘权重为 100，一个 1TB 的为 50。

以 Object 环为例：

```bash
# 为 Object 环添加设备（端口 6000）
swift-ring-builder object.builder add --region 1 --zone 1 --ip 10.0.0.51 --port 6000 --device sdb --weight 100
swift-ring-builder object.builder add --region 1 --zone 1 --ip 10.0.0.51 --port 6000 --device sdc --weight 100
swift-ring-builder object.builder add --region 1 --zone 1 --ip 10.0.0.51 --port 6000 --device sdd --weight 100
swift-ring-builder object.builder add --region 1 --zone 2 --ip 10.0.0.52 --port 6000 --device sdb --weight 100
swift-ring-builder object.builder add --region 1 --zone 2 --ip 10.0.0.52 --port 6000 --device sdc --weight 100
swift-ring-builder object.builder add --region 1 --zone 2 --ip 10.0.0.52 --port 6000 --device sdd --weight 100
swift-ring-builder object.builder add --region 1 --zone 3 --ip 10.0.0.53 --port 6000 --device sdb --weight 100
```

### 1.3. 平衡环 (rebalance)

所有设备添加完毕后，执行 `rebalance` 命令，让环根据设备权重分配数据分区。

```bash
# 平衡 Object 环
swift-ring-builder object.builder rebalance
```

如果分区分布不够均衡，命令会打印类似以下的输出：

```
Reassigned 3072 (300.00%) partitions. Balance is now 0.20.  Dispersion is now 19.04
-------------------------------------------------------------------------------
NOTE: Dispersion of 19.042969 indicates some parts are not
      optimally dispersed.

      You may want to adjust some device weights, increase
      the overload or review the dispersion report.
-------------------------------------------------------------------------------
```

- `Reassigned 3072 (300.00%) partitions`：本次共有 3072 个分区副本（占分区数 1024 的 300%）发生了移动；
- `Balance is now 0.20`：当前环的负载均衡程度，它是一个 0-1 的数值，越接近 0 越理想；
- `Dispersion is now 19.04`：分散度为 19.04，越接近 0 说明分区在多层级（region / zone / server / device）上的分布越均匀

### 1.4. 扩容存储设备

根据刚刚我们添加的存储设备，Zone 1 和 Zone 2 都有三个存储设备，且权重相同，但 Zone 3 只有一个存在设备。

现在，我们为 Zone 3 扩容两块盘后再重新 `rebalance`：

```bash
swift-ring-builder object.builder add --region 1 --zone 3 --ip 10.0.0.53 --port 6000 --device sdc --weight 100
swift-ring-builder object.builder add --region 1 --zone 3 --ip 10.0.0.53 --port 6000 --device sdd --weight 100

swift-ring-builder object.builder rebalance
```

`rebalance` 报错：

```
No partitions could be reassigned.
The time between rebalances must be at least min_part_hours: 1 hours (0:47:45 remaining)
```

这是因为我们设置了分区移动后 1 小时内不能再移动。由于我们的环文件仅作为测试，可以将 min_part_hours 设置为 0（生产环境不要这么操作）：

```bash
swift-ring-builder object.builder set_min_part_hours 0
swift-ring-builder object.builder rebalance
```

输出如下：

```
Reassigned 878 (85.74%) partitions. Balance is now 0.20.  Dispersion is now 0.00
```

当前的分散度已经达到了 0，集群整体的数据分布已经处于健康状态。

## 2. 一些基本概念

### 2.1. 存储设备 (`Device`)

存储设备 (`Device`) 是数据存储的物理单元，一个存储设备就是一个目录。通常会将节点上用于存储的硬盘设备挂载到 `/srv/node` 下，如 `/srv/node/sdb`。

### 2.2. 分区 (`Partition`)

`Partition` 是 Ring 中的数据分布基本单元。Ring 会将所有数据均匀地划分到固定数量的 Partition 中。这个数量在创建 Ring 时由 `part_power` 参数决定：`2^part_power = Partition 总数`。

为什么要引入 `Partition`？OpenStack Swift 存储的文件数量通常很大，通过引入 `Partition`，可以让需要分配的元素限定在固定的数量。

### 2.3. 副本 (`Replica`)

`Replica` 指的是一个 `Partition` 的副本数量。为了提高可用性，每个 `Partition` 都会在集群的不同 `Device` 上保存多份拷贝，默认通常是 3 份。Ring 会确保这 3 个副本分布在尽可能不同的 `Zone`、`Device` 上。
