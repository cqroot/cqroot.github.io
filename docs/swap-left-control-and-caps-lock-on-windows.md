# Windows 下交换左 Ctrl 和 Caps Lock 键

## Windows 下交换的方法

Windows 下，常见的有两种方法来交换左 Ctrl 和 Caps Lock 键：

1. 通过注册表修改。
   1. 优点：系统级的完美交换。
   2. 缺点：每次交换和恢复都需要重启计算机。
2. 使用 AutoHotkey 脚本。
   1. 优点：更灵活，功能更强大。
   2. 缺点：脚本需要一直在后台运行。在一些特殊情况下情况下会失效。

这里只介绍修改注册表交换的方法。

## 修改注册表来交换

`capslock-leftcontrol-swap.reg`：

```ini
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Keyboard Layout]

"Scancode Map"=hex:00,00,00,00,00,00,00,00,03,00,00,00,1d,00,3a,00,3a,00,1d,00,00,00,00,00
```

## 修改注册表来取消交换

`capslock-leftcontrol-reset.reg`：

```ini
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Control\Keyboard Layout]

"Scancode Map"=-
```

## 参考

1. [Swap Control and Caps Lock on Windows](https://www.mavjs.org/post/swap-ctrl-and-capslock-on-windows/)
