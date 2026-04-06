---
title: "3.1 Go 语言中的 defer、panic 和 recover"
weight: 301
---

# Go 语言中的 `defer`、`panic` 和 `recover`

## 1. `defer`：延迟执行

`defer` 可以让函数或语句在当前函数执行完毕前执行。无论当前函数是正常返回还是 `panic`，`defer` 都会执行。

### 1.1. LIFO（后进先出）的执行顺序

```go
// 输出依次为 4、3、2、1
func main() {
	defer fmt.Println(1)
	defer fmt.Println(2)
	defer fmt.Println(3)
	fmt.Println(4)
}
```

### 1.2. 立即求值，延迟执行

```go
// 输出为 1
func main() {
	i := 1
	defer fmt.Println(i)
	i = 2
}
```

### 1.3. 可以修改命名返回值

```go
func f() (res int) {
	defer func() { res = 2 }()
	res = 1
	return
}

// 输出为 2
func main() {
	fmt.Println(f())
}
```

## 2. `panic`：不可恢复的错误

`panic` 表示程序遇到了无法继续执行的错误，会立即停止当前函数的执行，沿调用栈向上展开，执行沿途的 `defer`，最终导致程序崩溃（除非被 `recover` 捕获）。

## 3. `recover`：拦截 `panic`

`recover` 只在 `defer` 函数中有效，可以捕获当前 goroutine 的 `panic`，让程序恢复执行。捕获后返回 `panic` 传入的值。
