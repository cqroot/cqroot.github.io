# Linux 改变 SSH 超时断连时间

SSH 超时后断连并提示：

```
timed out waiting for input: auto-logout
```

需要修改 `/etc/profile` 的 `TMOUT`:

1. 超时时间设置为一小时：`TMOUT=3600`
2. 没有超时时间：`TMOUT=`
