var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        thirdparty: [
            'react',
            'react-dom',
            'react-router',
        ],
        app: './app/main.tsx',
        //tests: './app/tests.js'
    },
    output: {
        filename: '../public/js/[name].js'
    },
    // Turn on sourcemaps
    devtool: 'source-map',
    resolve: {
        extensions: ['', '.ts', '.tsx', '.js']
    },

    plugins: [
        // Remove 3rd patry from app and tests bundles
        new webpack.optimize.CommonsChunkPlugin({ name: 'thirdparty', chunks: ['app'] }),
        //new webpack.optimize.CommonsChunkPlugin({ name: 'thirdparty', chunks: ['tests'] }),

        // Separate CSS to another bundle
        //new ExtractTextPlugin('../Scripts/app/[name].css'),

        // Add minification
        //new webpack.optimize.UglifyJsPlugin()
    ],
    module: {
        preLoaders: [
            { test: /\.tsx?$/, loader: "tslint-loader" }
        ],
        loaders: [
            { test: /\.tsx?$/, loader: "ts-loader", exclude: /node_modules/ },
            { test: /\.css$/, loader: ExtractTextPlugin.extract("style", "css") },
            { test: /\.scss$/, loader: ExtractTextPlugin.extract("style", "css!sass") },
            { test: /\.png$/, loader: "url-loader?limit=100000" },
            { test: /\.gif$/, loader: "url-loader?limit=100000" }
        ]
    }
}