# 03 - 状态行和标签行

![](https://pics-1324197765.cos.ap-shanghai.myqcloud.com/vim-statusline_and_lualine-1.png)

## 1. 安装插件

```lua title="plugins/init.lua"
    -- statusline and tabline
    {
        "nvim-lualine/lualine.nvim",
        config = function()
            require("plugins.lualine")
        end,
    },
    {
        "akinsho/bufferline.nvim",
        dependencies = "kyazdani42/nvim-web-devicons",
        config = function()
            require("plugins.bufferline")
        end,
    },
```

## 2. 状态行

状态行可以显示当前 buffer 的信息。它并不只是提升了 Neovim 的外观，在日常使用编辑器的过程中也提供了极大的便利。当你想要查看当前 buffer 的编码或换行符等信息，只需要看一眼状态行即可。

```lua title="plugins/lualine.lua"
require("lualine").setup({
    options = {
        icons_enabled = true,
        theme = "auto",
        -- component_separators = "|",
        section_separators = { left = "", right = "" },
        component_separators = { "", "" },
        -- section_separators = { "", "" },
        disabled_filetypes = {
            statusline = {},
            winbar = {},
        },
        ignore_focus = {},
        always_divide_middle = true,
        globalstatus = false,
        refresh = {
            statusline = 1000,
            tabline = 1000,
            winbar = 1000,
        },
    },
    sections = {
        lualine_a = {
            { "mode", separator = { left = "", right = "" }, right_padding = 2 },
        },
        -- lualine_a = { "mode" },
        lualine_b = {
            { "branch", "diff", "diagnostics", separator = { right = "" } },
        },
        lualine_c = { "filename" },
        lualine_x = { "encoding", "fileformat", "filetype" },
        lualine_y = { "progress" },
        -- lualine_z = { "location" },
        lualine_z = {
            { "location", separator = { left = "", right = "" }, left_padding = 2 },
        },
    },
    inactive_sections = {
        lualine_a = {},
        lualine_b = {},
        lualine_c = { "filename" },
        lualine_x = { "location" },
        lualine_y = {},
        lualine_z = {},
    },
    tabline = {},
    winbar = {},
    inactive_winbar = {},
    extensions = {},
})
```


## 3. 标签行

当你打开多个标签并在多个便签中切换时，标签行必不可少。

```lua title="plugins/bufferline.lua"
require("bufferline").setup({
    options = {
        offsets = { { filetype = "neo-tree", text = " ", padding = 0 } },
        show_buffer_close_icons = false,
        show_close_icon = false,
        indicator = {
            icon = "▎", -- this should be omitted if indicator style is not 'icon'
            style = "icon",
        },
        separator_style = "thick",
    },
})
```
