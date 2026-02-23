---
title: "Go 语言中类型的零值"
weight: 1
---

# Go 语言中类型的零值

在 Go 中，当变量被声明但没有显式初始化时，会被赋予一个默认值，即零值。

- 数值类型的零值为 `0`；
- 布尔类型的零值为 `false`；
- 字符串类型的零值为 `""`；
- 指针、函数、接口、`slice`、`channel` 和 `map` 的零值为 `nil`；
- 数组的零值是由其元素类型零值组成的数组，如 `var arr [3]int` 的零值是 `[0 0 0]`。

```go
var emptyInt int
var emptyBool bool
var emptyStr string

fmt.Printf("Zero value for int: %d\n", emptyInt)    // 0
fmt.Printf("Zero value for bool: %t\n", emptyBool)  // false
fmt.Printf("Zero value for string: %q\n", emptyStr) // ""
```

参考：

1. [The zero value - Go Spec](https://go.dev/ref/spec#The_zero_value)
2. [Zero values - A Tour of Go](https://go.dev/tour/basics/12)
