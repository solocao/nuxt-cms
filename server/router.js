import Router from 'koa-router'
import koaBody from 'koa-body'
import checkToken from './middleware/check-token'
import checkAdmin from './middleware/check-admin'
import {uploadConfig} from './extend/index'

const router = new Router()

//链接数据库
require('./model/index')

//controller
import * as common from './controller/common'
import user from './controller/user'
import comment from './controller/comment'
import article from './controller/article'
import tag from './controller/tag'
import logo from './controller/logo'
import contact from './controller/contact'
import like from './controller/like'

router
  //tool
  .get('/gt/register-slide', common.gtRegister)
  .post('/get-code', common.getCode)
  .post('/send-email', common.sendEmail)
  .post('/upload', koaBody(uploadConfig('/thumb')), common.uploadThumb)
  //user
  .post('/user', user.register)
  .get('/user/:token', checkToken, user.getUserInfo)
  .get('/user', checkToken, user.getUserInfoById)
  .patch('/user/:id', checkToken, user.patchUserInfo)
  // .delete('/user/:username', checkToken, user.deleteUser)
  .post('/user/login', user.login)
  .post('/user/logout', checkToken, user.logout)
  .post('/user/reset-password', checkToken, user.resetPassword)
  .get('/users', checkToken, user.list)
  //article
  .post('/article', article.post)
  .get('/article/:id', article.get)
  .patch('/article/:id', article.patch)
  .delete('/article/:id',checkAdmin, article.del)
  .get('/articles', article.list)
  .get('/articles/search/:keyword', article.listBySearch)
  .get('/articles/tag/:tag', article.listByTag)
  //comment
  .post('/comment', comment.post)
  .get('/comments', comment.list)
  .delete('/comment/:id',checkAdmin, comment.del)
  //like
  .post('/like', like.post)
  .get('/likes', like.list)
  .delete('/like/:id', like.del)
  //tag
  .get('/tags', tag.list)
  //contact
  .post('/contact',contact.post)
  .get('/contact/:id', contact.get)
  .get('/contacts', contact.list)
  //logo
  .post('/logo', logo.post)
  .get('/logo/:id', logo.get)
  .patch('/logo/:id', logo.patch)
  .delete('/logo/:id',checkAdmin, logo.del)
  .get('/logos', logo.list)

export default router
