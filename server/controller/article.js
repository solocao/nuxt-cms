import async from 'promise-async'

import * as handle from '../extend/handler'
import {pagination} from '../extend'

import Tag from "../model/tag"
import Article from '../model/article'

export default {
  post: async(ctx, next) => {
    let body = ctx.request.body
    let {tags,user} = body
    try{
      if(!tags || !user) ctx.throw('缺少字段')

      // 查询标签集合，没有就插入新标签
      // 查询出该文章所有标签的id
      body.tags = []

      await async.each(tags,async (item,callback) => {
        let tag = await Tag.findOneAndUpdate({name: item},{name: item},{new: true,upsert: true,setDefaultsOnInsert:true})
        body.tags.push(tag._id)
        callback()   //very important
      })

      await Article.create(body)
      handle.success(ctx)
    }catch (e) {
      handle.error(ctx,e)
    }
  },
  get: async(ctx, next) => {
    let {id} = ctx.params

    try{
      let record = await Article.findById(id)
        .populate({
          path:'tags',
          select: 'name'
        })
        .populate({
          path:'user',
          select: 'name'
        })
        .exec()

      await Article.findByIdAndUpdate(id,{view:record.view + 1})

      let preArticle = await Article.find({ 'createdAt': { '$lt': record.createdAt } })
        .select('title')
        .sort({_id: -1})
        .limit(1)
      let nextArticle = await Article.find({ 'createdAt': { '$gt': record.createdAt } })
        .select('title')
        .sort({_id: 1})
        .limit(1)

      let temp = {}
      let pre = preArticle[0] ? preArticle[0] : {}
      let next = nextArticle[0] ? nextArticle[0] : {}

      let result = Object.assign(temp,record._doc,{pre},{next})
      handle.data(ctx,result)
    }catch (e) {
      handle.error(ctx,e)
    }
  },
  patch: async(ctx, next) => {
    let {id} = ctx.params
    let body = ctx.request.body
    let {user,tags} = body

    try{
      if(user) ctx.throw('禁止修改字段')

      body.tags = []
      await async.each(tags,async (item,callback) => {
        let tag = await Tag.findOneAndUpdate({name: item},{name: item},{new: true,upsert: true,setDefaultsOnInsert:true})
        body.tags.push(tag._id)
        callback()
      })

      body.updatedAt = Date.now()
      let res = await Article.findByIdAndUpdate(id,body)
      if(!res) ctx.throw('无记录')
      handle.success(ctx)
    }catch (e) {
      handle.error(ctx,e)
    }
  },
  del: async(ctx, next) => {
    let {id} = ctx.params

    try{
      let res = await Article.findByIdAndDelete(id)
      if(!res) ctx.throw('无记录')
      handle.success(ctx)
    }catch (e) {
      handle.error(ctx,e)
    }
  },
  list: async(ctx, next) => {
    let page = pagination(ctx)
    try {
      let count = await Article.countDocuments(page.query)
      let records = await Article.find(page.query)
        .populate({
          path:'user',
          select: 'name'
        })
        .populate({
          path:'tags',
          select: 'name'
        })
        .sort(page.sort)
        .skip(page.skip)
        .limit(page.limit)
        .exec()
      handle.data(ctx,records,count)
    } catch (e) {
      handle.error(ctx,e)
    }
  },
  listBySearch: async(ctx, next) => {
    let { keyword } = ctx.params
    let page = pagination(ctx)
    let reg = new RegExp(decodeURIComponent(keyword), 'i')
    let conditions = {$or: [{ title: { $regex: reg } }, { content: { $regex: reg } }]}
    try {
      let count = await Article.count(conditions)
      let records = await Article.find(conditions)
        .populate({
          path:'user',
          select: 'name'
        })
        .populate({
          path:'tags',
          select: 'name'
        })
        .sort(page.sort)
        .skip(page.skip)
        .limit(page.limit)
        .exec()
      handle.data(ctx,records,count)
    } catch (e) {
      handle.error(ctx,e)
    }
  },
  listByTag: async(ctx, next) => {
    let { tag } = ctx.params
    let page = pagination(ctx)

    try {
      let record = await Tag.find({name: tag})
      let conditions = { tags: {$all:[record[0]._id]} }
      let count = await Article.countDocuments(Object.assign(conditions,page.query))
      let records = await Article.find(Object.assign(conditions,page.query))
        .populate({
          path:'user',
          select: 'name'
        })
        .populate({
          path:'tags',
          select: 'name'
        })
        .sort(page.sort)
        .skip(page.skip)
        .limit(page.limit)
        .exec()
      handle.data(ctx,records,count)
    } catch (e) {
      handle.error(ctx,e)
    }
  },
  listByTagId: async(ctx, next) => {
    let { tagId } = ctx.params
    let page = pagination(ctx)

    let conditions = { tags: {$all:[tagId]} }
    try {
      let count = await Article.countDocuments(Object.assign(conditions,page.query))
      let records = await Article.find(Object.assign(conditions,page.query))
        .populate({
          path:'user',
          select: 'name'
        })
        .populate({
          path:'tags',
          select: 'name'
        })
        .sort(page.sort)
        .skip(page.skip)
        .limit(page.limit)
        .exec()
      handle.data(ctx,records,count)
    } catch (e) {
      handle.error(ctx,e)
    }
  },
}
