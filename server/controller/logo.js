import * as handle from '../extend/handler'
import {pagination} from '../extend'

import Logo from '../model/logo'

export default {
  post: async(ctx, next) => {
    let body = ctx.request.body

    try{
      if(!body.link || !body.name) ctx.throw('缺少字段')
      let res = await Logo.create(body)
      handle.data(ctx,res)
    }catch (e) {
      handle.error(ctx,e)
    }
  },
  get: async(ctx, next) => {
    let {id} = ctx.params

    try{
      let record = await Logo.findById(id)
      handle.data(ctx,record)
    }catch (e) {
      handle.error(ctx,e)
    }
  },
  patch: async(ctx, next) => {
    let {id} = ctx.params
    let body = ctx.request.body

    try{
      body.updatedAt = Date.now()
      let res = await Logo.findByIdAndUpdate(id,body)
      if(!res) ctx.throw('无记录')
      handle.success(ctx)
    }catch (e) {
      handle.error(ctx,e)
    }
  },
  del: async(ctx, next) => {
    let {id} = ctx.params

    try{
      let res = await Logo.findByIdAndDelete(id)
      if(!res) ctx.throw('无记录')
      handle.success(ctx)
    }catch (e) {
      handle.error(ctx,e)
    }
  },
  list: async(ctx, next) => {
    let page = pagination(ctx)
    try {
      let count = await Logo.countDocuments(page.query)
      let records = await Logo.find(page.query)
        .sort(page.sort)
        .skip(page.skip)
        .limit(page.limit)
        .exec()
      handle.data(ctx,records,count)
    } catch (e) {
      handle.error(ctx,e)
    }
  }
}
