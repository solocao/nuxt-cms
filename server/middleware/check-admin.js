import jwt from 'jsonwebtoken'
import * as handle from '../extend/handler'

import User from "../model/user"

const config = require('../../config')
const checkAdmin = async(ctx, next) => {
  let token = ctx.cookies.get('token') ? ctx.cookies.get('token') : ctx.get('token')

  try {
    if(!token) ctx.throw('Please login')
    const decoded = jwt.verify(token, config.secret)
    const username = decoded.userName
    const id = decoded.userId
    if(!username || !id) ctx.throw('Verify token fail')

    let user = await User.findOne({ _id:id, username })
    if (!user) ctx.throw('Token invalid')
    if (user.role != '超级管理员') ctx.throw('权限不够')

    await next()
  } catch (e) {
    handle.error(ctx,e)
  }
}

export default checkAdmin
