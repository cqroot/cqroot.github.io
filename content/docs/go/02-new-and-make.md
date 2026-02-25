---
title: "02. Go 语言中 new 和 make 的区别"
weight: 2
---

# Go 语言中 `new` 和 `make` 的区别

1. `new` 用于分配类型 T 所需的内存，并将其初始化为零值；`make` 用于分配内存和初始化成员结构。
2. `new` 的入参类型为任意类型；`make` 的入参类型为 `slice`、`map` 和 `channel`。
3. `new` 的返回值类型为指针；`make` 的返回值类型为入参类型。

```go
package main

import (
        "fmt"
        "reflect"
)

func printType(obj any) {
        fmt.Println(reflect.TypeOf(obj))
}

func main() {
        printType(new(int))          // *int
        printType(new(bool))         // *bool
        printType(new(string))       // *string
        printType(make([]int, 3))    // []int
        printType(make(map[int]int)) // map[int]int
        printType(make(chan int))    // chan int
}
```
