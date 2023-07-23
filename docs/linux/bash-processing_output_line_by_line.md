# Bash 逐行处理输出

## 逐行处理文件

```bash
while read -r line; do echo $line; done < FILENAME
# or
cat FILENAME | while read -r line; do echo "$line"; done
```

## 逐行处理命令输出

```bash
while read -r line; do echo $line; done < <(ls -l)
# or
ls -l | while read -r line; do echo $line; done
```
