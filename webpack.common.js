const path = require("path");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const SRC_DIR = path.resolve(__dirname, "src");
const BUILD_DIR = path.resolve(__dirname, "dist");

module.exports = ({
    entry: SRC_DIR + "/index.ts",
    output: {
        path: BUILD_DIR,
        filename: "framework.js",
        library: "glfw",
        libraryTarget: "umd"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [SRC_DIR],
                loader: "babel-loader"
            },
            {
                test: /\.ts$/,
                include: [SRC_DIR],
                loader: "babel-loader",
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin()
    ],
    resolve: {
        extensions: [".js", ".ts"],
        modules: ["node_modules"],
        alias: {
            "~": SRC_DIR
        }
    }
});
