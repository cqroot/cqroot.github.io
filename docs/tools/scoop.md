# Scoop - Windows 软件包管理器

## 1. 安装

```bash
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
```

## 2. 常用命令

```bash
# 设置 PowerShell 代理
[net.webrequest]::defaultwebproxy = new-object net.webproxy "http://127.0.0.1:7890"

# 更新已安装的所有包
scoop update *
```
