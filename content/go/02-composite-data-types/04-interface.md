+++
date = '2026-10-05T02:35:50+08:00'
title = '04. Go 语言中的 Interface'
+++

## 1. `interface`

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
