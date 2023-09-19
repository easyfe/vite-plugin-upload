import Minio from "minio";
import { getViteBase, getUploadFiles } from "../utils";

export type MinioConfig = {
    //对象存储服务的URL
    endPoint: string;
    //TCP/IP端口号。可选值，如果是使用HTTP的话，默认值是80；如果使用HTTPS的话，默认值是443。
    port?: number;
    //是否使用ssl
    useSSL?: boolean;
    //密钥ID
    accessKey: string;
    //密钥Key
    secretKey: string;
    //存储通Region
    region: string;
    //存储桶名称
    bucket: string;
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
export default function (config: MinioConfig) {
    const fn = async () => {
        //获取打包目录下所有文件
        const uploadfiles = getUploadFiles(config);
        //创建cos对象
        const minioClient = new Minio.Client({
            endPoint: config.endPoint,
            port: config.port,
            useSSL: config.useSSL,
            accessKey: config.accessKey,
            secretKey: config.secretKey
        });
        //拼接需要上传的文件数组对象
        const filePathList: any[] = uploadfiles.map((item) => {
            const arr = item.split(config.from);
            return {
                Bucket: config.bucket,
                Region: config.region,
                Key: `${config.bucketName}/${config.remoteDir}${arr[arr.length - 1]}`,
                FilePath: item
            };
        });
        //检查桶是否存在
        try {
            const v = await minioClient.bucketExists(config.bucket);
            if (!v) {
                await minioClient.makeBucket(config.bucket, config.region);
            }
        } catch (err) {
            console.log(err);
        }
        //打印配置文件
        const copyOption = {
            endPoint: config.endPoint,
            port: config.port,
            useSSL: config.useSSL,
            region: config.region,
            bucket: config.bucket,
            bucketName: config.bucketName,
            remoteDir: config.remoteDir,
            from: config.from,
            excludesExtra: config.excludesExtra
        };
        console.log("正在上传资源到oss,上传配置:\n", copyOption);
        //计算成功上传数量
        let successCount = 0;
        const metaData = {
            "Content-Type": "application/octet-stream"
        };
        const uploadAll = (): Promise<void> => {
            return new Promise((resolve, reject) => {
                const MAX = 10;
                let nextIndex = 0;
                const uploadSingle = (): void => {
                    const i = nextIndex;
                    if (successCount === filePathList.length) {
                        resolve();
                        return;
                    }
                    if (!filePathList[i]?.Key) {
                        return;
                    }
                    nextIndex++;
                    minioClient.fPutObject(
                        config.bucket,
                        filePathList[i].Key,
                        filePathList[i].FilePath,
                        metaData,
                        (err) => {
                            if (err) {
                                reject(err);
                            } else {
                                successCount++;
                                uploadSingle();
                            }
                        }
                    );
                };
                for (let index = 0; index < MAX; index++) {
                    uploadSingle();
                }
            });
        };
        await uploadAll();
        console.log(`\n上传结束，总共${filePathList.length}个文件,上传成功${successCount}个文件`);
    };
    return getViteBase(fn);
}
