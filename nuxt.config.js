const webpack = require('webpack')
const config = require('./config')
const path = require('path')
module.exports = {
  head: {
    title: 'NUXT-CMS',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      { name: 'renderer', content: 'webkit' },
      { name: 'author', content: 'paddy' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
      { hid: 'description', name: 'description', content: '' },
      { hid: 'keywords', name: 'keywords', content: '' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', href: '/icon.png' },
    ],
    script: [
      { src: '/cnzz.js'},
      { src: '//cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js'},
      { src: '/gt.js'}
    ]
  },
  css: [
    '~/scss/main.scss'
  ],
  loading: false,
  modules: ['@nuxtjs/pwa', '@nuxtjs/axios', '@nuxtjs/proxy'],
  plugins: [
    '~/plugins/components',
    '~/plugins/filters',
    '~/plugins/directives',
    '~/plugins/i18n',
    '~/plugins/axios',
    '~/plugins/element-ui',
    '~/plugins/mint-ui',
    '~/plugins/vue-awesome-swiper',
    '~/plugins/vue-quill-editor'
  ],
  router: {
    middleware: ['route']
  },
  build: {
    analyze: process.env.__ENV === 'development' ? true : false,
    extractCSS: true,
    cssSourceMap: false,
    maxChunkSize: 100000,
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 30000,
        maxSize: 0,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        automaticNameDelimiter: '~',
        name: true,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      }
    },
    postcss: [
      require('postcss-px2rem')({
        remUnit: 15 // 转换基本单位
      })
    ],
    plugins: [
      new webpack.ProvidePlugin({
        // '_': 'lodash'
      })
    ],
    extend (config, ctx) {
      if (ctx.isClient) {
        config.entry['polyfill'] = ['babel-polyfill']
        // 添加 alias 配置
        Object.assign(config.resolve.alias, {
          'utils': path.resolve(__dirname, 'utils')
        })
      }
      // console.log('webpack config:', config)
    }
  },
  env: {
    __ENV: process.env.__ENV
  },
  axios: {
    baseURL: `${config.app.domain}/api`,
    // credentials: true,
    // proxy:true
  },
  proxy:{
    // '/api2': 'http://example.com'
  },
  manifest: {
    name: 'nuxt-cms',
    description: 'A pwa program',
    theme_color: '#618cb9'
  }
}
