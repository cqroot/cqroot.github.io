# SELinux

## 1. SELinux 三种工作模式

1. Enforcing: 强制模式。表示完全开启。
2. Permissive: 宽松模式。表示功能虽然开启，但只警告不真正限制权限。
3. Disable: 禁用模式。表示关闭 SELinux。

Enforcing 模式和 Permissive 模式切换：

```bash
getenforce    # 查看 SELinux 模式
setenforce 1  # 设置 SELinux 模式为 Enforcing 模式
setenforce 0  # 设置 SELinux 模式为 Permissive 模式
```

开关 SELinux 需要修改配置文件 `/etc/selinux/config` 并重启服务器。

```bash
sed -i 's/^SELINUX=.*$/SELINUX=enforcing/'  /etc/selinux/config
sed -i 's/^SELINUX=.*$/SELINUX=permissive/' /etc/selinux/config
sed -i 's/^SELINUX=.*$/SELINUX=disabled/'   /etc/selinux/config
```

## 2. SELinux 安全上下文

SELinux 安全上下文分为 **进程安全上下文** 和 **文件安全上下文**。

### 2.1. SELinux 进程安全上下文

### 2.2. SELinux 文件安全上下文

```
[root@localhost ~]# # 查看目前 ================================================
[root@localhost ~]# mkdir /opt/test
[root@localhost ~]# ls -Zd /opt/test
drwxr-xr-x. root root unconfined_u:object_r:usr_t:s0   /opt/test
[root@localhost ~]#
[root@localhost ~]# # 查看文件 ================================================
[root@localhost ~]# touch /opt/test/test_file
[root@localhost ~]# ls -Z /opt/test/test_file
-rw-r--r--. root root unconfined_u:object_r:usr_t:s0   /opt/test/test_file
```

修改文件安全上下文：

```bash
chcon --reference=/xxx1 /xxx2            # Change Context. 修改文件安全上下文
restorecon -Rv /xxx                      # Restore Context. 恢复为默认的文件安全上下文
semanage fcontext -l | grep xxx          # 查看 xxx 目录的默认文件安全上下文
semanage fcontext -a -t home_root_t xxx  # 修改 xxx 目录的默认文件安全上下文，搭配 restorecon 使用。
```

注意，`semanage` 和 `restorecon` 是由 `policycoreutils-python` 提供。

## 3. SELinux 布尔值

```bash
getsebool -a  # 查看所有 SELinux 布尔值
```

## 4. 审计日志

格式一般如下：

```
avc: denied { 操作权限 } for pix=xxx comm="进程名" scontext=主体安全上下文 tcontext=客体安全上下文 tclass=访问类型 permissive=0
```

- `{ 操作权限 }` 中的操作权限代表缺少什么权限，如 `write` 即为缺少写权限；
- `scontext` 和 `tcontext` 都是安全上下文，分别称为主体和客体。主体一般是进程，客体是主体访问的资源。说明 `scontext` 对 `tcontext` 缺少写权限；
- `tclass` 代表什么类型的资源，如目录 `dir`。


