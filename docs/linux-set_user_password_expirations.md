# Linux 设置用户密码过期时间

Linux 密码过期时间默认配置是在 `/etc/login.defs`。

```bash
# 查看 root 用户的密码过期信息
chage -l root

# 修改 root 用户的密码不过期
chage -M 99999 root
```
