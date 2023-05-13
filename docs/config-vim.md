# 配置 Vim

## 通用基础配置

```vim
filetype plugin indent on       " 文件类型检查，载入缩进规则
syntax enable
syntax on
set nocompatible                " 不与vi兼容
set noautochdir                 " 不自动切换工作目录
set autoread                    " 文件外部更改时自动读取
set backspace=2                 " 可以用backspace删除
set noerrorbells                " 出错时不发出响声
set novisualbell                " 出错时没有视觉提示
set nobackup                    " 不创建备份文件（~）
set noswapfile                  " 不创建交换文件（.swp）
set nowritebackup               " 不创建写入备份文件
set noundofile                  " 不创建撤销历史文件
set concealcursor="nvic"
set conceallevel=2
set hlsearch                    " 搜索结果高亮
set incsearch                   " 搜索时动态跟随
set ignorecase                  " 搜索时忽略大小写
set scrolloff=3                 " 垂直滚动时，光标距离底部的位置
set wrap                        " 自动折行
set mouse=a                     " 支持使用鼠标
set showmatch                   " 高亮匹配括号
set tabstop=4
set softtabstop=4
set shiftwidth=4
set expandtab                   " 用空格替代制表符
set smarttab
set smartindent
set autoindent
set encoding=utf-8
set fileformats=unix,dos
set ruler                       " 底部状态栏显示当前行列数
set showmode                    " 底部状态栏显示模式
set showcmd                     " 底部状态栏显示输入的命令
set t_Co=256
set list
set listchars=tab:›\ ,trail:■,extends:#,nbsp:.
set number!                     " 行号
set cursorline                  " 高亮当前行
set wildmenu
set wildmode=longest:full,full  " 输入命令时按Tab显示候选列表，再按一次选择
```

## 可选配置

```vim
set relativenumber              " 相对行号
set cursorcolumn                " 高亮当前列
set colorcolumn=80              " 在 80 列处显示限制线
autocmd FIletype html,javascript,vue setlocal tabstop=2 softtabstop=2 shiftwidth=2 expandtab " 前端缩进为 2
```

## GVim 配置

```vim
set guioptions-=T
set guioptions-=m
set guioptions-=L
set guifont=CaskaydiaCove_NFM:h12,Cascadia_Code:h12,FiraCode_NF:h12,Fira_Code:h12,Consolas:h12,Courier_New:h12
```
