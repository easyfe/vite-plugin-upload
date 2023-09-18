import MinioUploadPlugin, { MinioConfig } from "./oss/minio";
import TencentUploadPlugin, { TencentConfig } from "./oss/tencent";
import AliUploadPlugin from "./oss/ali";
import { generateVersion } from "@/util/index";

export { AliUploadPlugin, TencentUploadPlugin, MinioUploadPlugin, MinioConfig, TencentConfig, generateVersion };
