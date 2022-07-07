const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const WebpackObfuscator = require("webpack-obfuscator");

const config = {
  entry: {
    // popup: path.join(__dirname, "src/app/popup.tsx"),
    content: path.join(__dirname, "src/content-scripts/content.ts"),
    background: path.join(__dirname, "src/background-scripts/background.ts"),
    // autosnipe: path.join(
    //   __dirname,
    //   "src/app/pages/external-pages/autosnipe.tsx"
    // ),
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "./js/[name].js",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
        exclude: /\.module\.css$/,
      },
      {
        test: /\.ts(x)?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: true,
            },
          },
        ],
        include: /\.module\.css$/,
      },
      {
        test: /\.(svg|mp3)$/,
        use: "file-loader",
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: "url-loader",
            options: {
              mimetype: "image/png",
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".tsx", ".ts"],
    alias: {
      "react-dom": "@hot-loader/react-dom",
    },
    fallback: {
      http: require.resolve("stream-http"),
    },
  },
  devServer: {
    contentBase: "./dist",
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "public", to: "." }],
    }),
    new NodePolyfillPlugin(),
    new WebpackObfuscator(
      {
        rotateStringArray: true,
      },
      ["/node_modules/"]
    ),
  ],
};

module.exports = config;
