# Linux 设置执行 sudo 不需要密码

新建文件 `/etc/sudoers.d/YOURUSERNAME`，内容如下：

```
YOURUSERNAME ALL=(ALL) NOPASSWD: ALL
```

你也可以选择将其追加到 `/etc/sudoers` 文件中。
