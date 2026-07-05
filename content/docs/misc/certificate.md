---
title: "证书"
weight: 1
---

# 证书

## 1. 证书文件的分类

### 1.1. 按编码方式分类

#### 1.1.1. PEM (Privacy Enhanced Mail)

文本格式。内容是 Base64 编码的 ASCII 码，文件里能看到以 `-----BEGIN CERTIFICATE-----` 和 `-----END CERTIFICATE-----` 之类的头尾标记。它最常见，也最通用，主要用在 Apache、Nginx 等服务器上。

常见扩展名有 `.pem`, `.crt`, `.cer`, `.key`。

#### 1.1.2. DER (Distinguished Encoding Rules)

二进制格式。内容是 0 和 1 的二进制数据，无法直接用文本编辑器阅读。文件体积更小，主要用于 Java 平台或某些 Windows 系统。

常见扩展名有 `.der`, `.crt`, `.cer`。

### 1.2. 按内容分类

#### 1.2.1. 纯证书 (X.509)

仅公钥 + 持有者信息 + 签名，不加密。

常见扩展名有 `.crt`, `.cer`, `.der`。

#### 1.2.2. 纯私钥

仅私钥（RSA/ECC），可选加密，可用密码保护。

常见扩展名有 `.key`, `.pem`。

#### 1.2.3. PKCS#8

私钥的标准化封装格式，支持多种算法。可选加密。

常见扩展名有 `.pem`（有特定头）。

#### 1.2.4. PKCS#12

证书 + 私钥 + 证书链（全部打包），需要密码强制加密。

常见扩展名有 `.pfx`, `.p12`。

#### 1.2.5. PKCS#7

证书链（不含私钥），可选加密。

常见扩展名有 `.p7b`, `.p7c`。

## 1.3. 按角色/用途分类

| 角色类型                                        | 说明                                             | 典型文件特征                                                        |
| :---------------------------------------------- | :----------------------------------------------- | :------------------------------------------------------------------ |
| **根证书 (Root CA)**                            | 自签名的顶级证书，是所有信任的起点。             | 通常是 `.crt` 或 `.pem`，有效期很长（10-20年）                      |
| **中间证书 (Intermediate CA)**                  | 由根CA签发，用于签发终端证书，起到安全隔离作用。 | 与终端证书格式相同，但 `Subject` 中通常带有 "Intermediate" 字样     |
| **终端证书 / 服务器证书 (End-entity / Server)** | 最终部署在服务器上的证书，由根或中间CA签发。     | 最常见的 `.crt` 或 `.pem`，有效期较短（1年左右）                    |
| **客户端证书 (Client)**                         | 用于身份认证（如双向HTTPS、VPN）。               | 格式与服务器证书相同，但 `Key Usage` 扩展中带有 "Digital Signature" |
| **密钥库 (Keystore)**                           | Java世界中的容器，用于存储私钥和证书。           | `.jks`, `.p12` (PKCS#12)                                            |
| **信任库 (Truststore)**                         | 存储受信任的根证书列表。                         | `.jks` 或 `.p12`，通常只含公钥证书                                  |

## 2. 生成证书

### 2.1. 生成私钥

```bash
# 生成一个2048位的RSA私钥，保存为 server.key
openssl genrsa -out server.key 2048
```

### 2.2. 生成证书签名请求 (CSR)

使用刚刚生成的私钥，创建一个证书签名请求（CSR）文件。这个文件包含了公钥和身份信息。

```bash
# 交互式填写信息
openssl req -new -key server.key -out server.csr

# 或通过 -subj 参数一次性填写（非交互方式）
openssl req -new -key server.key -out server.csr -subj "/C=CN/ST=Shanghai/L=Shanghai/O=MyOrg/OU=IT/CN=www.example.com"
```

- Country Name (2 letter code)
- State or Province Name (full name)
- Locality Name (eg, city)
- Organization Name (eg, company)
- Organizational Unit Name

### 2.3. 生成自签名证书

用你自己的私钥来签署你自己的CSR，生成一个自签名证书。这种证书仅适用于开发或测试环境，不会被浏览器信任。

```bash
openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
```

这个命令会生成一个有效期为365天的自签名证书 `server.crt`。

### 2.4. 用自定义CA签发证书

#### 2.4.1. 创建根CA（Root CA）

```bash
# 1. 生成根CA的私钥
openssl genrsa -out ca.key 2048

# 2. 生成根CA的自签名证书（有效期10年）
openssl req -x509 -new -nodes -key ca.key -sha256 -days 3650 -out ca.crt -subj "/CN=My Root CA"
```

这里生成的 `ca.crt` 就是你的根证书，需要被客户端信任。

#### 2.4.2. 用根CA签发证书

现在，你可以用这个根CA来签署之前生成的 `server.csr` 了。

```bash
openssl x509 -req -days 365 -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt
```

- `-CA ca.crt`：指定用于签名的CA证书。
- `-CAkey ca.key`：指定CA的私钥。
- `-CAcreateserial`：自动创建序列号文件，避免序列号重复。

生成的 `server.crt` 就是由你的根CA签发的证书了。

#### 2.4.3. 验证证书

签发完成后，可以用以下命令验证证书是否有效：

```bash
# 验证证书（如果是CA签发的，需要指定CA文件）
openssl verify -CAfile ca.crt server.crt
```

如果一切正常，你会看到 `server.crt: OK` 的输出。

## 3. 查看证书基本信息

```bash
openssl x509 -in server.crt -text -noout
```

- `-text`：以人类可读的文本格式打印所有字段。
- `-noout`：不输出证书本身的（Base64）内容，只看解析后的信息。

输出中：

- `Issuer`：签发者（CA）的DN（区分名）。即谁签发了这份证书。如果是自签名，Issuer = Subject。
- `Validity`：有效期。证书从哪天开始生效（Not Before），到哪天过期（Not After）。浏览器会严格检查当前时间是否在此区间内。
- `Subject`：证书持有者的DN（区分名）。即这份证书为谁颁发。其中最重要的字段是 CN (Common Name)，在旧标准中代表域名；现在更关键的是下面的SAN扩展。
