---
title: "02. Bash 代码片段"
weight: 2
---

# Bash 代码片段

## 1. 获取脚本所在路径

```bash
# 脚本所在路径
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)

# 脚本所在路径的父路径
PARENT_DIR=$(dirname "${SCRIPT_DIR}")
```

## 2. 逐行处理输出

### 2.1. 逐行处理文件

```bash
while IFS= read -r line; do
    echo "${line}"
done <FILENAME
```

如果不添加 `IFS=`，读到的 `line` 会删除行首和行尾的 IFS 空白字符（默认是空格和制表符），保留中间空白。

例如对于以下字符串：

```
  line 1
line 2
line 3
```

- 如果不添加 `IFS=`，获取到的字符串是 `line 1`、`line 2`、`line 3`；
- 如果添加 `IFS=`，获取到的字符串是 `  line 1`、`line 2`、`line 3  `。

### 2.2. 逐行处理命令输出

```bash
while IFS= read -r line; do
    echo "${line}"
done < <(ls -l)
```

### 2.3. 逐行处理变量内容

```bash
sometext=$(ls -l)
while IFS= read -r line; do
    echo "${line}"
done <<<"${sometext}"
```

## 3. 打印连续数字

```bash
# 打印数字 1 到 10
echo {1..10}

# 打印等宽的数字 01 到 10
echo {01..10}
```

## 4. Find

### 4.1. 找出大于某个大小的文件

```bash
find . -type f -size +100M
find . -type f -size +100M -printf "%k KB %p\n" | sort -rnk 1
```

### 4.2. 找出并且打印文件大小

```bash
find . -name '*.txt' -exec ls -lh {} +
find . -name '*.txt' -printf "%p %k KB\n"
```
