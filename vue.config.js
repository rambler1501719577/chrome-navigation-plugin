const { WEB_SERVER } = require("./src/settings.js");
const path = require("path");
const port = process.env.port || 3000;
const CompressionPlugin = require("compression-webpack-plugin");
// const CopyWebpackPlugin = require("copy-webpack-plugin");
const proxyWebAddress = "http://82.156.8.154:8888";

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    publicPath: "./", //打包后静态资源的相对路径,build的时候改成./
    outputDir: "chrome-new-tab-extension", // 打包输出文件名
    // 在开发环境下eslint-loader 会将 lint 错误输出为编译警告
    lintOnSave: process.env.NODE_ENV === "development",
    // 关闭生产环境的 sourceMap
    productionSourceMap: false,
    // 将webpack部分配置提取出来,如entry和template等
    pages: {
        navigation: {
            entry: "src/entries/navigation/main.js",
            template: "public/navigation.html",
            filename: "navigation.html",
            title: "New Tab"
        },
        popup: {
            entry: "src/entries/popup/main.js",
            template: "public/popup.html",
            filename: "popup.html",
            title: "Popup"
        }
    },
    devServer: {
        port: port,
        open: false,
        overlay: {
            warnings: false,
            errors: true
        },
        proxy: {
            [WEB_SERVER]: {
                target: proxyWebAddress,
                changeOrigin: true,
                headers: {
                    host: proxyWebAddress,
                    origin: proxyWebAddress
                }
            }
        }
    },
    css: {
        loaderOptions: {
            // 全局引入stylus变量, 通过main.js引入不生效
            stylus: {
                import: "~styl/variable.styl"
            }
        },
        sourceMap: true
    },
    // webpack相关配置
    chainWebpack: config => {
        config.module
            .rule("image")
            .test(/\.cur$/)
            .use("url-loader")
            .loader("url-loader")
            .end();

        config.module.rule("svg").uses.clear();

        config.module
            .rule("svg")
            .include.add(resolve("src/icon/svg"))
            .end()
            .use("svg-sprite-loader")
            .loader("svg-sprite-loader")
            .options({
                symbolId: "icon-[name]"
            })
            .end();

        config.resolve.alias
            .set("styl", resolve("src/styles"))
            .set("assets", resolve("src/assets"))
            .set("components", resolve("src/components"));
        if (process.env.NODE_ENV === "development") {
            config.devtool("source-map");
        }
    },
    configureWebpack: config => {
        let plugins = [];
        if (process.env.NODE_ENV === "production") {
            plugins.push(
                new CompressionPlugin({
                    test: /\.js$|\.html$|\.css/,
                    threshold: 10240,
                    deleteOriginalAssets: false
                })
            );
            // plugins.push(
            //     new CopyWebpackPlugin([
            //         {
            //             from: resolve(__dirname, "./public/js/*"),
            //             to: resolve(__dirname, "./dist/js")
            //         }
            //     ])
            // );
        }
        config.plugins = [...config.plugins, ...plugins];
    }
};
