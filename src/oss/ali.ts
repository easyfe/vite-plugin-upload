import { getUploadFiles, getViteBase } from "../utils";
import OSS from "ali-oss";

export type AliConfig = {
    //密钥ID
    accessKeyId: string;
    //密钥Key
    accessKeySecret: string;
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

export default function (config: AliConfig) {
    const fn = async () => {
        //获取打包目录下所有文件
        const uploadfiles = getUploadFiles(config);
        //创建cos对象
        const ossClient = new OSS({
            bucket: config.bucket,
            region: config.region,
            accessKeyId: config.accessKeyId,
            accessKeySecret: config.accessKeySecret
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
        //打印配置文件
        const copyOption = {
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
                    ossClient
                        .put(filePathList[i].Key, filePathList[i].FilePath)
                        .then(() => {
                            successCount++;
                            uploadSingle();
                        })
                        .catch((err) => {
                            reject(err);
                        });
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
