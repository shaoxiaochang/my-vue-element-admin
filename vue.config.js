'use strict'
const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    publicPath: '/',
    devServer: {
        port: 9527,
        open: true,
        overlay: {
            warnings: false,
            errors: true
        },
        before: require('./mock/mock-server.js')
    },
    configureWebpack: {
        resolve: {
            alias: {
                '@': resolve('src')
            }
        }
    },
    chainWebpack(config) {
        // set svg-sprite-loader
        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end()
    }
}