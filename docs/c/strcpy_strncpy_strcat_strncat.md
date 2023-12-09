# strcpy_s, strncpy_s, strcat_s, strncat_s

## strcpy_s

```c
char *strcpy(char *dest, const char *src);                                        // until C99
char *strcpy(char *restrict dest, const char *restrict src);                      // since C99
errno_t strcpy_s(char *restrict dest, rsize_t destsz, const char *restrict src);  // since C11
```

- dest: 指向要写入的字符串指针。
- destsz: 要写入的最大字符数量，通常是目标缓冲区的大小。
- src: 指向要从中复制的字符串指针。

## strncpy_s

```c
char *strncpy(char *dest, const char *src, size_t count);                    // until C99
char *strncpy(char *restrict dest, const char *restrict src, size_t count);  // since C99
errno_t strncpy_s(char *restrict dest, rsize_t destsz,
                  const char *restrict src, rsize_t count);                  // since C11
```

- dest: 指向要写入的字符串指针。
- destsz: 目标缓冲区的大小。
- src: 指向要从中复制的字符串指针。
- count: 要复制的最大字符数。

## strcat_s

```c
char *strcat(char *dest, const char *src);                                        // until C99
char *strcat(char *restrict dest, const char *restrict src);                      // since C99
errno_t strcat_s(char *restrict dest, rsize_t destsz, const char *restrict src);  // since C11
```


- dest: 指向要追加的字符串指针。
- destsz: 要写入的最大字符数量，通常是目标缓冲区的大小。
- src: 指向要从中复制的字符串指针。

## strncat_s

```c
char *strncat(char *dest, const char *src, size_t count );                   // until C99
char *strncat(char *restrict dest, const char *restrict src, size_t count);  // since C99
errno_t strncat_s(char *restrict dest, rsize_t destsz,
                  const char *restrict src, rsize_t count);                  // since C11
```

- dest: 指向要追加的字符串指针。
- destsz: 目标缓冲区的大小。
- src: 指向要从中复制的字符串指针。
- count: 要复制的最大字符数。
