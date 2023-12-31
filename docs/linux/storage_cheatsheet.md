# Linux 存储命令

| 命令                                                      | 说明                                                                            |
| --------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **块设备**                                                |                                                                                 |
| `lsblk`                                                   | 列出可用块设备的信息                                                            |
| `blkid`                                                   | 显示可用块设备的信息                                                            |
| **分区**                                                  |                                                                                 |
| `parted -l`                                               | 查看块设备分区信息                                                              |
| `parted -s /dev/sdz mklabel gpt`                          | 设置 sdz 的分区表为 GPT                                                         |
| `parted -s /dev/sdz mklabel msdos`                        | 设置 sdz 的分区表为 MBR                                                         |
| `parted -s /dev/sdX mkpart PART-TYPE [FS-TYPE] START END` | 新建分区                                                                        |
|                                                           | `PART-TYPE` 是分区类型，可选：`primary` `extended` `logical`                    |
|                                                           | `FS-TYPE` 是文件系统类型。但不会实际创建文件系统。                              |
|                                                           | `START` 是分区的起始位置，可以带单位，例如 1M。一般写 1。                       |
|                                                           | `END` 是设备的结束位置。可以带单位，也可以用百分比。例如 100%表示到设备的末尾。 |
|                                                           | `parted -s /dev/sdz mkpart primary 1 100%`                                      |
| **文件系统**                                              |                                                                                 |
| `df -h`                                                   | 以可读结果显示文件系统空间使用情况                                              |
| `df -m`                                                   | 以 MB 为单位显示文件系统空间使用情况                                            |
| `df -k`                                                   | 以 KB 为单位显示文件系统空间使用情况                                            |
| `df -k`                                                   | 增加一列显示文件系统类型                                                        |
| `du -sh FILE`                                             | 计算文件或目录总容量                                                            |