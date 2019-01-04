//后端使用ES语法
require('babel-core/register')({
  'presets': [
    'stage-3',
    ['latest-node', { 'target': 'current' }]
  ]
})
//启动服务
require('./server')

