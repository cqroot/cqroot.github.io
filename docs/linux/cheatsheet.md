# Linux Cheatsheet

## 检测端口连通性

```bash
echo > /dev/tcp/127.0.0.1/8080
```

```bash
nc -z 127.0.0.1 8080
```

```bash
telnet 127.0.0.1 8080
```

## 比较两个目录

```bash
diff --brief --recursive dir1 dir2
```

## 改变输出的 tab 大小

```bash
cat FILE | expand -t4
```

## 设置执行 sudo 不需要密码

新建文件 `/etc/sudoers.d/YOURUSERNAME`，内容如下：

```
YOURUSERNAME ALL=(ALL) NOPASSWD: ALL
```

你也可以选择将其追加到 `/etc/sudoers` 文件中。

## 设置用户密码过期时间

Linux 密码过期时间默认配置是在 `/etc/login.defs`。

```bash
# 查看 root 用户的密码过期信息
chage -l root

# 修改 root 用户的密码不过期
chage -M 99999 root
```

## 在多次错误输入后用户被锁定

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

