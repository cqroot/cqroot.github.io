# MSYS2 安装和配置

```bash
scoop bucket add main
scoop install main/msys2
```

```bash
# 配置清华源
sed -i "s#https\?://mirror.msys2.org/#https://mirrors.tuna.tsinghua.edu.cn/msys2/#g" /etc/pacman.d/mirrorlist*
# 更新系统和已安装的软件
pacman -Syu
# 安装常用的软件
pacman -S \
    gcc \
    tmux \
    mingw-w64-x86_64-neovim \
    mingw-w64-x86_64-ripgrep

PATH=/mingw64/bin:${PATH}
```
