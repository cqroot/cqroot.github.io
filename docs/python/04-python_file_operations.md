# 04 - Python 文件操作

## 写文件

为了保证文件的完整性，可以先写入临时文件，写入完成后再重命名。示例如下：

```python
import os
import shutil

filename = "./test.txt"
tmp_filename = "%s_tmp" % filename

# 如果临时文件已经存在，先删除
if os.path.isfile(tmp_filename):
    os.remove(tmp_filename)

with open(tmp_filename, "w") as f:
    f.write("line 1\n")
    f.write("line 2\n")

# 使用临时文件覆盖目标文件
shutil.move(tmp_filename, filename)
```

注意，最后的重命名操作使用 `os.rename(tmp_filename, filename)` 也可以实现，但是当源文件和目标文件不在同一个分区、驱动器、设备上时不能完成重命名。

上面的示例在 Python 2.6 及以上版本都可以运行。Python 2.5 以下版本不支持 `with` 语句。
