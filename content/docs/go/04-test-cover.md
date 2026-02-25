---
title: "04. Go 语言中的测试覆盖率"
weight: 4
---

# Go 语言中的测试覆盖率

## 1. `-cover`

`go test -cover` 可以启用代码覆盖率分析。

当您指定 `-coverprofile`、`-covermode` 或 `-coverpkg` 中的任何一个参数时，`go test` 命令会自动启用覆盖率分析，相当于隐式包含了 `-cover` 标志。

## 2. `-covermode`

`-covermode` 可以设置覆盖率分析的模式。有三种模式：

- `set`：**默认**。记录语句是否被执行过（布尔值）。开销最小；
- `count`：记录语句被执行的次数，即整数计数。开销中等；
- `atomic`：类似 `count`，但用于并发程序，使用原子操作计数。开销最大，适用于并行测试环境。

> 当与 `-race` 一起使用时，无论是否显式指定，`-covermode` 都会被强制设为 `atomic`，以确保并发安全。若在命令行中同时指定 `-race` 和其他模式，`go test` 也会以 `atomic` 为准。

## 3. `-coverpkg`

`-coverpkg` 可以指定要分析覆盖率的包：

```bash
go test -cover -coverpkg=package1,package2,...
```

- 默认只分析被测试的包；
- 可以指定多个包（逗号分隔）；
- 支持通配符模式。如 `go test -coverpkg=./...` 或 `go test -coverpkg=myproject/...` 会测试当前模块所有包，

## 4. `-coverprofile`

`-coverprofile` 可以将覆盖率数据输出到文件：

```bash
# 生成覆盖率文件
go test -cover -coverprofile=coverage.out
```

`-coverprofile` 可以生成详细的覆盖率数据文件，生成的文件可以用于生成 HTML 报告或其他分析。

## 5. 覆盖率数据分析

当使用 `-coverprofile` 生成覆盖率数据文件后，可以使用 `go tool cover` 来可视化分析结果：

```bash
# 查看文本报告。会输出函数级别的覆盖率汇总
go tool cover -func=coverage.out

# 查看 HTML 可视化报告。可以显示语句级别的详细覆盖情况
go tool cover -html=coverage.out
```

生成的 HTML 可视化报告中，不同的颜色有不同的含义：

- **绿色**：已覆盖的代码；
- **红色**：未覆盖的代码；
- **灰色**：不计入覆盖率的代码（如注释、单独的括号、`package` 声明、`import` 块等）。
