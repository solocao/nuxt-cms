import Koa from 'koa'
import { Nuxt, Builder } from 'nuxt'
import KoaStatic from 'koa-static'
import Router from 'koa-router'
import koaBody from 'koa-body'
import session from 'koa-session'
import cors from '@koa/cors'
import path from 'path'

import N from '../utils/tools/time'

//router
import api from './router'

//config
const config = require('../config')
const serverConfig = {
  session: {
    key: 'koa:sess',
    maxAge: N.getMillisecond(10,'minute'),
    autoCommit: true,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false
  },
  cors: {
    // credentials: true,
    // methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    // origin: `${config.app.domain}`  //前端带cookie访问需要设置跨域源
  }
}

start()  //启动服务

async function start() {
  const app = new Koa()
  const router = new Router()

  app.keys = [config.secret]

  const host = process.env.HOST || config.app.host
  const port = process.env.PORT || config.app.port

  // static
  app.use(KoaStatic(path.join(__dirname,'../static')))

  // session
  app.use(session(serverConfig.session, app))

  //cors
  app.use(cors(serverConfig.cors))

  //api
  router.use('/api', koaBody(), api.routes())

  app.use(router.routes())
  app.use(router.allowedMethods())

  // Import and Set Nuxt.js options
  let nuxtConfig = require('../nuxt.config.js')
  nuxtConfig.dev = !(app.env === 'production')

  // Instantiate nuxt.js
  const nuxt = new Nuxt(nuxtConfig)

  // Build in development
  if (nuxtConfig.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  app.use(async (ctx, next) => {
    await next()
    ctx.status = 200 // koa defaults to 404 when it sees that status is unset
    return new Promise((resolve, reject) => {
      ctx.res.on('close', resolve)
      ctx.res.on('finish', resolve)
      nuxt.render(ctx.req, ctx.res, promise => {
        promise.then(resolve).catch(reject)  // nuxt.render passes a rejected promise into callback on error.
      })
    })
  })

  app.listen(port, host)
  console.log('Server listening on ' + host + ':' + port)
}
