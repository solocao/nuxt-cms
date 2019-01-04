import nodemailer from 'nodemailer'
import path from 'path'
const config = require('../../config')

export const options = {
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) {
      delete ret._id
      return ret
    }
  }
}

export function uploadConfig(uri) {
  return{
    multipart: true,
    formidable:{
      uploadDir:path.join(__dirname,`../../static/uploads${uri}`),
      keepExtensions: true,    // 保持文件的后缀
      maxFieldsSize:2 * 1024 * 1024  // 限制2M
    }
  }
}

export function sleep(time) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve()
    }, time)
  })
}

export function pagination(ctx) {
  let query = ctx.query
  let {pageIndex = 1, pageSize = 100, pageSort = 'createdAt'} = query
  let skip = (Number(pageIndex) - 1) * Number(pageSize)
  let limit = Number(pageSize)
  let sort = {}
  sort[pageSort] = -1
  delete query.pageIndex
  delete query.pageSize
  delete query.pageSort
  return {
    query,
    skip,
    limit,
    sort
  }
}

export async function sendMail(to, subject, html) {
  if(!to || !subject || !html) return '缺少字段'
  let transporter = nodemailer.createTransport({
    host: 'smtp.exmail.qq.com',
    service: 'qq',  //QQ邮箱
    port: 465,
    secure: true,
    auth: {
      user: config.SMTPConfig.user,
      pass: config.SMTPConfig.pass
    }
  })
  let mailOptions = {
    from: config.SMTPConfig.user,
    to: to,
    subject: subject,
    html: html
  }
  let res = await transporter.sendMail(mailOptions)
  return res
}

