var webpack = require('webpack');

module.exports = {
    entry: {
        thirdparty: [
            'd3',
            'bulma',
            'knockout'
        ],
        app: './app/main.ts',
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
        require('webpack-fail-plugin'),
        // Remove 3rd patry from app and tests bundles
        new webpack.optimize.CommonsChunkPlugin({ name: 'thirdparty', chunks: ['app'] }),
        //new webpack.optimize.CommonsChunkPlugin({ name: 'thirdparty', chunks: ['tests'] }),

        // Add minification
        //new webpack.optimize.UglifyJsPlugin()
    ],
    module: {
        preLoaders: [
            { test: /\.tsx?$/, loader: "tslint-loader" }
        ],
        loaders: [
            { test: /\.tsx?$/, loader: "ts-loader", exclude: /node_modules/ },
            { test: /\.css$/, loader: "style-loader!css" },
            { test: /\.scss$/, loaders: ["style", "css", "sass"] },
            { test: /\.sass$/, loaders: ["style", "css", "sass"] },
            { test: /\.png$/, loader: "url-loader?limit=100000" },
            { test: /\.gif$/, loader: "url-loader?limit=100000" }
        ]
    }
}
