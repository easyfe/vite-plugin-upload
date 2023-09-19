# vite-plugin-upload 上传插件

基于 vite 的，上传打包资源到阿里云、腾讯云、minio 等存储服务。

## 安装

```typescript
npm install -D @easyfe/vite-plugin-upload 

pnpm add -D @easyfe/vite-plugin-upload 
```

## 使用

### 阿里云

#### 参数

| 参数            | 类型     | 介绍                   |
| --------------- | -------- | ---------------------- |
| accessKeyId     | string   | 密钥 id                |
| accessKeySecret | string   | 密钥                   |
| bucket          | string   | 桶名称                 |
| region          | string   | 存储桶所在地域         |
| bucketName      | string   | 桶下面的文件夹         |
| remoteDir       | string   | 远程文件夹地址         |
| from            | string   | 打包生成目录，dist     |
| excludesExtra   | string[] | 需要过滤的后缀 ["map"] |

#### 使用

```typescript
import { AliUploadPlugin, AliConfig } from "@easyfe/vite-plugin-upload";

AliUploadPlugin({
    accessKeyId: "",
    accessKeySecret: "",
    bucket: "",
    region: "",
    bucketName: "",
    remoteDir: "",
    from: "dist",
    excludesExtra: ["map"]
});
```

### 腾讯云

#### 参数

| 参数          | 类型     | 介绍                   |
| ------------- | -------- | ---------------------- |
| secretId      | string   | 密钥 id                |
| secretKey     | string   | 密钥                   |
| bucket        | string   | 桶名称                 |
| region        | string   | 存储桶所在地域         |
| bucketName    | string   | 桶下面的文件夹         |
| remoteDir     | string   | 远程文件夹地址         |
| from          | string   | 打包生成目录，dist     |
| excludesExtra | string[] | 需要过滤的后缀 ["map"] |

#### 使用

```typescript
import { TencentUploadPlugin, TencentConfig } from "@easyfe/vite-plugin-upload";

TencentUploadPlugin({
    secretId: "",
    secretKey: "",
    bucket: "",
    region: "",
    bucketName: "",
    remoteDir: "",
    from: "dist",
    excludesExtra: ["map"]
});
```

### Minio

#### 参数

| 参数          | 类型     | 介绍                   |
| ------------- | -------- | ---------------------- |
| endPoint      | string   | 对象存储服务的 URL     |
| port          | number   | TCP/IP 端口号          |
| useSSL        | boolean  | 是否使用 ssl           |
| accessKey     | string   | 密钥 id                |
| secretKey     | string   | 密钥                   |
| bucket        | string   | 桶名称                 |
| region        | string   | 存储桶所在地域         |
| bucketName    | string   | 桶下面的文件夹         |
| remoteDir     | string   | 远程文件夹地址         |
| from          | string   | 打包生成目录，dist     |
| excludesExtra | string[] | 需要过滤的后缀 ["map"] |

#### 使用

```typescript
import { MinioUploadPlugin, MinioConfig } from "@easyfe/vite-plugin-upload";

MinioUploadPlugin({
    endPoint: "",
    port: 9000,
    useSSL: false,
    accessKey: "",
    secretKey: "",
    bucket: "",
    region: "",
    bucketName: "",
    remoteDir: "",
    from: "dist",
    excludesExtra: ["map"]
});
```
