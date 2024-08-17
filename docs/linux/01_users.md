# 01 - Linux 用户

在 Linux 中，通过设置文件的属组和权限，来控制每个用户和组对文件的访问。

## 1. 用户 ID

每个能访问 Linux 操作系统的用户都会被分配一个唯一的用户账户，拥有唯一的用户名和用户 ID，用户名和用户 ID 唯一对应。
用户名是用户用来登录系统所用的最长 8 字符的字符串，由字母和数字组成。`root` 用户是 Linux 系统的管理员，其 ID 是固定分配的 0。

Linux 为系统账户预留了 500 以下的 UID。为普通用户创建用户时，大多数 Linux 发行版会从 500 开始，将第一个可用 UID 分配给该用户。但也并非所有发行版都这样，比如 Ubuntu 就是从 1000 开始的。

使用 `useradd` 命令可以创建一个新用户：

```
[root@localhost ~]# useradd test
```

创建完成后，可以在 `/etc/passwd` 文件中查看到新创建的用户信息：

```
[root@localhost ~]# grep '^test:' /etc/passwd
test:x:1000:1000::/home/test:/bin/bash
```

## 2. passwd 文件

Linux 系统使用一个专门的文件 `/etc/passwd` 来记录用户的信息。每一行为一个用户，内容如下形式：

```
root:x:0:0:root:/root:/bin/bash
bin:x:1:1:bin:/bin:/sbin/nologin
daemon:x:2:2:daemon:/sbin:/sbin/nologin
adm:x:3:4:adm:/var/adm:/sbin/nologin
lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin
sync:x:5:0:sync:/sbin:/bin/sync
shutdown:x:6:0:shutdown:/sbin:/sbin/shutdown
halt:x:7:0:halt:/sbin:/sbin/halt
mail:x:8:12:mail:/var/spool/mail:/sbin/nologin
operator:x:11:0:operator:/root:/sbin/nologin
games:x:12:100:games:/usr/games:/sbin/nologin
ftp:x:14:50:FTP User:/var/ftp:/sbin/nologin
nobody:x:99:99:Nobody:/:/sbin/nologin
systemd-network:x:192:192:systemd Network Management:/:/sbin/nologin
dbus:x:81:81:System message bus:/:/sbin/nologin
polkitd:x:999:998:User for polkitd:/:/sbin/nologin
sshd:x:74:74:Privilege-separated SSH:/var/empty/sshd:/sbin/nologin
postfix:x:89:89::/var/spool/postfix:/sbin/nologin
chrony:x:998:996::/var/lib/chrony:/sbin/nologin
test:x:1000:1000::/home/test:/bin/bash
```

`passwd` 文件的每一行记录了一个用户的信息，用 `:` 分割各个字段。每个字段意义如下：

1. 用户名；
2. 用户密码。每个用户的该字段都被设为 `x`，这并不代表每个用户的密码都是一样的，而是由于历史原因，考虑到安全问题，用 `x` 代替用户密码。
3. 用户 ID；
4. 用户组 ID，默认的，`useradd` 命令会为用户创建一个同名的用户组，并将新用户加入到该组中；
5. 用户账户的文本描述；
6. 用户的家目录路径；
7. 用户的默认 shell。

## 3. 用户的属性

我们在上面新建用户时其实只指定了一个必填参数——用户名，操作系统会自动填充默认值给每个字段。可以使用以下命令查看每个字段的默认值：

```
[root@localhost ~]# useradd -D
GROUP=100
HOME=/home
INACTIVE=-1
EXPIRE=
SHELL=/bin/bash
SKEL=/etc/skel
CREATE_MAIL_SPOOL=yes
```

上面的输出代表，如果你不指定对应的参数：

1. 新用户的家目录会位于 `/home/USERNAME` 下；
2. 新用户的账号密码在过期后不会被禁用；
3. 新用户的账号密码不会设置过期时间；
4. 新用户的默认 shell 为 `/bin/bash`；
5. 操作系统会将 `/etc/skel` 下的内容拷贝到新用户的家目录下；
6. 操作系统会为该用户创建一个用于接收邮件的文件。

我们也可以在创建用户时为每个字段指定特定的值：

```
[root@localhost ~]# useradd -u 2000 -m -d /home/test_home -s /bin/sh test
[root@localhost ~]# grep '^test:' /etc/passwd
test:x:2000:2000::/home/test_home:/bin/sh
```

其中，`-u 2000` 指定了新用户的 ID 为 2000，`-m` 会让操作系统自动创建你的用户家目录文件夹，`-d /home/test_home` 指定了新用户的家目录位置，`-s /bin/sh` 指定了新用户的默认 shell。

## 4. 删除用户

使用 `userdel` 可以从系统中删除用户：

```
[root@localhost ~]# grep '^test:' /etc/passwd
test:x:1000:1000::/home/test:/bin/bash
[root@localhost ~]# userdel test
[root@localhost ~]# grep '^test:' /etc/passwd
```

## 5. 修改用户密码过期时间

Linux 中，用户的密码过期时间默认配置在 `/etc/login.defs`。使用 `chage` 可以查看用户的密码过期时间：

```
[root@localhost ~]# # 查看 test 用户的密码过期信息
[root@localhost ~]# chage -l test
Last password change                                    : Aug 12, 2024
Password expires                                        : never
Password inactive                                       : never
Account expires                                         : never
Minimum number of days between password change          : 0
Maximum number of days between password change          : 99999
Number of days of warning before password expires       : 7
```

使用 `chage` 命令也可以修改用户的密码过期时间，比如将 `test` 用户密码的过期时间设置为 30 天后：

```
[root@localhost ~]# chage -M 30 test
[root@localhost ~]# chage -l test
Last password change                                    : Aug 12, 2024
Password expires                                        : Sep 11, 2024
Password inactive                                       : never
Account expires                                         : never
Minimum number of days between password change          : 0
Maximum number of days between password change          : 30
Number of days of warning before password expires       : 7
```

