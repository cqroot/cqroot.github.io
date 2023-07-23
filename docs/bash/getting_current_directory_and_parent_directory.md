# Bash 获取脚本所在路径

```bash
# 脚本所在路径
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)

# 脚本所在路径的父路径
PARENT_DIR=$(dirname "${SCRIPT_DIR}")
```
