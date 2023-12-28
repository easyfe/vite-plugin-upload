import MinioUploadPlugin, { MinioConfig } from "./oss/minio";
import TencentUploadPlugin, { TencentConfig } from "./oss/tencent";
import AliUploadPlugin, { AliConfig } from "./oss/ali";
import HuaweiUploadPlugin, { HuaweiConfig } from "./oss/huawei";
import { generateVersion } from "./utils/index";

export {
    AliUploadPlugin,
    TencentUploadPlugin,
    MinioUploadPlugin,
    generateVersion,
    HuaweiUploadPlugin,
    MinioConfig,
    TencentConfig,
    AliConfig,
    HuaweiConfig
};
