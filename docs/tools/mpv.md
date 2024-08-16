# MPV - 视频播放器

![screenshot-mpv.jpg](https://pics-1324197765.cos.ap-shanghai.myqcloud.com/screenshot-mpv.jpg)

[MPV](https://mpv.io/) [GitHub](https://github.com/mpv-player/mpv)

## 安装

### Windows (Scoop)

```bash
scoop bucket add extras
scoop install extras/mpv
```

## 配置

MPV 的配置文件目录，在 Windows 下位于 `%APPDATA%/mpv/`，在 Linux 下位于 `~/.config/mpv`。

> 在 Windows 下，MPV 的安装目录里会有一个名为 `portable_config` 的目录，该目录下的配置优先级是最高的。如果你在 `%APPDATA%/mpv/` 下的配置没有生效的话，先删除 `portable_config` 目录。

### 基础配置

配置目录的 `mpv.conf` 里可以配置一些基础选项：

```conf
keep-open=yes      # 视频播放完毕后不关闭窗口
osd-font-size=30   # 设置界面字体
volume=0           # 默认音量为 0
loop-playlist=inf  # 按播放列表循环
```

### 配置快捷键

快捷键的配置可以通过配置目录的 `input.conf` 来配置。

```conf
RIGHT seek  5         # 向后跳 5s
LEFT  seek -5         # 向前跳 5s
UP     add volume 2   # 音量 +
DOWN   add volume -2  # 音量 +

# 倍速
# *********************************************************
[ add speed -0.1        # 速度减少 0.1
] add speed 0.1         # 速度增加 0.1
{ multiply speed 1/1.1  # 速度减少 1.1 倍
} multiply speed 1.1    # 速度增加 1.1 倍
BS set speed 1.0        # 重置为正常速度

Ctrl+r cycle_values video-rotate "90" "180" "270" "0"  # 视频旋转，每次顺时针旋转 90 度

q no-osd set idle yes; stop  # 退出
```
