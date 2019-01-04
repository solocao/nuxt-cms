export function sleep(time) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve()
    }, time)
  })
}
export function getPathName(path) {
  switch (path) {
    case '':
      return '首页'
      break
    case 'admin':
      return '仪表盘'
      break
    case 'articles':
      return '文章管理'
      break
    case 'editor':
      return '文章编辑'
      break
    default:
      return ''
  }
}
