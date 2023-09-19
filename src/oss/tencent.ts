import COS from "cos-nodejs-sdk-v5";
import { getViteBase, getUploadFiles } from "../utils";
import path from "path";

export type TencentConfig = {
    //密钥ID
    secretId: string;
    //密钥Key
    secretKey: string;
    //存储桶名称
    bucket: string;
    //所属地域
    region: string;
    //一级目录
    bucketName: string;
    //二级目录
    remoteDir: string;
    //需要上传的源目录
    from: string;
    //屏蔽的后缀，
    excludesExtra?: string[];
};

/**
 * 腾讯云cos插件
 * @param config cos配置
 * @returns
 */
export default function (config: TencentConfig) {
    const fn = async () => {
        //获取打包目录下所有文件
        const dir = path.resolve(process.cwd(), config.from);
        //获取打包目录下所有文件
        const uploadfiles = getUploadFiles(config);
        //创建cos对象
        const cos = new COS({
            SecretId: config.secretId,
            SecretKey: config.secretKey
        });
        //拼接需要上传的文件数组对象
        const filePathList = uploadfiles.map((item) => {
            const newDir = dir.replace(/\\/g, "/");
            return {
                Bucket: config.bucket,
                Region: config.region,
                Key: `${config.bucketName}/${config.remoteDir}/${item.replace(newDir, "")}`,
                FilePath: item
            };
        });
        //打印配置文件
        const copyOption = {
            bucket: config.bucket,
            region: config.region,
            bucketName: config.bucketName,
            remoteDir: config.remoteDir,
            from: config.from,
            excludesExtra: config.excludesExtra
        };
        console.log("正在上传资源到oss,上传配置:\n", copyOption);
        //执行上传操作
        const data = await cos.uploadFiles({
            files: filePathList,
            SliceSize: 1024 * 1024 * 10 /* 设置大于10MB采用分块上传 */
        });
        const errorFile = data.files.filter((item) => item.error);
        if (errorFile.length) {
            throw new Error(`存在上传错误，上传失败：\n${JSON.stringify(errorFile)}`);
        }
        console.log(`总共${filePathList.length}个文件,上传成功${data.files.length}个文件`);
    };
    return getViteBase(fn);
}
