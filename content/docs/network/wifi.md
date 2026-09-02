+++
date = '2026-08-24T23:55:00+08:00'
title = 'Linux 连接 Wi-Fi'
+++

## 1. NetworkManager (`nmcli`)

NetworkManager 是目前大多数 Linux 桌面发行版的默认网络管理工具，`nmcli` 是其命令行前端。

### 1.1. 查看可用网络

```bash
nmcli device wifi list
```

### 1.2. 连接到一个开放或已保存的网络

```bash
nmcli device wifi connect "SSID" password "PASSWORD"
```

连接成功后凭据会自动保存，下次进入该网络范围时会自动连接。

### 1.3. 连接隐藏 SSID

```bash
nmcli device wifi connect "SSID" password "PASSWORD" hidden yes
```

### 1.4. 查看已保存的连接

```bash
nmcli connection show
```

### 1.5. 手动激活 / 断开已保存的连接

```bash
nmcli connection up "SSID"
nmcli connection down "SSID"
```

### 1.6. 忘记一个已保存的网络

```bash
nmcli connection delete "SSID"
```

### 1.7. 开启 / 关闭 Wi-Fi 硬件

```bash
nmcli radio wifi on
nmcli radio wifi off
```

## 2. iwd (`iwctl`)

`iwd`（iNet Wireless Daemon）是 Intel 推出的轻量级替代方案，部分发行版默认使用它。配置文件路径为 `/etc/iwd/`，密码以散列形式存储（更安全）。

### 2.1. 查看可用网络

```bash
iwctl station wlan0 scan
iwctl station wlan0 get-networks
```

### 2.2. 连接网络

```bash
iwctl station wlan0 connect "SSID"
```

如果网络有密码，会提示输入；预先在配置文件中指定密码也可以：

```bash
iwctl station wlan0 connect "SSID" -P "PASSWORD"
```

### 2.3. 断开连接

```bash
iwctl station wlan0 disconnect
```

### 2.4. 显示当前状态

```bash
iwctl station wlan0 show
```

## 3. `wpa_supplicant`

`wpa_supplicant` 是 Linux 上历史最悠久的 Wi-Fi 客户端，几乎所有发行版都能用，适合在 NetworkManager / iwd 不可用的精简环境（服务器、容器等）。

### 3.1. 生成加密的密码配置

将明文密码写入配置文件存在安全风险，可以使用 `wpa_passphrase` 生成散列：

```bash
wpa_passphrase "SSID" "PASSWORD"
```

输出形如：

```
network={
    ssid="SSID"
    #psk="PASSWORD"
    psk=4f8b...c0a3
}
```

### 3.2. 写入配置文件

```bash
wpa_passphrase "SSID" "PASSWORD" | sudo tee /etc/wpa_supplicant/wpa_supplicant.conf
```

### 3.3. 启动 wpa_supplicant

```bash
sudo wpa_supplicant -B -i wlan0 -c /etc/wpa_supplicant/wpa_supplicant.conf
```

参数说明：

- `-B`：后台运行
- `-i wlan0`：指定无线网卡
- `-c`：指定配置文件

### 3.4. 自动获取 IP 地址

```bash
sudo dhclient wlan0
```

或者使用 `systemd-networkd` 等。

### 3.5. 排查问题

前台运行并打印调试信息：

```bash
sudo wpa_supplicant -i wlan0 -c /etc/wpa_supplicant/wpa_supplicant.conf -d
```

## 4. 查看信号强度

```bash
watch -n 1 cat /proc/net/wireless
```

`/proc/net/wireless` 是内核实时统计的无线网卡信息，典型输出：

```
Inter-| sta-|   Quality        |   Discarded packets               | Missed | WE
 face | tus | link level noise |  nwid  crypt   frag  retry   misc | beacon | 22
 wlan0: 0000   65.  -45.  -95.        0      0      0      0     49        0
```

其中关键三列：

- `link`：链路质量百分比（0–100）
- `level`：信号强度，单位 dBm（**负数，绝对值越小信号越强**）
- `noise`：环境噪声底，单位 dBm

例如 `wlan0: 65. -45. -95.` 表示信号质量 65%、信号强度 -45 dBm、噪声 -95 dBm。

dBm 经验值：

| 信号强度      | 体验               |
| ------------- | ------------------ |
| -30 ~ -50 dBm | 满格，速率最高     |
| -50 ~ -60 dBm | 良好，正常使用     |
| -60 ~ -70 dBm | 一般，偶有抖动     |
| -70 ~ -80 dBm | 较弱，网页加载变慢 |
| < -80 dBm     | 几乎不可用，易断流 |

## 5. 参考

1. [nmcli(1) — Linux manual page](https://man7.org/linux/man-pages/man1/nmcli.1.html)
2. [iwctl — iwd project documentation](https://iwd.wiki.kernel.org/iwctl)
3. [wpa_supplicant(8) — Linux manual page](https://man7.org/linux/man-pages/man8/wpa_supplicant.8.html)
