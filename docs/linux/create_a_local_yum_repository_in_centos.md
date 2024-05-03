# CentOS 部署本地 yum 源

## 1. 安装 http 服务

```bash
yum install httpd -y
```

apache httpd 的默认端口是 80，如果被占用要改端口，去 /etc/httpd/conf/httpd.conf 中修改 Listen 即可，另外服务目录、文件目录等都在里面配置，修改完后需要重启`systemctl restart httpd.service`。

## 2. 拷贝 rpm 包

将 rpm 包拷贝到 /var/www/html/yum-custom，然后使用 `createrepo .` 重建索引。

createrepo 安装使用命令 `yum install createrepo -y`。

## 3. 修改 yum 源

在 /etc/yum.repos.d 新建一个 repo 文件，内容如下：

```bash
[yum-custom]
name=yum-custom
baseurl=http://{你的ip}/yum-custom/
enable=1
gpgcheck=0
```

## 4. 更新缓存

```bash
yum clean all
yum makecache
```
