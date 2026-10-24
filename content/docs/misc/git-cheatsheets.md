+++
date = '2026-08-23T23:20:42+08:00'
title = 'Git 速查表'
+++

## 查找提交

查找添加或删除指定字符串的提交：

```bash
git log -S "要查找的代码" -- 目标文件
```

## 合并提交

```bash
git rebase -i A      # 显示从 A 之后到最新的所有提交（不包含 A）
git rebase -i HEAD~3 # 显示最近的 3 个提交
```

此时会进入编辑器，要显示的提交按照时间从前到后的顺序排序。

你可以将任意提交前的 `pick` 改为 `squash` 或 `s`，保存退出。`squash` 会将该提交合并到它的前一个提交，最终所有连续的 `squash` 提交会一起合并到它们前面的第一个 `pick` 提交。

在这个界面你也可以移动提交的位置，来让它合并到任意提交上。

> 注意：不能把第一个提交改为 `squash`

除了 `squash`，你还可以使用 `fixup`。它们的区别是：

- `squash`：会保留被合并提交的提交信息，让你编辑合并后的信息；
- `fixup`：直接丢弃被合并提交的提交信息，只保留目标提交的信息。

## 基于 main 合并 GitHub Pull Request

GitHub 会把每个 PR 的提交暴露为只读引用 `refs/pull/<编号>/head`，无需添加 remote 即可拉取。

下面的流程先获取远端最新的 `main`，在其基础上新建分支，再合入 PR #115 的内容：

```bash
# 1. 获取远端最新的 main（更新 origin/main）
git fetch origin main

# 2. 基于 origin/main 新建并切换到 pr-115 分支
git switch -c pr-115 origin/main

# 3. 拉取 PR #115 的内容
git fetch origin pull/115/head

# 4. 将 PR 内容合并到当前分支
git merge --no-ff FETCH_HEAD
```

