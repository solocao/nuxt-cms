import jwt from 'jsonwebtoken'
import md5 from 'md5'

import * as handle from '../extend/handler'
import gtSlide from "../../static/gt-slide"
import {pagination} from "../extend"

const config = require('../../config')

import User from '../model/user'

export default {
  register: async(ctx, next) => {
    let body = ctx.request.body
    let {email,username,password} = body

    try{
      let emailRecord = await User.findOne({ email })
      if(emailRecord) ctx.throw('此邮箱已经注册过，如忘记密码请重置密码')

      let usernameRecord = await User.findOne({ username })
      if(usernameRecord) ctx.throw('此用户名已被使用，换一个再试试')

      body.password = md5(password)
      await User.create(body)
      handle.success(ctx)
    }catch (e) {
      handle.error(ctx,e)
    }
  },
  login: async(ctx, next) => {
    let { username, password,geetest_challenge,geetest_validate,geetest_seccode } = ctx.request.body
    password = md5(password)
    try {
      // 对ajax提供的验证凭证进行二次验证
      let success = await gtSlide.validate(ctx.session.failback,{
        geetest_challenge,
        geetest_validate,
        geetest_seccode
      })
      if(!success) ctx.throw('GT 验证失败')
      // 验证用户
      let user = await User.findOne({username, password})
      if(!user) ctx.throw('用户名或密码错')

      let token = jwt.sign({ userId: user.id,userName: user.username }, config.secret)
      ctx.cookies.set('token', token)
      handle.data(ctx,{token})
    } catch (e) {
      handle.error(ctx,e)
    }
  },
  logout: async(ctx, next) => {
    try {
      ctx.cookies.set('token', null)
      handle.success(ctx)
    } catch (e) {
      handle.error(ctx,e)
    }
  },
  resetPassword: async(ctx, next) => {
    let {username,email,code,newPassword} = ctx.request.body
    try {
      if(!username || !email || !code || !newPassword) ctx.throw('缺少字段')
      if(code != ctx.session.validateCode) ctx.throw('验证码不正确')

      await User.updateOne({ username,email }, { password: md5(newPassword), updatedAt: Date.now() })
      handle.success(ctx)
    } catch (e) {
      handle.error(ctx,e)
    }
  },
  getUserInfo: async(ctx, next) => {
    let { token } = ctx.params
    try {
      let decoded = await jwt.verify(token, config.secret)
      let user = await User.findById(decoded.userId,'-password')
      if(!user) ctx.throw('无记录')
      handle.data(ctx,user)
    } catch (e) {
      handle.error(ctx,e)
    }
  },
  getUserInfoById: async(ctx, next) => {
    let { id } = ctx.query
    try {
      let user = await User.findById(id,{name:1,role:1})
      if(!user) ctx.throw('无记录')
      handle.data(ctx,user)
    } catch (e) {
      handle.error(ctx,e)
    }
  },
  patchUserInfo: async(ctx, next) => {
    let {id} = ctx.params
    let body = ctx.request.body

    try{
      if(body.password) ctx.throw('包含禁止修改的字段')

      let user = await User.findById(id)
      if(!user) ctx.throw('用户不存在')
      if(user.role === '超级管理员') ctx.throw('超级管理员不允许修改')

      //修改密码
      if(body.oldPassword && body.newPassword) {
        if (user.password !== md5(body.oldPassword)) ctx.throw('原密码不正确')
        await User.findByIdAndUpdate(id, { password: md5(body.newPassword), updatedAt: Date.now() })
      }else {
        if(body.role === '超级管理员') ctx.throw('超级管理员只能有一个')
        //修改其他信息
        body.updatedAt = Date.now()
        await User.findByIdAndUpdate(id, body)
      }
      handle.success(ctx)
    }catch (e) {
      handle.error(ctx,e)
    }
  },
  deleteUser: async(ctx, next) => {
    let {username} = ctx.params

    try{
      let findUser = await User.findOne({ username })
      if(!findUser) ctx.throw('用户不存在')
      if(findUser.role === '超级管理员') ctx.throw('超级管理员不允许删除')
      await User.findOneAndDelete({ username })
      handle.success(ctx)
    }catch (e) {
      handle.error(ctx,e)
    }
  },
  list: async(ctx, next) => {
    let page = pagination(ctx)
    try {
      let count = await User.countDocuments(page.query)
      let users = await User.find(page.query)
        .select({password:0})
        .sort(page.sort)
        .skip(page.skip)
        .limit(page.limit)
        .exec()
      handle.data(ctx,users,count)
    } catch (e) {
      handle.error(ctx,e)
    }
  }
}
