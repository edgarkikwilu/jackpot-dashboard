const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: 'http://localhost:3000/',
    // proxy:'http://102.217.211.24:8085/'
  },
  publicPath:'/'
})
