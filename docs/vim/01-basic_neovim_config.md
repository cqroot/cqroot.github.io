# 01 - Neovim 基础配置

Neovim 的配置文件可以通过 `Vimscript` 或 `lua` 来编写。一般推荐使用 `lua`。

- Linux 下 Neovim 的配置目录位于：`~/.config/nvim`。
- Windows 下 Neovim 的配置目录位于：`%LOCALAPPDATA%/nvim`。

Neovim 在启动时会自动加载配置目录下的 `init.lua` 文件。

通常不推荐将所有的配置内容都放在 `init.lua` 中。我们可以创建一个单独的文件来配置一些基础的选项，位于配置目录下的 `lua/options.lua`，内容如下：

```lua title="lua/options.lua"
vim.opt.mouse = "a"  -- 启用鼠标
vim.opt.completeopt = { "menu", "menuone", "noselect" }

-- 不生成临时文件
vim.opt.backup = false
vim.opt.writebackup = false
vim.opt.swapfile = false

-- 搜索相关
vim.opt.ignorecase = true     -- 搜索时忽略大小写
vim.opt.wildignorecase = true -- 匹配文件名是忽略大小写

-- 缩进相关
vim.opt.smarttab = false
vim.opt.smartindent = true
vim.opt.autoindent = true
vim.opt.tabstop = 4
vim.opt.softtabstop = 4
vim.opt.shiftwidth = 4

-- 显示相关
vim.opt.termguicolors = true
vim.opt.cursorline = true          -- 显示当前光标所在水平线
vim.opt.cursorcolumn = true        -- 显示当前光标所在垂直线
vim.opt.colorcolumn = { 80, 120 }  -- 在 80 列和 120 列显示垂直线
vim.opt.number = true              -- 显示行号
vim.opt.relativenumber = false     -- 显示相对行号

-- 不可见字符的显示样式
vim.opt.conceallevel = 0
vim.opt.list = true
vim.opt.listchars = {
    space = "·",
    -- tab = "» ",
    tab = "│ ",
    trail = "·",
    nbsp = "·",
    eol = "↴",
}

-- 文件格式
vim.opt.fileformats = { "unix", "dos" }
vim.opt.fixendofline = false
```

然后在 `init.lua` 中去载入它：

```lua title="init.lua"
require("options")
```
