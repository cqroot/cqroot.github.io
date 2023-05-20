# Linux 检测端口连通性

```bash
echo > /dev/tcp/127.0.0.1/8080
```

```bash
nc -z 127.0.0.1 8080
```

```bash
telnet 127.0.0.1 8080
```
