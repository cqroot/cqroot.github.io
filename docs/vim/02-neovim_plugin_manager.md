# 02 - Neovim 插件管理器

在转用 `Neovim` 前，我在 `Vim` 下使用了很久的 [vim-plug](https://github.com/junegunn/vim-plug) 来管理我的插件。`vim-plug` 的配置非常简单，但功能又足够强大。

转用 `Neovim` 后，我选择了 [lazy.nvim](https://github.com/folke/lazy.nvim)。`lazy.nvim` 完全使用 `lua` 配置，功能强大。

## 1. 安装 lazy.nvim

```lua title="lua/plugins/init.lua"
-- Bootstrap lazy.nvim
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not (vim.uv or vim.loop).fs_stat(lazypath) then
    local lazyrepo = "https://github.com/folke/lazy.nvim.git"
    local out = vim.fn.system({ "git", "clone", "--filter=blob:none", "--branch=stable", lazyrepo, lazypath })
    if vim.v.shell_error ~= 0 then
        vim.api.nvim_echo({
            { "Failed to clone lazy.nvim:\n", "ErrorMsg" },
            { out, "WarningMsg" },
            { "\nPress any key to exit..." },
        }, true, {})
        vim.fn.getchar()
        os.exit(1)
    end
end
vim.opt.rtp:prepend(lazypath)

require("lazy").setup({
    {
        "navarasu/onedark.nvim",
        init = function()
            require("onedark").load()
        end,
    },
})
```

```lua title="init.lua"
require("plugins")
```
