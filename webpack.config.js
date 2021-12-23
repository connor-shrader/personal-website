// Setup came from watching:
// https://www.youtube.com/watch?v=WDpxqopXd9U

const path = require("path");

const globalDevServer = {
  port: 3010,
  watchContentBase: true,
};

const globalModule = {
  rules: [
    {
      test: /\.(js|jsx)$/,
      exclude: [/node_modules/],
      use: {
        loader: "babel-loader",
      },
    }
  ],
};

module.exports = {
  entry: {
    functionapproximations: "./blog/functionapproximations/index.js",
  },
  output: {
    filename: "[name]/index.build.js",
    path: __dirname + "/blog/",
  },
  devServer: globalDevServer,
  module: globalModule,
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
    d3: "d3",
  },
};
