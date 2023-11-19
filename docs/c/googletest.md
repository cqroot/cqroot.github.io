# GoogleTest

## 命令行参数

| 参数                                       | 说明                                                                   |
| ------------------------------------------ | ---------------------------------------------------------------------- |
| `--gtest_list_tests`                       | 列出所有测试用例                                                       |
| -                                          |                                                                        |
| `--gtest_filter=FooTest.*`                 | 执行 test suite `FooTest` 下所有的测试用例                             |
| `--gtest_filter=FooTest.BarTest`           | 执行 `FooTest.BarTest`                                                 |
| `--gtest_filter=FooTest.*-FooTest.BarTest` | 执行 test suite `FooTest` 下所有的测试用例，但不包括 `FooTest.BarTest` |
| `--gtest_filter=*Null*:*Constructor*`      | 执行所有名字包含 `Null` 或 `Constructor`                               |
