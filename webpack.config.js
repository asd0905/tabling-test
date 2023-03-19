const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: {
        index: './src/js/index.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            tempalte: './public/index.html',
        }),
    ],
    mode: "development",
    optimization: { minimizer: [] },
    module: {
        rules: [
            {
                test: /\.s[ac]ss/i,
                use: [
                    'style-loader',
                    // css-loader 소스맵 옵션 활성화
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    // sass-loader 소스맵 옵션 활성화
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            }
        ]
    }
}