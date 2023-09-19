import type { Plugin } from "vite";
import path from "path";
import fs from "fs";
import glob from "glob";

/**
 * 设置vite基础配置
 * @param fn 传入打包完成后需要执行的方法
 * @returns
 */
export function getViteBase(fn: () => void | Promise<void>): Plugin {
    return {
        name: "vite-plugin-upload",
        buildEnd(error): void {
            if (error) {
                throw error;
            }
        },
        closeBundle() {
            fn();
        }
    };
}

/**
 * 设置资源版本路径
 * @returns
 */
export function generateVersion(): number | string {
    function addZero(str: number): number | string {
        return str < 10 ? `0${str}` : str;
    }
    const _date = new Date();
    // 格式 '2020Y11M02D11H21M16S'
    return [
        _date.getFullYear() + "Y",
        addZero(_date.getMonth() + 1) + "M",
        addZero(_date.getDate()) + "D",
        addZero(_date.getHours()) + "H",
        addZero(_date.getMinutes()) + "M",
        addZero(_date.getSeconds()) + "S"
    ].join("");
}

/**
 * 获取上传文件
 * @param config
 * @returns
 */
export function getUploadFiles(config: { from: string; excludesExtra?: string[] }) {
    //获取打包目录下所有文件
    const dir = path.resolve(process.cwd(), config.from);
    if (!fs.existsSync(dir)) {
        throw new Error(`编译文件夹不存在：${dir}`);
    }
    const filePaths = glob.sync(dir + "/**/*");
    //删除需要过滤后缀的文件
    const uploadfiles = filePaths.filter(
        (item) =>
            !(config.excludesExtra ?? []).includes(String(item.split(".").pop())) && !fs.lstatSync(item).isDirectory()
    );
    return uploadfiles;
}
