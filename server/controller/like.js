import * as handle from '../extend/handler'
import {pagination} from "../extend"

import Like from '../model/like'

export default {
  post: async(ctx, next) => {
    let body = ctx.request.body
    let { user, article } = body

    try{
      if(!user || !article) ctx.throw('缺少字段')
      let res = await Like.create(body)
      handle.data(ctx,res)
    }catch (e) {
      handle.error(ctx,e)
    }
  },
  del: async(ctx, next) => {
    let {id} = ctx.params

    try{
      let res = await Like.findByIdAndDelete(id)
      if(!res) ctx.throw('无记录')
      handle.success(ctx)
    }catch (e) {
      handle.error(ctx,e)
    }
  },
  list: async(ctx, next) => {
    let page = pagination(ctx)
    try{
      let count = await Like.countDocuments(page.query)
      let records = await Like.find(page.query)
        .populate({
          path: 'user',
          select: 'name avatar'
        })
        .sort(page.sort)
        .skip(page.skip)
        .limit(page.limit)
        .exec()
      handle.data(ctx,records,count)
    }catch (e) {
      handle.error(ctx,e)
    }
  }
}
