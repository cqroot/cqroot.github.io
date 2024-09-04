# 09 - 使用 unittest 模块编写单元测试

## 1. 编写一个简单的测试用例

```python title="math_methods.py"
#!/usr/bin/env python
# -*- coding: utf-8 -*-


def add(a, b):
    return a + b
```

```python title="math_methods_test.py"
#!/usr/bin/env python
# -*- coding: utf-8 -*-

import unittest
import math_methods


class TestMathMethods(unittest.TestCase):

    def test_add(self):
        self.assertEqual(math_methods.add(1, 2), 3)


if __name__ == "__main__":
    unittest.main()
```
