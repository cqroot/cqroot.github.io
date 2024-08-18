# 02 - Linux 用户组

## 1. group 文件

和用户类似，用户组的信息也保存在一个文件中。`/etc/group` 的内容示例如下：

```text title="/etc/group"
root:x:0:
bin:x:1:
daemon:x:2:
sys:x:3:
adm:x:4:
tty:x:5:
disk:x:6:
lp:x:7:
mem:x:8:
kmem:x:9:
wheel:x:10:
cdrom:x:11:
mail:x:12:postfix
man:x:15:
dialout:x:18:
floppy:x:19:
games:x:20:
tape:x:33:
video:x:39:
ftp:x:50:
lock:x:54:
audio:x:63:
nobody:x:99:
users:x:100:
utmp:x:22:
utempter:x:35:
input:x:999:
systemd-journal:x:190:
systemd-network:x:192:
dbus:x:81:
polkitd:x:998:
ssh_keys:x:997:
sshd:x:74:
postdrop:x:90:
postfix:x:89:
chrony:x:996:
```

`group` 文件的每一行记录了一个用户组的信息，用 `:` 分割各个字段。每个字段意义如下：

1. 用户组名；
2. 用户组密码。和用户一样，由于历史原因，每个用户组的该字段都被设为 `x`。
3. 用户组 ID；
4. 属于该用户组的用户列表，每个用户通过 `,` 分割。

要注意的是，有些用户组的用户列表中没有任何用户，这并不一定是说这些组没有成员。当一个用户在 `/etc/passwd` 文件中指定某个组作为主要组时，该用户不会作为该组成员再出现在 `/etc/group` 文件中。

## 2. 修改用户组
