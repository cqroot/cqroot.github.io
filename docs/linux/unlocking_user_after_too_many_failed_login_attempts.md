# Linux 在多次错误输入后用户被锁定

可以修改文件 `/etc/security/faillock.conf` 来改变用户允许输入密码错误的次数。

找到以下行：

```bash
# deny = 3
```

将注释去掉，将 3 改的足够大即可。
