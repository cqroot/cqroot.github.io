# 01 - 类型

## 1. Go 类型的零值（Zero values）

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

## 2. Go 中 `new` 和 `make` 的区别

1. `new` 用于计算类型的大小，为其分配零值的内存；`make` 用于分配内存和初始化成员结构。
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

## 3. Go 中有没有引用类型？

Go 没有引用类型。

Go 引用类型术语已经在 2013 年 4 月 [从 Go specification 中删除](https://github.com/golang/go/commit/b34f0551387fcf043d65cd7d96a0214956578f94)，并说明 `spec: Go has no 'reference types'`。 但引用类型的说法还是在社区广泛应用。

参考：[About the terminology "reference type" in Go - Go 101](https://github.com/go101/go101/wiki/About-the-terminology-%22reference-type%22-in-Go)

## 4. Go 中有没有引用传递？

Go 只有值传递，没有引用传递。

## 5. Go 中哪些类型可以比较？

比较是指用 `==` 或 `!=` 判断是否相等。

如果 struct 中含有不能被比较的字段类型，就不能被比较。如果 struct 中所有的字段类型都支持比较，那么就可以被比较。

不可比较类型包括 `slice`、`map`、`function`。他们只能和 `nil` 比较。

> 1. Boolean, numeric, string, pointer, and channel types are strictly comparable.
> 2. Struct types are strictly comparable if all their field types are strictly comparable.
> 3. Array types are strictly comparable if their array element types are strictly comparable.
> 4. Type parameters are strictly comparable if all types in their type set are strictly comparable.

参考：[Comparison operators - Go Spec](https://go.dev/ref/spec#Comparison_operators)
