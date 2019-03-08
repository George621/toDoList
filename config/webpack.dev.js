const path = require('path')
const uglify = require('uglifyjs-webpack-plugin')
const htmlPlugin = require('html-webpack-plugin')
const extractTextPlugin = require('extract-text-webpack-plugin') //CSS 分离
const website = {
    publicPath:"http://localhost:8888/"
}
const glob = require('glob')
const PurifyCSSPlugin = require("purifycss-webpack");



module.exports={
    mode:'development',
    //入口文件
    entry:{
        index:'./src/index.js',
    },
    //出口文件配置项
    output:{
        //打包的路径
        path:path.resolve(__dirname,'../dist'),
        //打包的文件名称
        filename:'[name].js',
        publicPath:website.publicPath
    },
    // 模块 解读css，图转换压缩等
    module:{
        rules:[
            {
                test:/\.css$/,
                use: extractTextPlugin.extract({
                    fallback:"style-loader",
                    use: "css-loader"
                })
                // use:[
                //     {loader: "style-loader"},
                //     {loader: "css-loader" }
                // ]
            },
            {
              test: /\.scss$/,
              use: extractTextPlugin.extract({
                  use: [{
                      loader: "css-loader"
                  }, {
                      loader: "sass-loader"
                  }],
                  // 在开发环境使用 style-loader
                  fallback: "style-loader"
              })
            },
            {
                test:/\.(png|jpg|gif|jpeg)/,  // 匹配文件后缀名
                use:[{
                    loader:"url-loader",
                    options:{
                        limit:500  // 小于500b文件 base64 写入js
                    }
                }]
            },
            {  //html 中 img 引入图解决
                test: /\.(htm|html)$/i,
                 use:[ 'html-withimg-loader'] 
            },
            //babel 配置
           {
            test:/\.(jsx|js)$/,
            use:{
                loader:'babel-loader',
                // options:{   // 此处 配置在了 babelrc
                //     presets:[
                //         "es2015","react"
                //     ]
                // }
            },
            exclude:/node_modules/
        }
        ]
    },
    //插件，用于生产模板和功能
    plugins:[
        new uglify(), //js 压缩 插件
        new htmlPlugin({
            minify:{
                removeAttributeQuotes:true  //removeAttrubuteQuotes是却掉属性的双引号。
            },
            hash:true,
            template:'./src/template.html' //模板文件
        }),
        new PurifyCSSPlugin({
            //这里配置了一个paths，主要是需找html模板，purifycss根据这个配置会遍历你的文件，查找哪些css被使用了。
          paths: glob.sync(path.join(__dirname, 'src/*.html')),
        }),
        new extractTextPlugin('css/index.css'),  
    ],
    // 配置webpack开发服务
    devServer:{
        //设置基本目录结构
        contentBase:path.join(__dirname,'../dist'),
        // 服务器ip地址
        host:'localhost',
        // 服务端压缩是否开启
        compress:true,
        //端口号
        port:8888
    }
}