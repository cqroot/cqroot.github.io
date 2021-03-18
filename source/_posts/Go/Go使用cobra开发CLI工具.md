---
title: Go使用cobra开发CLI工具
date: 2021-03-18 23:35:42
---

# Go使用cobra开发CLI工具

[cobra](https://github.com/spf13/cobra)是一个用来构建现代CLI工具的库。相比`flag`标准库，它提供更多方便的特性，比如补全、智能提示错误等等。

## 开发cobra应用

cobra推荐的项目结构如下：

```
+ cmd/
    root.go
    add.go
    your.go
    commands.go
    here.go
  main.go
```

所有命令放在项目根目录下的cmd目录中。其中，默认命令（即不输入任何命令）为root.go。

cobra应用的main.go非常简单，通常如下：

```go
package main

import (
	"{pathToYourApp}/cmd"
)

func main() {
	cmd.Execute()
}
```

## 创建rootCmd

root.go的内容如下：

```go
package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:   "demo",
	Short: "A cobra demo",
	Long:  `A cobra demo. xxx...`,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Println("execute root cmd.")
	},
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}
```

此时，执行`go run main.go --help`，可以看到以下输出：

```go
A cobra demo. xxx...

Usage:
  demo [flags]

Flags:
  -h, --help   help for demo
```

直接执行`go run main.go`会打印`execute root cmd.`。

## 创建其他命令

我们再创建一个`print`命令。一般每个命令在`cmd`下都有一个自己的文件。只需要在`cmd`下再新建一个`print.go`，内容如下：

```go
package cmd

import (
    "fmt"

    "github.com/spf13/cobra"
)

func init() {
    rootCmd.AddCommand(printCmd)
}

var printCmd = &cobra.Command{
    Use:   "print",
    Short: "print something",
    Long:  "print something, xxx",
    Run: func(cmd *cobra.Command, args []string) {
        fmt.Println("execute print cmd")
    },
}
```

此时再执行`go run main.go --help`可以看到已经增加了`print`命令：

```
A cobra demo. xxx...

Usage:
  demo [flags]
  demo [command]

Available Commands:
  help    Help about any command
  print       print something

Flags:
  -h, --help   help for demo

Use "demo [command] --help" for more information about a command.
```

## 创建flag

在执行`print`命令时，我们想传递一些参数，来指定打印的内容，这时我们就需要增加flags。

flags分为`persistent flag`和`local flags`。`persistent flag`可以分配给当前命令及其所有子命令，而`local flags`只应用于当前命令。

这里给`print`命令增加一个`local flags`：

```
package cmd

import (
    "fmt"

    "github.com/spf13/cobra"
)

func init() {
    rootCmd.AddCommand(printCmd)

    printCmd.Flags().StringVarP(&Msg, "message", "m", "default message", "message to be printed")
}

var Msg string
var printCmd = &cobra.Command{
    Use:   "print",
    Short: "print something",
    Long:  "print something, xxx",
    Run: func(cmd *cobra.Command, args []string) {
        fmt.Println(Msg)
    },
}
```

这时再使用`go run main.go print`会打印默认内容`default message`，也可以使用`-m`或`--message`来指定要打印的内容了。