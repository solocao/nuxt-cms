import jwt from 'jsonwebtoken'
import * as handle from '../extend/handler'
import Net from '../../utils/tools/net'

import User from '../model/user'

const config = require('../../config')
const checkToken = async(ctx, next) => {
  // 可以从cookie里面获得token，也可以从request header里获取token
  let token = ctx.header.cookie ? Net.getCookieFrom(ctx.header.cookie, 'token') : ctx.cookies.get('token')

  try {
    if(!token) ctx.throw('Please login')
    const decoded = jwt.verify(token, config.secret)
    const username = decoded.userName
    const id = decoded.userId
    if(!username || !id) ctx.throw('Verify token fail')

    let user = await User.findOne({ _id:id, username })
    if (!user) ctx.throw('Token invalid')

    await next()
  } catch (e) {
    handle.error(ctx,e)
  }
}

export default checkToken
