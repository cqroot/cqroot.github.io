# Bash Snippets

## 逐行处理输出

### 逐行处理文件

```bash
while read -r line; do echo $line; done < FILENAME
# or
cat FILENAME | while read -r line; do echo "$line"; done
```

### 逐行处理命令输出

```bash
while read -r line; do echo $line; done < <(ls -l)
# or
ls -l | while read -r line; do echo $line; done
```

## 获取脚本所在路径

```bash
# 脚本所在路径
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)

# 脚本所在路径的父路径
PARENT_DIR=$(dirname "${SCRIPT_DIR}")
```

## 统计某列中所有值出现的次数

```bash
xxx | sort | uniq -c | sort -nr
```

- `sort`: 排序。这是为了让重复项排在一起。
- `uniq -c`: 连续的重复项只会显示一个。`-c` 会在每个项目前添加重复次数。
- `sort -nr`: 排序。`-n` 表示按数字排序。`-r` 会按照从大到小排序。
