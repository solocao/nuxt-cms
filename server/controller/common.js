import * as handle from '../extend/handler'
import N from '../../utils/tools/number'
import {sendMail} from '../extend'
import gtSlide from '../../static/gt-slide'

import User from "../model/user"

//upload thumb
export const uploadThumb = async(ctx, next) => {
  try {
    handle.filePath(ctx,'/thumb')
  }catch (e) {
    handle.error(ctx,e)
  }
}
// getCode
export const getCode = async(ctx, next) => {
  let {username,email} = ctx.request.body

  try{
    if(!username || !email) ctx.throw('缺少字段')
    let user = await User.findOne({username, email})
    if(!user) ctx.throw('用户名和邮箱不匹配')

    let n = ctx.session.views || 0
    ctx.session.views = ++n
    if(ctx.session.views > 3) ctx.throw('获取验证码太频繁，请10分钟后再试！')

    let code = N.randomCode(6)
    ctx.session.validateCode = code
    let html = `<div>验证码： <span style="font-size: 20px;color:#ff4c29;">${code}</span> 10分钟内有效</div>`
    await sendMail(email,'获取验证码',html)
    handle.success(ctx)
  }catch (e) {
    handle.error(ctx,e)
  }
}

// sendEmail
export const sendEmail = async (ctx, next) => {
  let {to,subject,html} = ctx.request.body

  try{
    if(!to || !subject || !html) ctx.throw('缺少字段')
    let res = await sendMail(to,subject,html)
    handle.data(ctx,res)
  }catch (e) {
    handle.error(ctx,e)
  }
}

// gtRegister
export const gtRegister = async(ctx, next) => {
  try{
    // 向极验申请每次验证所需的challenge
    let res = await gtSlide.register(null)
    if(!res.success){
      // 进入 failback，如果一直进入此模式，请检查服务器到极验服务器是否可访问
      ctx.session.failback = true
      ctx.body = res
    }else {
      // 正常模式
      ctx.session.failback = false
      ctx.body = res
    }
  }catch (e) {
    ctx.body = e
  }
}
