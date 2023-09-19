import path from "path";
import pkg from "./package.json";
import rollupTypescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import { babel } from "@rollup/plugin-babel";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";

const paths = {
    input: path.join(__dirname, "/src/index.ts"),
    output: path.join(__dirname, "/lib")
};

export default {
    input: "src/index.ts",
    output: [
        // 输出 commonjs 规范的代码
        {
            file: path.join(paths.output, "index.js"),
            format: "cjs",
            name: pkg.name,
            exports: "named"
        },
        // 输出 es 规范的代码
        {
            file: path.join(paths.output, "index.esm.js"),
            format: "es",
            name: pkg.name,
            exports: "named"
        }
    ],
    plugins: [
        json(),
        // 使得 rollup 支持 commonjs 规范，识别 commonjs 规范的依赖
        commonjs(),
        // 配合 commnjs 解析第三方模块
        nodeResolve(),
        // 生成声明文件
        rollupTypescript({
            tsconfig: path.resolve(__dirname, "tsconfig.json"),
            sourceMap: false
        }),
        babel({
            // 防止打包node_modules下的文件
            exclude: "node_modules/**",
            // 使plugin-transform-runtime生效
            babelHelpers: "runtime",
            // babel 默认不支持 ts 需要手动添加
            extensions: [".js", ".jsx", ".es6", ".es", ".mjs", ".ts", ".tsx"]
        }),
        // 压缩文件
        terser()
    ],
    external: [...Object.keys(require("./package.json").dependencies)]
};
