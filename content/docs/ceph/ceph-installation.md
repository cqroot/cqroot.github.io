+++
date = '2026-11-13T23:31:40+08:00'
title = 'Ceph 安装'
+++

## 1. 在所有节点修改主机名

以第一个节点为例。

**1. 使用 hostnamectl 设置新主机名**

```bash
sudo hostnamectl set-hostname ceph-node1
```

**2. 更新 /etc/hosts 文件**

编辑 `/etc/hosts`，找到类似 `127.0.1.1 旧主机名` 的那一行，将其修改为：

```
127.0.1.1   ceph-node1
```

**3. 验证修改**
你可以新开一个终端会话，或者运行以下命令来确认静态主机名是否已更新：

```bash
hostnamectl status
```

查看输出中的 “Static hostname” 一项是否已变为新名称。另外，直接运行 `hostname` 命令也能看到当前生效的主机名。

## 2. 在所有节点创建 cephadmin 用户并配置 sudo

创建用户：

```bash
sudo useradd -m -s /bin/bash cephadmin
sudo passwd cephadmin
```

配置免密 sudo：

```bash
echo "cephadmin ALL=(ALL) NOPASSWD:ALL" | sudo tee /etc/sudoers.d/cephadmin
sudo chmod 0440 /etc/sudoers.d/cephadmin
```

切换到 `cephadmin` 用户，确认可免密执行 sudo：

```bash
su - cephadmin
sudo whoami   # 应输出 root
```

## 3. 在所有节点安装容器运行时与依赖

```bash
sudo apt update
sudo apt install -y podman
```

## 4. 在所有节点创建 ceph 用户和用户组

```bash
sudo groupadd -g 167 ceph
sudo useradd -u 167 -g 167 -r -s /sbin/nologin ceph
```

## 5. 在引导节点安装 cephadm 工具

在第一个节点（ceph-node1） 上，以 `cephadmin` 用户操作。

```bash
sudo apt install -y cephadm python3-ceph-common
```

检查主机前置条件：

```bash
sudo cephadm check-host
```

应看到 `Host looks OK` 或仅提示可忽略的警告。

## 6. 在引导节点引导集群

在第一个节点（ceph-node1） 上，以 `cephadmin` 用户操作。

```bash
sudo cephadm bootstrap --mon-ip 192.168.10.111
```

引导完成后，可以执行以下命令进入容器环境验证引导结果：

```bash
sudo cephadm shell -- ceph -s
```

应看到集群状态为 HEALTH_OK 或 HEALTH_WARN，因为暂时还没有 OSD。

## 7. 在引导节点分发 SSH 公钥到其他节点

Cephadm 需要能免密 SSH 到其他节点以部署守护进程。

在 `/etc/hosts` 中添加其他节点：

```bash
192.168.10.111 ceph-node1
192.168.10.179 ceph-node2
192.168.10.247 ceph-node3
```

引导后，公钥位于 `/etc/ceph/ceph.pub`。在 `ceph-node1` 上以 `cephadmin` 用户将公钥分发到 `ceph-node2`、`ceph-node3` 的 `cephadmin` 账户：

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh

ssh-copy-id -f -i /etc/ceph/ceph.pub cephadmin@ceph-node1
ssh-copy-id -f -i /etc/ceph/ceph.pub cephadmin@ceph-node2
ssh-copy-id -f -i /etc/ceph/ceph.pub cephadmin@ceph-node3
```

## 8. 在引导节点添加节点到集群

进入 shell：

```bash
sudo cephadm shell
```

在 shell 内添加节点（使用主机名，前提是 `/etc/hosts` 已正确解析）：

```bash
# 让集群的 SSH 用户从 root 切换为 cephadmin
ceph cephadm set-user cephadmin

ceph orch host add ceph-node2 192.168.10.179
ceph orch host add ceph-node3 192.168.10.247
```

验证节点列表：

```bash
ceph orch host ls
```

## 9. 在引导节点部署 OSD

进入 shell：

```bash
sudo cephadm shell
```

查看所有磁盘：

```bash
ceph orch device ls
```

> 如果节点上的硬盘发生了变化，执行 `ceph orch device ls --wide --refresh` 来重新扫描主机上的存储设备并查看。

让 Ceph 自动消费所有节点上可用的空闲设备：

```bash
ceph orch apply osd --all-available-devices
```

或精确指定某块盘（例如 ceph1 的 `/dev/vdb`）：

```bash
ceph orch daemon add osd ceph-node1:/dev/vdb
```

查看 OSD 部署进度：

```bash
ceph orch ps --daemon-type osd
ceph -s
```

等待 OSD 全部 `running`，集群状态应恢复为 `HEALTH_OK`。
