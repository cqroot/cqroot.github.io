---
title: "Go 语言中类型的零值"
weight: 1
---

# Go 语言中类型的零值

- 数值类型的零值为 `0`；
- 布尔类型的零值为 `false`；
- 字符串类型的零值为 `""`；
- 指针、函数、接口、`slice`、`channel` 和 `map` 的零值为 `nil`。

```go
package main

import "fmt"

func main() {
        var emptyInt int
        var emptyBool bool
        var emptyStr string

        fmt.Println("Zero value for int: ", emptyInt)    // 0
        fmt.Println("Zero value for bool:", emptyBool)   // false
        fmt.Println("Zero value for string: ", emptyStr) // ""
}
```

参考：

1. [The zero value - Go Spec](https://go.dev/ref/spec#The_zero_value)
2. [Zero values - A Tour of Go](https://go.dev/tour/basics/12)
