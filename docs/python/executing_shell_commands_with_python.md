# Python 执行 shell 命令

Python 执行 shell 命令，并获取脚本返回值、脚本输出到 stdout 的内容、脚本输出到 stderr 的内容（各版本兼容）：

```python
import shlex
import subprocess
import sys


def run_command(command):
    process = subprocess.Popen(
        shlex.split(command), stdout=subprocess.PIPE, stderr=subprocess.PIPE
    )
    out, err = process.communicate()
    ret = process.poll()

    if sys.version_info[0] == 3:
        return (
            ret,
            out.decode("utf-8"),
            err.decode("utf-8"),
        )
    return ret, out, err
```
