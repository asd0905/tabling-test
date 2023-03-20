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
    devtool: 'inline-source-map',
    mode: "development",
    optimization: { minimizer: [] },
    target: 'web',
    devServer: {
        // dist 디렉토리를 웹 서버의 기본 호스트 위치로 설정
        // contentBase: path.resolve(__dirname, './dist'),
        // 인덱스 파일 설정
        // index: 'index.html',
        // 포트 번호 설정
        port: 9000,
        // 핫 모듈 교체(HMR) 활성화 설정
        hot: true,
        // gzip 압축 활성화
        compress: true,
        // dist 디렉토리에 실제 파일 생성
        // writeToDisk: true,
        static: {
            directory: path.join(__dirname, 'dist'),
        },
    },
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
    },
    performance: {
        hints: process.env.NODE_ENV === 'production' ? "warning" : false
    },

}