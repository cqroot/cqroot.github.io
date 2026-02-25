---
title: "03. Bash 常用操作"
weight: 3
---

# Bash 常用操作

## 1. 比较两个目录

```bash
diff --brief --recursive dir1 dir2
```

## 2. 输出格式化

### 2.1. 改变输出的 tab 大小

```bash
expand -t4 <FILE>
```

### 2.2. 将输出按表格输出

```bash
echo STRING | column -t
```

## 3. 用户管理

### 3.1. 设置执行 sudo 不需要密码

新建文件 `/etc/sudoers.d/YOURUSERNAME`，内容如下：

```
YOURUSERNAME ALL=(ALL) NOPASSWD: ALL
```

你也可以选择将其追加到 `/etc/sudoers` 文件中。

### 3.2. 在多次错误输入后用户被锁定

可以修改文件 `/etc/security/faillock.conf` 来改变用户允许输入密码错误的次数。

找到以下行：

```bash
# deny = 3
```

将注释去掉，将 3 改的足够大即可。

## 4. 统计某列中所有值出现的次数

```bash
xxx | sort | uniq -c | sort -nr
```

- `sort`: 排序。这是为了让重复项排在一起。
- `uniq -c`: 连续的重复项只会显示一个。`-c` 会在每个项目前添加重复次数。
- `sort -nr`: 排序。`-n` 表示按数字排序。`-r` 会按照从大到小排序。

## 5. 替换目录中某个字符串

```bash
grep -rlZ OLD_STR | xargs -0 sed -i 's/OLD_STR/NEW_STR/g'
```
