# Bash Cheatsheet

## 条件判断

| 条件                       | 说明               |
| -------------------------- | ------------------ |
| **字符串**                 |                    |
| `[[ -z "$STR" ]]`          | 字符串为空         |
| `[[ -n "$STR" ]]`          | 字符串非空         |
| `[[ "$STR1" == "$STR2" ]]` | 字符串相等         |
| `[[ "$STR1" != "$STR2" ]]` | 字符串不相等       |
| **数字**                   |                    |
| `[[ NUM1 -eq NUM2 ]]`      | NUM1 等于 NUM2     |
| `[[ NUM1 -ne NUM2 ]]`      | NUM1 不等于 NUM2   |
| `[[ NUM1 -lt NUM2 ]]`      | NUM1 小于 NUM2     |
| `[[ NUM1 -le NUM2 ]]`      | NUM1 小于等于 NUM2 |
| `[[ NUM1 -gt NUM2 ]]`      | NUM1 大于 NUM2     |
| `[[ NUM1 -ge NUM2 ]]`      | NUM1 大于等于 NUM2 |
| **文件**                   |                    |
| `[[ -f FILE ]]`            | 文件存在           |
| `[[ -d FILE ]]`            | 目录存在           |
| `[[ -e FILE ]]`            | 文件或目录存在     |
| `[[ -h FILE ]]`            | 文件是符号链接     |
| `[[ -r FILE ]]`            | 文件可读           |
| `[[ -w FILE ]]`            | 文件可写           |
| `[[ -x FILE ]]`            | 文件可执行         |
| `[[ -s FILE ]]`            | 文件尺寸大于 0     |

## 参数

| 变量 | 说明                     |
| ---- | ------------------------ |
| `$@` | 所有变量（分割的字符串） |
| `$*` | 所有变量（独立的字符串） |
| `$#` | 变量数量                 |

## 退出状态

| 返回值 | 说明                  |
| ------ | --------------------- |
| 0      | 成功                  |
| 126    | 找到命令但不可执行    |
| 127    | 没有找到该命令        |
| 128+N  | 被编号为 N 的信号终止 |
