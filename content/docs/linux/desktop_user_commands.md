---
title: "桌面用户常用命令"
weight: 99
---

# 桌面用户常用命令

```bash
# 查看本机显卡
lspci | grep -E "VGA|3D"
```

- NVIDIA：回显包含 `NVIDIA Corporation`
- AMD：回显包含 `Advanced Micro Devices`
- Intel：回显包含 `Intel Corporation`
