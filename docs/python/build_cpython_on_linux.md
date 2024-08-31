# Linux 下构建 cpython

## 1. 修改系统默认 python 版本

设置默认的 python 版本：

```bash
sudo rm -f /usr/bin/python
sudo ln -s python2 /usr/bin/python
```

## 2. 构建指定版本的 cpython

```bash
python_tag=2.7
git clone https://github.com/python/cpython.git -b "${python_tag}" "cpython-${python_tag}"
cd "cpython-${python_tag}"

./configure
make
```

## 3. 检查所安装的 python 版本

```bash
./python --version
```
