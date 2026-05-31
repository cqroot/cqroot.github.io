---
title: "03. Go 语言中的结构体类型"
weight: 1
---

# Go 语言中的结构体类型

## 1. 定义与实例化

```go
// 定义一个 User 结构体
type User struct {
	Name  string
	Age   int
	Email string
}

// 多种实例化方式
func main() {
	// 方式 1
	u1 := User{
		Name:  "Bob",
		Age:   30,
		Email: "bob@example.com",
	}

	// 方式 2
	u2 := new(User) // 返回指针，字段初始化为零值
	u2.Name = "Charlie"

	// 方式 3：& 取地址
	u3 := &User{Name: "David"}
}
```

## 2. 结构体的零值

结构体的零值是其所有字段为零值的组合：

```go
type Config struct {
	Host    string
	Port    int
	Enabled bool
}

func main() {
	var config Config
	fmt.Printf("Host: %q, Port: %d, Enabled: %v\n",
		config.Host, config.Port, config.Enabled)
	// 输出：Host: "", Port: 0, Enabled: false
}
```

## 3. 赋值和传参

赋值和传参都会复制整个结构体。如果需要修改原值或避免大结构体复制带来的开销，使用指针。

```go
func main() {
	u1 := User{Name: "Bob", Age: 30}
	modifyByValue(u1)
	fmt.Println(u1.Name) // 输出：Bob，原值未被修改

	modifyByPointer(&u1)
	fmt.Println(u1.Name) // 输出：David，指针可以修改原值
}

func modifyByValue(u User) {
	u.Name = "Charlie"
}

func modifyByPointer(u *User) {
	u.Name = "David"
}
```

## 4. 方法定义

Go 的方法可以定义在值接收者或指针接收者上：

```go
type Rectangle struct {
    Width, Height float64
}

// 值接收者：不会修改原值
func (r Rectangle) Area() float64 {
    return r.Width * r.Height
}

// 指针接收者：可以修改原值
func (r *Rectangle) Scale(factor float64) {
    r.Width *= factor
    r.Height *= factor
}

//指针接收者：可以避免大结构体复制带来的性能开销
func (r *Rectangle) Perimeter() float64 {
    return 2 * (r.Width + r.Height)
}
```

- 如果需要修改接收者，选择指针接收者；
- 如果结构体很大，选择指针接收者来避免复制；
- 如果结构体小而且不可变，选择值接收者。
