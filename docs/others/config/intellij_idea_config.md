# 配置 IntelliJ IDEA

## Settings

### Editor

#### General

- Code Completion：取消选择 `Match case` 以使补全不区分大小写。

#### Code Style

在 General 标签页下，将 `Line separator` 设置为 `Unix and maxOS (\n)`。

- Java：选择 `Imports`，将 `Class count to use import with '*'` 改为 0，以禁止 idea 使用 `import *`。

### Plugins

- IdeaVim
- Atom Material Icons
- Rainbow Brackets Lite
- Active Tab Highlighter

## .ideavimrc

```vimscript
let mapleader = ";"
nmap <leader>rn  <Action>(RenameElement)
nmap H           <Action>(QuickJavaDoc)
```
