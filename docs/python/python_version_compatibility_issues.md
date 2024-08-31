# Python 常见版本兼容性问题

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## print

在 Python 2 下，`print` 是一个内置语句，通过 `print "string"` 的方式使用。

在 Python 3 下，`print` 是一个内置函数，通过 `print("string")` 的方式使用。

<Tabs>
  <TabItem value="Python 2.x" label="Python 2.x" default>
    ```python
    print "blah blah"
    ```
  </TabItem>
  <TabItem value="Python 3.x" label="Python 3.x">
    ```python
    print("blah blah")
    ```
  </TabItem>
  <TabItem value="All versions" label="All versions">
    ```python
    from __future__ import print_function
    print("blah blah", 123)
    ```
  </TabItem>
</Tabs>

## str.format

<Tabs>
  <TabItem value="All versions" label="All versions" default>
    ```python
    "str: {0}, int: {1}.".format("string", 10)
    "str: %s, int: %d." % ("string", 10)
    ```
  </TabItem>
  <TabItem value="Python 2.7+" label="Python 2.7+">
    ```python
    "str: {}, int: {}.".format("string", 10)
    ```
  </TabItem>
</Tabs>

## 整数除法返回整数

<Tabs>
  <TabItem value="Python 2.x" label="Python 2.x" default>
    ```python
    3 / 2
    type(3 / 2)
    ```
  </TabItem>
  <TabItem value="Python 3.x" label="Python 3.x">
    ```python
    3 // 2
    type(3 // 2)
    ```
  </TabItem>
</Tabs>

## 整数除法返回浮点数

<Tabs>
  <TabItem value="All versions" label="All versions" default>
    ```python
    3 * 1.0 / 2
    type(3 * 1.0 / 2)
    ```
  </TabItem>
  <TabItem value="Python 3.x" label="Python 3.x">
    ```python
    3 / 2
    type(3 / 2)
    ```
  </TabItem>
</Tabs>
