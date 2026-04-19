---
title: "02. Go 中的代码静态分析工具：go vet"
weight: 902
---

# Go 中的代码静态分析工具：go vet

`go vet` 是 Go 自带的静态分析工具，用于检查代码中语法正确但可能有问题的模式。

> 注意：`go vet` 不会检查代码风格问题，那是 gofmt 等 formatter 的职责。

## 示例

对于以下代码：

```go
package main

import "fmt"

func main() {
	fmt.Printf("%s", 123)
	fmt.Printf("%d", "hello")
	fmt.Printf("%v %v", 1)
	fmt.Printf("%s\n")
}
```

一般的 IDE 在编辑时就会提示问题，但是直接运行这段代码是可以执行的。对该项目执行以下命令进行检查：

```bash
go vet ./...
```

输出为：

```plaintext
main.go:6:14: fmt.Printf format %s has arg 123 of wrong type int
main.go:7:14: fmt.Printf format %d has arg "hello" of wrong type string
main.go:8:17: fmt.Printf format %v reads arg #2, but call has 1 arg
main.go:9:14: fmt.Printf format %s reads arg #1, but call has 0 args
```
