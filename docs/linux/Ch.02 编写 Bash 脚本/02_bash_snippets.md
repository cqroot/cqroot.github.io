# 02 - Bash 常用片段

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
while read -r line; do echo $line; done < FILENAME
# or
cat FILENAME | while read -r line; do echo "$line"; done
```

### 2.2. 逐行处理命令输出

```bash
while read -r line; do echo $line; done < <(ls -l)
# or
ls -l | while read -r line; do echo $line; done
```

## 3. 打印连续数字

```bash
# 打印数字 1 到 10
seq 1 10

# 打印等宽的数字 1 到 10
seq -w 1 10
```

## 4. Find

### 4.1. 找出大于某个大小的文件

```bash
find . -type f -size +100M
find . -type f -size +100M -printf "%k KB %p\n" | sort -rnk 1
```

### 4.2. 找出并且打印文件大小

```bash
find . -name '*.txt' -exec ls -lh {}
find . -name '*.txt' -printf "%p %k KB\n"
```
