module.exports = {
    presets: ["@babel/preset-env"],
    plugins: [
      [
        "babel-plugin-root-import",
        {
            rootPathPrefix: "~",
            rootPathSuffix: "src",
        },
      ],
    ],
};