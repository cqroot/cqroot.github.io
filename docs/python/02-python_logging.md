# 03 - Python logging 模块

## 1. 使用全局配置

日志打印到控制台：

```python
import logging

logging.basicConfig(
    format="[%(asctime)s] [%(levelname)5s] [%(name)s] [%(pathname)s:%(lineno)d] %(message)s",
    level=logging.DEBUG,
)
logging.addLevelName(logging.WARNING, "WARN")

logging.debug("Debug message")
logging.info("Info message")
logging.warning("Warning message")
logging.error("Error message")
logging.critical("Critial message")
```

保存到文件：

```python
logging.basicConfig(
    level=logging.DEBUG,  # 控制台打印的日志级别
    filename="new.log",
    filemode="a",
    format="[%(asctime)s] [%(levelname)5s] [%(name)s] [%(pathname)s:%(lineno)d] %(message)s",
)
```

## 2. 日志格式中可用的字段

| 字段                | 描述                                                                         |
| ------------------- | ---------------------------------------------------------------------------- |
| %(name)s            | Logger的名字                                                                 |
| %(levelno)s         | 数字形式的日志级别                                                           |
| %(levelname)s       | 文本形式的日志级别                                                           |
| %(pathname)s        | 调用日志输出函数的模块的完整路径名，可能没有                                 |
| %(filename)s        | 调用日志输出函数的模块的文件名                                               |
| %(module)s          | 调用日志输出函数的模块名                                                     |
| %(funcName)s        | 调用日志输出函数的函数名                                                     |
| %(lineno)d          | 调用日志输出函数的语句所在的代码行                                           |
| %(created)f         | 当前时间，用UNIX标准的表示时间的浮点数表示                                   |
| %(relativeCreated)d | 输出日志信息时的，自Logger创建以 来的毫秒数                                  |
| %(asctime)s         | 字符串形式的当前时间。默认格式是 “2003-07-08 16:49:45,896”。逗号后面的是毫秒 |
| %(thread)d          | 线程ID。可能没有                                                             |
| %(threadName)s      | 线程名。可能没有                                                             |
| %(process)d         | 进程ID。可能没有                                                             |
| %(message)s         | 用户输出的消息                                                               |

## 3. 使用 logger

```python
import logging


def get_logger(name):
    logger = logging.getLogger(name)

    logging.addLevelName(logging.WARNING, "WARN")
    formatter = logging.Formatter(
        "[%(asctime)s] [%(levelname)5s] [%(name)s] [%(pathname)s:%(lineno)d] %(message)s"
    )
    logger.setLevel(logging.INFO)

    # stdout
    stream_handler = logging.StreamHandler()
    stream_handler.setFormatter(formatter)
    logger.addHandler(stream_handler)

    # file
    file_handler = logging.FileHandler("./%s.log" % name, "a")
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)

    return logger


logger = get_logger("test")
logger.debug("Debug message")
logger.info("Info message")
logger.warning("Warning message")
logger.error("Error message")
```
