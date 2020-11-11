var HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    mode: "development",        //development, production
    devtool: "source-map",

    entry: "./src/main.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js"
    },
    devServer: {
        historyApiFallback: true,
        contentBase: path.join(__dirname, "dist"),
        // compress: true,
        // port: 7000
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    }
                ]
            },
            {
                test: /\.(png|svg|jpe?g)$/i,
                loader: 'url-loader',
                options: {
                    esModule: false
                }
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            filename: "index.html"
        })
    ],
    resolve: {
        alias: {
            // 'vue$': 'vue/dist/vue.js' 
            'fly-core': path.resolve(__dirname, 'packages/fly-core/'),
            'fly-dom': path.resolve(__dirname, 'packages/fly-dom/'),
            'fly-store': path.resolve(__dirname, 'packages/fly-store/'),
            'fly-router': path.resolve(__dirname, 'packages/fly-router/'),
            'fly-transition': path.resolve(__dirname, 'packages/fly-transition/'),
        }
    }
    // resolveLoader: {
    //     modules: [
    //         './src/fly/loader',
    //         './node_modules',             
    //     ]
    // }
}