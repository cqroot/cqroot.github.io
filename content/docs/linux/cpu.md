---
title: "Linux CPU 监控与管理"
weight: 1
---

# Linux CPU 监控与管理

## 1. 查看 CPU 基本信息

### 1.1. `/proc/cpuinfo`

```bash
# 查看 CPU 详细信息（型号、核心数、频率、缓存等）
cat /proc/cpuinfo

# 查看 CPU 型号
grep "model name" /proc/cpuinfo | head -1

# 查看核心数
grep "processor" /proc/cpuinfo | wc -l
```

### 1.2. `lscpu`

```bash
# 查看 CPU 架构信息
lscpu
```

常用选项：

- `lscpu -e`：以表格形式显示 CPU 核心信息
- `lscpu -p`：以机器可读的格式输出

## 2. 实时监控

### 2.1. `top`

```bash
top
```

常用交互命令：

- `P`：按 CPU 使用率排序
- `M`：按内存使用率排序
- `1`：显示每个 CPU 核心的使用情况
- `k`：杀死进程
- `u`：查看指定用户的进程

## 3. CPU 占用分析

```bash
# 查看 CPU 占用最高的进程
ps aux --sort=-%cpu | head -10

# 查看每个 CPU 核心的使用情况
mpstat -P ALL 1

# 找出 CPU 占用最高的进程
top -bn1 | head -20

# 查看进程树，找到可疑进程的父进程
pstree -p <PID>
```

## 4. CPU 亲和性

### 4.1. `taskset`

```bash
# 查看进程 CPU 亲和性
taskset -cp <PID>

# 将进程绑定到指定 CPU 核心
taskset -cp <CPU_LIST> <PID>

# 启动进程并绑定 CPU
taskset -c 0,1 ./myprogram
```

### 4.2. `chrt`

```bash
# 查看进程的调度策略和优先级
chrt -p <PID>

# 设置进程的调度策略
chrt -f -p 50 <PID>   # FIFO 策略，优先级 50
chrt -r -p 50 <PID>   # RR 策略，优先级 50
```

## 5. 其他常用命令

```bash
# 查看 CPU 温度
sensors

# 查看 CPU 频率
cpufreq-info

# 列出所有可用的 CPU 核心
ls /sys/devices/system/cpu/

# 查看绑在 0、2、3 核上的进程占用，从小到大排序
ps -eo pid,psr,comm,pcpu --sort=pcpu | awk '$2 == 0 || $2 == 2 || $2 == 3'
```
