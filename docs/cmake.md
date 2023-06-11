# CMake 语法

CMakeLists.txt:

```cmake
cmake_minimum_required(VERSION 3.4.1)     # 指定 CMake 最小版本
project(PROJECT_NAME)                     # 指定项目名称

add_executable(${PROJECT_NAME} main.cpp)  # 生成可执行文件
add_library(common STATIC util.cpp)       # 生成静态库
add_library(common SHARED util.cpp)       # 生成动态库或共享库

add_library(demo demo.cpp test.cpp util.cpp)
```
