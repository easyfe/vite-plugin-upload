import ObsClient from "esdk-obs-nodejs";
import { getViteBase, getUploadFiles } from "../utils";

export type HuaweiConfig = {
    //上传地址
    server: string;
    //密钥ID
    accessKey: string;
    //密钥Key
    secretKey: string;
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
export default function (config: HuaweiConfig) {
    const fn = async () => {
        //获取打包目录下所有文件
        const uploadfiles = getUploadFiles(config);
        //创建cos对象
        const obsClient = new ObsClient({
            access_key_id: config.accessKey,
            secret_access_key: config.secretKey,
            server: config.server
        });
        //拼接需要上传的文件数组对象
        const filePathList: any[] = uploadfiles.map((item) => {
            const arr = item.split(config.from);
            return {
                Bucket: config.bucket,
                Key: `${config.bucketName}/${config.remoteDir}${arr[arr.length - 1]}`,
                FilePath: item
            };
        });
        //打印配置文件
        const copyOption = {
            server: config.server,
            bucket: config.bucket,
            bucketName: config.bucketName,
            remoteDir: config.remoteDir,
            from: config.from,
            excludesExtra: config.excludesExtra
        };
        console.log("正在上传资源到oss,上传配置:\n", copyOption);
        //计算成功上传数量
        let successCount = 0;
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
                    obsClient.putObject(
                        {
                            Bucket: config.bucket,
                            Key: filePathList[i].Key,
                            SourceFile: filePathList[i].FilePath // localfile为待上传的本地文件路径，需要指定到具体的文件名
                        },
                        (err, result) => {
                            if (err) {
                                reject(err);
                            } else {
                                if (result.CommonMsg.Status < 300) {
                                    successCount++;
                                    uploadSingle();
                                } else {
                                    reject(JSON.stringify(result.CommonMsg));
                                }
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
