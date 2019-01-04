import * as handle from '../extend/handler'

import Tag from '../model/tag'

export default {
  list: async(ctx, next) => {
    let query = ctx.query
    try {
      let records = await Tag.find(query)
        .sort({ 'updatedAt': -1 })
        .exec()
      handle.data(ctx,records)
    } catch (e) {
      handle.error(ctx,e)
    }
  }
}
