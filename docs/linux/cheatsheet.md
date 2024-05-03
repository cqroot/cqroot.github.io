# Linux Cheatsheet

## 比较两个目录

```bash
diff --brief --recursive dir1 dir2
```

## 输出变化

### 改变输出的 tab 大小

```bash
cat FILE | expand -t4
```

### 将输出按表格输出

```bash
echo STRING | column -t
```

## 用户管理

### 设置执行 sudo 不需要密码

新建文件 `/etc/sudoers.d/YOURUSERNAME`，内容如下：

```
YOURUSERNAME ALL=(ALL) NOPASSWD: ALL
```

你也可以选择将其追加到 `/etc/sudoers` 文件中。

### 设置用户密码过期时间

Linux 密码过期时间默认配置是在 `/etc/login.defs`。

```bash
# 查看 root 用户的密码过期信息
chage -l root

# 修改 root 用户的密码不过期
chage -M 99999 root
```

### 在多次错误输入后用户被锁定

可以修改文件 `/etc/security/faillock.conf` 来改变用户允许输入密码错误的次数。

找到以下行：

```bash
# deny = 3
```

将注释去掉，将 3 改的足够大即可。

## 改变 SSH 超时断连时间

SSH 超时后断连并提示：

```
timed out waiting for input: auto-logout
```

需要修改 `/etc/profile` 的 `TMOUT`:

1. 超时时间设置为一小时：`TMOUT=3600`
2. 没有超时时间：`TMOUT=`

## 统计某列中所有值出现的次数

```bash
xxx | sort | uniq -c | sort -nr
```

- `sort`: 排序。这是为了让重复项排在一起。
- `uniq -c`: 连续的重复项只会显示一个。`-c` 会在每个项目前添加重复次数。
- `sort -nr`: 排序。`-n` 表示按数字排序。`-r` 会按照从大到小排序。

## 替换目录中某个字符串

```bash
grep -rl OLD_STR | xargs -i sed -i 's/OLD_STR/NEW_STR/g' {}
```
