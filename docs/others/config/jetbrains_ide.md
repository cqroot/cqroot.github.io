# 配置 JetBrains IDE

## Settings

### Appearance & Behavior

#### New UI

- 选中 `Enable new UI`
- 选中 `Compact mode`

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

## Vim Keymap 设置

| Shortcut | IDE Action | Handler |
| -------- | ---------- | ------- |
| Ctrl+D   |            | Vim     |
| Ctrl+F   |            | IDE     |
| Ctrl+S   |            | IDE     |
| Ctrl+U   |            | Vim     |

## 定制工具条

在顶端标题栏处的工具条右键，选择 `Customize Main Toolbar`。

在 Center 中 `Add Action`，选择 `Main Menu` -> `Navigate` 中的 `Back` 和 `Forward`。
