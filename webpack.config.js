var path = require("path");

var BUILD_DIR = path.resolve(__dirname, "dist");
var SRC_DIR = path.resolve(__dirname, "src");

var config = {
  entry: {
    app: SRC_DIR + "/index.js"
  },

  output: {
    path: BUILD_DIR,
    filename: "[name].js"
  },

  module : {
    rules : [
      {
        test : /\.js$/,
        include : SRC_DIR,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  }
};

module.exports = config;