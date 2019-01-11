const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = function(env) {
  env = env || "dev";
  const isProduction = env == "prod";
  console.log("Building app bundle with webpack");
  console.log("  production: " + isProduction, env);

  const webpackConfig = {
    mode: isProduction ? "production" : "development",
    entry: {
      app: "./src/app.tsx"
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
      modules: [__dirname, "node_modules"]
    },
    output: {
      path: __dirname + "/dist",
      filename: "[name].js",
      pathinfo: false
    },
    // Turn on sourcemaps
    devtool: "source-map",

    plugins: [
      new HtmlWebpackPlugin({
        template: "src/index.html",
        filename: "index.html"
      }),
      new ForkTsCheckerWebpackPlugin(),
      new CopyWebpackPlugin([{ from: "src/static", to: "static" }]),
      isProduction &&
        new BundleAnalyzerPlugin({
          // Can be `server`, `static` or `disabled`.
          // In `server` mode analyzer will start HTTP server to show bundle report.
          // In `static` mode single HTML file with bundle report will be generated.
          // In `disabled` mode you can use this plugin to just generate Webpack Stats JSON file by setting `generateStatsFile` to `true`.
          analyzerMode: "static",
          // Path to bundle report file that will be generated in `static` mode.
          // Relative to bundles output directory.
          reportFilename: "../reports/bundle-analyzer-app-report.html",
          // Automatically open report in default browser
          openAnalyzer: false,
          // If `true`, Webpack Stats JSON file will be generated in bundles output directory
          generateStatsFile: false,
          // Log level. Can be 'info', 'warn', 'error' or 'silent'.
          logLevel: "info"
        })
    ].filter(x => !!x),
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
          options: {
            transpileOnly: true,
            compilerOptions: { target: "ES2017" }
          }
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg|woff)$/,
          loader: "url-loader",
          options: { limit: 200000 }
        },
        { test: /\.(html|txt)$/, loader: "raw-loader" },
        { test: /\.css$/, use: ["style-loader", "css-loader"] },
        {
          test: /\.(less)$/,
          use: ["style-loader", "css-loader", "less-loader"]
        },
        {
          test: /\.(scss)$/,
          use: ["style-loader", "css-loader", "sass-loader"]
        }
      ]
    },
    devServer: {
      contentBase: "dist/",
      host: "0.0.0.0",
      port: 8091
    }
  };

  return webpackConfig;
};
