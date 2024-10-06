# GDB

gcc 增加 `-g` 参数。

| 命令                | 缩写 | 描述             |
| ------------------- | ---- | ---------------- |
| `break lineno/func` | `b`  | 打断点           |
| `backtrace`         | `bt` | 堆栈回溯         |
| `file`              |      | 选择要调试的程序 |
| `info break`        |      |                  |
| `list`              | `l`  | 列出源代码       |
| `next`              | `n`  |                  |
| `run`               | `r`  | 运行             |
| `step`              | `s`  |                  |

## 调试 core 问题

1. 构建时添加 `-g` 参数。如果使用的是 `CMake`，添加 `-DCMAKE_BUILD_TYPE=Debug` 参数；
2. `gdb`；
3. 使用 `file` 命令并传入对应的二进制文件；
4. 使用 `run` 命令并传入对应的参数来运行程序；
5. 使用 `bt` 命令来查看函数调用栈；
