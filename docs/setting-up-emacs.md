# 配置 Emacs

## 通用基础配置

```lisp
(global-linum-mode 1)
(setq inhibit-startup-screen t)
(load-theme 'tango-dark t)

(if (window-system)
    (progn
        (tool-bar-mode 0)
        (menu-bar-mode 0)
        (scroll-bar-mode 0)
        (set-frame-font "Cascadia Code 12")
        (set-frame-height (selected-frame) 25)
        (set-frame-width (selected-frame) 80)
    )
)
```
