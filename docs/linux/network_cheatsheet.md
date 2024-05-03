# Linux 网络命令

| 命令                  | 说明                                  |
| --------------------- | ------------------------------------- |
| `ip`                  |                                       |
| `ip address` / `ip a` | 显示所有 IP 地址和属性信息            |
| `ip route`            | 显示路由信息                          |
| `route`               |                                       |
| `route -n`            | 显示路由信息                          |
| `netstat`             |                                       |
| `netstat -lntp`       | 显示正在监听的 tcp 端口和对应进程信息 |
| `ethtool`             |                                       |
| `ethtool -S eth0`     | 显示 eth0 的统计信息                  |

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
