---
title: "Linux 的初始化系统：SysV init、Systemd"
weight: 1
---

# Linux 的初始化系统：SysV init、Systemd

## 1. SysV init

SysV init 源自 AT&T 的 UNIX System V，是 Linux 发行版沿用最久的初始化系统。

它通过运行级别（Runlevel）定义系统状态，并依靠数字排序的 Shell 脚本串行地启动或停止服务。

CentOS 6 及更早版本、Ubuntu 14.10 及更早版本就使用的 SysV init。

配置文件 `/etc/inittab` 里会设定默认运行级别；`/etc/init.d/` 目录下存放着服务脚本；

系统定义了 0 到 6 七个运行级别 (Runlevels)，每个级别代表一种系统状态，比如：

- `0`：关机
- `1`：单用户模式（维护模式）
- `2`：多用户，无网络（Debian/Ubuntu 默认）
- `3`：多用户，无图形界面（完全命令行）
- `4`：保留，未定义（通常等同于 runlevel 3）
- `5`：多用户，带图形界面
- `6`：重启

`/etc/rc0.d/` 到 `/etc/rc6.d/` 这 7 个目录，分别对应各个运行级别。当你进入某个运行级别（如级别 3）时，系统就会执行 `/etc/rc3.d/` 目录下的所有脚本。

`/etc/rc?.d/` 目录里放的并非脚本本身，而是指向 `/etc/init.d/` 中脚本的符号链接。链接的命名格式决定了执行顺序和行为：

- `K##name`：以 `K` 开头表示杀死 (Kill) 或停止该服务。`##` 是一个两位数字（如 `10`, `20`, `99`），数字越小越先执行。
- `S##name`：以 `S` 开头表示启动 (Start) 该服务。

系统会先按数字顺序执行所有 `K*` 脚本（停止不需要的服务），然后再按数字顺序执行所有 `S*` 脚本（启动需要的服务）。

你可以使用 `chkconfig`（Red Hat/CentOS 系标准工具）或 `sysv-rc-conf`（Debian/Ubuntu 系常用工具）来管理服务的开机自启。

## 2. Systemd

systemd 彻底抛弃了“运行级别”和“脚本编号”的概念，转而使用更灵活的 target（目标）和 unit（单元）。

### 2.1. Target

target 是一组 unit 的集合，代表系统的一种状态。常用 target：

| Target              | 功能               | 对应 SysV Runlevel |
| ------------------- | ------------------ | ------------------ |
| `poweroff.target`   | 关机               | 0                  |
| `rescue.target`     | 单用户救援模式     | 1                  |
| `multi-user.target` | 多用户，无图形界面 | 3                  |
| `graphical.target`  | 多用户，带图形界面 | 5                  |
| `reboot.target`     | 重启               | 6                  |

查看当前 target：

```bash
systemctl get-default
```

设置默认 target：

```bash
systemctl set-default multi-user.target
```

### 2.2. Unit

unit 是 systemd 管理服务的基本单元，类型包括：

- **service**：最常见类型，管理后台服务进程
- **socket**：套接字单元，用于延迟启动
- **timer**：定时器单元，替代 cron
- **path**：文件系统路径监控
- **mount**：文件系统挂载点

unit 配置文件存放于：

- `/lib/systemd/system/`：软件包提供的默认配置
- `/etc/systemd/system/`：用户自定义配置

### 2.3. systemctl 常用命令

```bash
# 启动/停止/重启服务
systemctl start nginx
systemctl stop nginx
systemctl restart nginx

# 查看服务状态
systemctl status nginx

# 开机自启管理
systemctl enable nginx   # 启用开机自启
systemctl disable nginx  # 禁用开机自启
systemctl is-enabled nginx  # 查看是否启用

# 查看运行中的服务
systemctl list-units --type=service --state=running

# 查看所有已启用服务（含开机自启）
systemctl list-unit-files --type=service

# 立即停止服务（不影响开机自启）
systemctl stop nginx

# 重载配置（不中断连接）
systemctl reload nginx

# 查看依赖关系
systemctl list-dependencies nginx
```

### 2.3. 服务 vs systemctl

SysV init 与 systemd 的命令对照：

| 操作     | SysV init               | Systemd                     |
| -------- | ----------------------- | --------------------------- |
| 启动服务 | `service name start`    | `systemctl start name`      |
| 停止服务 | `service name stop`     | `systemctl stop name`       |
| 重启服务 | `service name restart`  | `systemctl restart name`    |
| 查看状态 | `service name status`   | `systemctl status name`     |
| 开机自启 | `chkconfig name on`     | `systemctl enable name`     |
| 关闭自启 | `chkconfig name off`    | `systemctl disable name`    |
| 查看自启 | `chkconfig name --list` | `systemctl is-enabled name` |

### 2.4. 日志管理

journald 是 systemd 的集中日志服务，取代了传统的 syslog。

```bash
# 查看所有日志
journalctl

# 查看本次启动日志
journalctl -b

# 实时跟踪日志
journalctl -f

# 查看指定服务日志
journalctl -u nginx

# 查看错误级别以上的日志
journalctl -p err

# 查看指定时间范围的日志
journalctl --since "2024-01-01 00:00:00" --until "2024-01-02 00:00:00"
```
