# 配置 Emacs

## 通用基础配置

```lisp
(global-linum-mode 1)
(global-hl-line-mode 1)
(global-auto-revert-mode 1)
(delete-selection-mode 1)
(setq inhibit-startup-screen t)
(setq make-backup-files nil)
(load-theme 'tango-dark t)
(set-face-background hl-line-face "azure4")
(set-face-foreground 'mode-line "white")
(set-face-background 'mode-line "dim gray")
(set-face-attribute 'mode-line nil :box nil)
(set-face-attribute 'mode-line-inactive nil :box nil)

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
