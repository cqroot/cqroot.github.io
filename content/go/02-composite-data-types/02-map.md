+++
date = '2026-10-06T19:14:52+08:00'
title = '02. Go 语言中的 map 类型'
weight = 20
+++

## 1. Go 语言中 `map` 使用时的注意事项

### 1.1. Map 在并发读写时需要加锁

Go 语言中 `map` 是并发不安全的。

并发读写或并发写同一个 `map` 会触发运行时的 fatal error（如 `concurrent map read and map write`、`concurrent map writes`）。这类错误由运行时直接抛出，**无法通过 `recover` 捕获**，程序会立即崩溃。只有并发读取（不涉及写）才是安全的。

如果需要并发安全，可以使用 `sync.Map` 或自行加 `sync.RWMutex`。

### 1.2. Map 的元素不可取址

当 map 的元素为结构体类型的值时，无法直接修改结构体中的字段值。如果要修改，有两种方法：

- 使用结构体的指针类型。
- 取出结构体，修改后设置回去。

### 1.3. `map` 多次 `for range` 的顺序不一定一样

Go 运行时会主动随机化 `map` 的遍历顺序，因此每一次 `for range` 的起点都可能不同，多次遍历的顺序不保证一致。Go 规范也明确规定：`map` 的迭代顺序未指定，且不保证两次迭代的顺序相同。

> The iteration order over maps is not specified and is not guaranteed to be the same from one iteration to the next.
>
> —— [For statements with range clause - Go Spec](https://go.dev/ref/spec#For_range)

```go
package main

import (
	"fmt"
)

func main() {
	m := map[string]string{
		"1": "v1",
		"2": "v2",
		"3": "v3",
	}

	for i := range 10 {
		fmt.Printf("Count: %d\n", i)
		for k, v := range m {
			fmt.Println(k, v)
		}
		fmt.Println()
	}
}
```

> 上面的 `for i := range 10` 使用了 Go 1.22 引入的整数 `range` 语法；在更早的版本中需要写成 `for i := 0; i < 10; i++`。

## 2. 参考

- [For statements with range clause - Go Spec](https://go.dev/ref/spec#For_range)
