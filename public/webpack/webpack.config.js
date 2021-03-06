const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const multilpleConfig = require('./multilple-config.js');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = (env) => {
    const configPlugin = [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new ExtractTextPlugin({
            filename: '../css/[name].mix.css'
        }),
        new ImageminPlugin({
            disable: env.development,
            test: /\.(jpe?g|png|gif|svg)$/i,
            pngquant: {
                quality: '100',
            },
            jpegtran: {
                progressive: true
            }
        }),
        new CopyWebpackPlugin([
            { 
                from: path.resolve(__dirname, '../src/image'),
                to: path.resolve(__dirname, '../build/image')
            }
        ]),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'commons',
            filename: '[name].mix.js',
            minChunks: 4,
        }),
        new VueLoaderPlugin()
    ];

    if (env.development) {
        configPlugin.push(
            new BrowserSyncPlugin({
                host: 'localhost',
                port: 7777,
                proxy: 'localhost:8080'
            })
        )
    } else if (env.production) {
        configPlugin.push(
            new CleanWebpackPlugin(['build'],{
                root: path.resolve(__dirname, '../'),
                exclude: []
            }),
        )
    }
    return {
        entry: multilpleConfig.entries,
        output: {
            filename: '[name].mix.js',
            path: path.resolve(__dirname, '../build/js')
        },
        module: {
            rules: [
                { 
                    test: /\.(css|less)$/,
                    use: ExtractTextPlugin.extract({
                        fallback: "style-loader",
                        use: [
                            {
                                loader: 'css-loader',
                                options: { minimize: true }
                            },{
                                loader: 'less-loader',
                                options: { minimize: true }
                            }
                        ]
                    })
                },{
                    test: /\.vue$/,
                    use: ['vue-loader']
                },{
                    test: /\.js$/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: ['es2015']
                            }
                        }
                    ],
                },{
                    test: /\.(gif|jpg|png|woff|svg|eot|ttf)$/,
                    use: ['url-loader?limit=8192&name=../img/[name].[ext]']
                }
            ]
        },
        plugins: configPlugin,
        resolve: {
            alias: {
                'vue': 'vue/dist/vue.js'
            }
        }
    }
}