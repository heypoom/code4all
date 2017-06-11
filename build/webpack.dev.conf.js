var fs = require("fs")
var path = require("path")
var utils = require("./utils")
var webpack = require("webpack")
var config = require("../config")
var merge = require("webpack-merge")
var baseWebpackConfig = require("./webpack.base.conf")
var HtmlWebpackPlugin = require("html-webpack-plugin")
var FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin")

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(name => {
  baseWebpackConfig.entry[name] = ["./build/dev-client"].concat(baseWebpackConfig.entry[name])
})

const phaserModule = path.join(__dirname, "../node_modules/phaser/")
const phaser = path.join(phaserModule, "build/custom/phaser-split.js")
const pixi = path.join(phaserModule, "build/custom/pixi.js")
const p2 = path.join(phaserModule, "build/custom/p2.js")

const rules = [
  ...utils.styleLoaders({sourceMap: config.dev.cssSourceMap}),
  {test: /pixi.js/, use: ["script-loader"]},
  {test: /p2.js/, use: ["script-loader"]}
]

console.log(rules)

module.exports = merge(baseWebpackConfig, {
  module: {
    rules
  },
  resolve: {
    alias: {
      phaser,
      pixi,
      "pixi.js": pixi,
      p2
    }
  },
  // cheap-module-eval-source-map is faster for development
  devtool: "#cheap-module-eval-source-map",
  plugins: [
    new webpack.DefinePlugin({
      "process.env": config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "index.html",
      inject: true,
      serviceWorkerLoader: `<script>${fs.readFileSync(path.join(__dirname,
        "./service-worker-dev.js"), "utf-8")}</script>`
    }),
    new FriendlyErrorsPlugin()
  ]
})
