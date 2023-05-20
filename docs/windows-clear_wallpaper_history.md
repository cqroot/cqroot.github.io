# Windows 清除壁纸使用历史

Windows 壁纸历史存储在注册表中。

使用 regedit 打开，位于：

```
计算机\HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Wallpapers
```

创建并执行如下内容的 reg 文件即可清除历史记录：

```
Windows Registry Editor Version 5.00
[HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Wallpapers]
"BackgroundHistoryPath0"=-
"BackgroundHistoryPath1"=-
"BackgroundHistoryPath2"=-
"BackgroundHistoryPath3"=-
"BackgroundHistoryPath4"=-
```
