+++
date = '2026-10-05T02:35:50+08:00'
title = '04. Go 语言中的 Interface'
weight = 40
+++

## 1. `interface` 的运行时表示

`interface` 类型的定义有两个，一个是空 `interface` 的定义：`eface` ([src/runtime/runtime2.go#eface](https://github.com/golang/go/blob/go1.26.8/src/runtime/runtime2.go#L189))，一个是带方法的 `interface` 的定义：`iface` ([src/runtime/runtime2.go#iface](https://github.com/golang/go/blob/go1.26.8/src/runtime/runtime2.go#L184))。

```go
type iface struct {
	tab  *itab
	data unsafe.Pointer
}

type eface struct {
	_type *_type
	data  unsafe.Pointer
}
```

空 `interface` 的值由两部分组成：类型（`type`） 和值（`data`）。一个 `interface` 等于 `nil`，必须类型和值同时为 `nil`。

## 2. 接口的声明

### 2.1. 基本语法

接口使用 `type` 和 `interface` 关键字声明，方法只写签名，不写实现；接口中也不能声明字段：

```go
type Person interface {
	Name() string
	Speak()
}
```

实现接口的方法必须与接口中声明的**方法名、参数列表和返回值完全一致**。

接口名通常以 `-er` 结尾（如 `Reader`、`Writer`、`Stringer`），方法数量较少时更符合 Go 的习惯。

### 2.2. 空接口

不包含任何方法的接口称为空接口，写作 `interface{}`：

```go
var a interface{} = 42
var b any = "hello" // Go 1.18+，any 是 interface{} 的别名
```

所有类型都实现了空接口，因此空接口可以用来承载任意值。使用时通常需要通过类型断言还原具体类型。

### 2.3. 接口嵌入

接口可以嵌入其他接口，从而组合出更大的接口：

```go
type Reader interface {
	Read(p []byte) (n int, err error)
}

type Writer interface {
	Write(p []byte) (n int, err error)
}

type ReadWriter interface {
	Reader
	Writer
}
```

`ReadWriter` 的方法集等于 `Reader` 与 `Writer` 的并集。自 Go 1.14 起，嵌入的接口如果有重复方法，只要签名完全相同就是允许的。

### 2.4. 方法集

方法集决定了「哪些类型实现了某个接口」：

- 类型 `T` 的方法集包含所有**值接收者**方法；
- 类型 `*T` 的方法集包含所有**值接收者**和**指针接收者**方法。

因此 `*T` 总是能实现 `T` 能实现的接口，反过来则不一定。

## 3. 接口与结构体

### 3.1. 结构体隐式实现接口

Go 没有 `implements` 关键字。只要一个类型实现了接口中声明的**全部方法**，就自动实现了该接口：

```go
type Rect struct {
	W, H float64
}

func (r Rect) Area() float64      { return r.W * r.H }
func (r Rect) Perimeter() float64 { return 2 * (r.W + r.H) }

var s Shape = Rect{W: 3, H: 4}
fmt.Println(s.Area()) // 12
```

不只是结构体，任何自定义类型只要实现了对应方法，都可以实现接口。

### 3.2. 值接收者与指针接收者

```go
type Counter struct {
	n int
}

func (c *Counter) Inc() { c.n++ }

type Incer interface {
	Inc()
}

var _ Incer = &Counter{} // OK：*Counter 的方法集包含 Inc
// var _ Incer = Counter{} // 编译错误：Counter 的方法集不包含 Inc
```

需要注意：即使某个 `Counter` 变量可寻址、能写 `c.Inc()`（编译期自动取地址为 `&c`），也**不代表** `Counter` 实现了 `Incer`。赋给接口时看的是类型自身的方法集。

### 3.3. 接口变量的赋值

接口变量保存的是「动态类型 + 动态值」：

```go
var s Shape

s = Rect{W: 3, H: 4}  // 动态类型 Rect，动态值 Rect{3, 4}
s = &Rect{W: 3, H: 4} // 动态类型 *Rect，动态值是指针
```

由于 `Rect` 的方法使用值接收者，`Rect` 和 `*Rect` 都实现了 `Shape`。如果方法使用指针接收者，则只有 `*Rect` 实现接口。

### 3.4. 类型断言

需要从接口取回具体类型时，使用类型断言：

```go
var s Shape = Rect{W: 3, H: 4}

r, ok := s.(Rect)  // 安全断言：ok 表示断言是否成功
fmt.Println(r, ok) // {3 4} true

// r2 := s.(Rect)  // 不带 ok 时，断言失败会 panic
```

### 3.5. 类型切换

根据接口的动态类型执行不同分支：

```go
switch v := s.(type) {
case Rect:
	fmt.Println("Rect", v.Area())
case *Rect:
	fmt.Println("*Rect", v.Area())
default:
	fmt.Printf("unknown type: %T\n", v)
}
```

### 3.6. 编译期校验实现

可以用空白标识符在编译期检查某个类型是否实现了接口：

```go
var _ Shape = Rect{}        // 检查值类型
var _ Shape = (*Rect)(nil)  // 检查指针类型
```

如果未实现，编译会直接报错。这种写法适合放在类型定义附近，避免接口变更后实现悄悄失效。

### 3.7. `nil` 接口陷阱

接口为 `nil` 的条件是**动态类型和动态值都为 nil**：

```go
var p *Rect
var s Shape = p
fmt.Println(s == nil) // false
```

此时 `s` 的动态类型是 `*Rect`、动态值是 `nil`，所以 `s != nil`。如果 `Shape` 的方法使用值接收者，调用 `s.Area()` 会因解引用 nil 指针而 panic；如果使用指针接收者，则可以在方法内部判断接收者是否为 `nil` 并做相应处理。

### 3.8. 接口作为结构体字段

接口常用于依赖注入和解耦：

```go
type Logger interface {
	Log(msg string)
}

type Service struct {
	logger Logger
}

func NewService(l Logger) *Service {
	return &Service{logger: l}
}

func (s *Service) Do() {
	s.logger.Log("doing something")
}
```

`Service` 不依赖具体的日志实现，只依赖 `Logger` 接口。测试时可以传入 mock，生产环境可以传入真实实现，从而降低耦合。

## 4. 常见标准库接口

| 接口           | 方法                                  | 说明                        |
| :------------- | :------------------------------------ | :-------------------------- |
| `error`        | `Error() string`                      | 表示错误                    |
| `fmt.Stringer` | `String() string`                     | 自定义 `%v` / `%s` 的输出   |
| `io.Reader`    | `Read(p []byte) (n int, err error)`   | 读取数据                    |
| `io.Writer`    | `Write(p []byte) (n int, err error)`  | 写入数据                    |
| `io.Closer`    | `Close() error`                       | 关闭资源                    |

参考：

1. [Interface types - Go Spec](https://go.dev/ref/spec#Interface_types)
2. [Method sets - Go Spec](https://go.dev/ref/spec#Method_sets)
3. [Type assertions - Go Spec](https://go.dev/ref/spec#Type_assertions)
4. [Type switches - Go Spec](https://go.dev/ref/spec#Type_switches)
5. [Interfaces - A Tour of Go](https://go.dev/tour/methods/9)
