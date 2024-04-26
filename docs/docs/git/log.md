# Git Log

`git log` 常用参数

- `--oneline`: 每个提交只显示一行
- `--no-merges`: 忽略 merge 提交

## 获取指定 tag 后所有提交

```bash
# 查看指定 TAG 到当前提交之间的日志
# @ 是 HEAD 的缩写
git log --oneline <TAG>..HEAD
git log --oneline <TAG>..@

# 查看上一个 TAG 到当前提交之间的日志
git log --oneline $(git describe --tags --abbrev=0 @^)..@
```

## 过滤日期和提交者

```bash
git log --pretty=format:"%ad - %an: %s" --after="2016-01-31" --until="2017-03-10" --author="John Doe"
git log --pretty=format:'%C(yellow)%h %Cgreen%ad %Cblue%an%Cred%d %Creset%s' --date=short
```

## 查看某次提交的信息

```bash
# 查看某次提交的文件改动信息
git show --raw {HASH}

# 查看某次提交的改动内容
git diff -stat HASH^ HASH
```
