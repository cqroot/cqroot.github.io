---
title: "Shell 启动类型与配置文件"
weight: 1
---

# Shell 启动类型与配置文件

## 1. Shell 的启动类型

Shell 的启动类型可以从登录状态和交互状态两个维度分类：

1. 登录状态
   - 登录 Shell (Login Shell)：需要完整用户认证（需要输入用户名/密码登录）；
   - 非登录 Shell (Non-login Shell)：无需登录过程，在已有会话中启动。
2. 交互状态
   - 交互式 (Interactive Shell)：等待用户输入命令，有提示符；
   - 非交互式 (Non-interactive Shell)：执行脚本或命令，无提示符。

综合来说分为以下四类：

- 非交互式非登录 Shell：
  - 执行脚本的场景；
  - `ssh user@host 'cmd'`，可以理解为 SSH 登录后执行 `/bin/bash -c 'cmd'`。
- 交互式非登录 Shell：在终端中执行 `bash`、`su user` 命令或在图形界面启动新终端。
- 交互式登录 Shell：
  - `su -` 或 `sudo -i` 切换用户；
  - SSH 交互式登录：`ssh user@host`（不带命令）。
- 非交互式登录 Shell：指定 `--login, -l` 选项的场景，如 `bash -l script.sh` 等，该场景较少见；

## 2. Shell 的配置文件

- 非登录场景，仅加载以下配置文件：
  1. `/etc/bash.bashrc` (部分发行版为 `/etc/bashrc`)
  2. `~/.bashrc`
- 登录场景，加载顺序如下。
  1. `/etc/profile`
  2. `/etc/profile.d/*.sh`
  3. 加载下方**第一个存在**的配置文件：
     - `~/.bash_profile`
     - `~/.bash_login`
     - `~/.profile`

> Login Shell 不会读取 `~/.bashrc`。
> 为了让 Login Shell 也加载 `.bashrc`，常见做法是在 ~/.bash_profile 中显式添加：
>
> ```bash
> if [ -f ~/.bashrc ]; then
>     . ~/.bashrc
> fi
> ```
