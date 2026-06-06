---
title: "网络"
weight: 1
---

# 网络

## 1. Bond

Bond（网卡绑定）是 Linux 内核中的一项功能，一共有 7 种工作模式（mode 0~6），它能将多块物理网卡“虚拟”成一块逻辑网卡。这样做的主要目的是为了提升网络带宽、实现冗余备份（防止单点故障），或者两者兼顾。

查看 Bond 口运行模式的方法是：

```bash
grep '^Bonding Mode:' /proc/net/bonding/<BOND_NAME>
```

不同 Bond 模式的输出如下：

|  模式  | 名称           | Bonding Mode 输出                       |
| :----: | :------------- | :-------------------------------------- |
| mode 0 | balance-rrg    | `load balancing (round-robin)`          |
| mode 1 | active-backupg | `fault-tolerance (active-backup)`       |
| mode 2 | balance-xorg   | `load balancing (xor)`                  |
| mode 3 | broadcastg     | `fault-tolerance (broadcast)`           |
| mode 4 | 802.3adg       | `IEEE 802.3ad Dynamic link aggregation` |
| mode 5 | balance-tlbg   | `transmit load balancing`               |
| mode 6 | balance-albg   | `adaptive load balancing`               |
