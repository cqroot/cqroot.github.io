# 定制 Bash 提示符样式

## 1. PS1 变量

Bash 的提示符样式由环境变量 `PS1` 决定。使用 `echo $PS1` 可以查看当前提示符样式。

`PS1` 中可以使用以下变量：

- \u：用户名；
- \h：仅取主机的第一个名字；
- \W：利用 `basename` 取得工作目录名称，所以只会列出最后一个目录；
- \w：完整的工作目录名称；
- \$：提示字符，如果是 `root` 时，提示符为：`#` ，普通用户则为：`$`；
- \d：代表日期，格式为 `weekday month date`，例如：`Mon Aug 1`；
- \H：完整的主机名称；
- \h：取主机的第一个名字；
- \T：显示时间为 24 小时格式，如：`HH:MM:SS`；
- \t：显示时间为 12 小时格式 , 如：`HH:MM:SS`；
- \A：显示时间为 12 小时格式：HH：MM；
- \v：Bash 的版本信息；
- #：下达的第几个命令。

## 2. 设置颜色

在 `PS1` 中设置字符颜色的格式为：`[\e[F;Bm]`，其中 `F` 为字体颜色，编号为 30-37，`B` 为背景颜色，编号为 40-47。

**颜色：**

| 颜色   | 前景色 | 背景色 |
| ------ | ------ | ------ |
| 黑色   | 30     | 40     |
| 红色   | 31     | 41     |
| 绿色   | 32     | 42     |
| 黄色   | 33     | 43     |
| 蓝色   | 34     | 44     |
| 紫红色 | 35     | 45     |
| 青蓝色 | 36     | 46     |
| 白色   | 37     | 47     |

**特殊显示：**

| 数值 | 作用          |
| ---- | ------------- |
| 0    | OFF，关闭颜色 |
| 1    | 高亮显示      |
| 4    | 显示下划线    |
| 5    | 闪烁显示      |
| 7    | 反白显示      |
| 8    | 颜色不可见    |

## 3. 设置提示符样式

```shell
PS1=[\u@\h \W]\$
```

修改为

```shell
PS1='\[\e[32;8m\][\u@\h \W]\$\[\e[0m\]'
```
