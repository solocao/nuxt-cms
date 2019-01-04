<template>
    <div class="article-detail">
      <div class="grid-container">
        <div class="ql-container ql-snow">
          <div class="ql-editor">
            <div class="title">{{detail.title}}</div>
            <div class="info">{{detail.user.name}} 发布于 {{detail.createdAt | formatDate}}</div>
            <hr>
            <div v-html="detail.content"></div>
          </div>
        </div>
        <hr>
        <div class="flex-center-sb nav-article">
          <div class="pre" v-if="detail.pre.id" @click="go(detail.pre.id)">上一篇：<span>{{detail.pre.title}}</span></div>
          <div v-else>上一篇：无</div>
          <div class="next" v-if="detail.next.id" @click="go(detail.next.id)">下一篇：<span>{{detail.next.title}}</span></div>
          <div class="next" v-else>下一篇：无</div>
        </div>
        <hr>
        <div class="like-wrapper">
          <div><i class="star" :class="like ? 'el-icon-star-on' : 'el-icon-star-off' " @click="toggleLike"></i></div>
          <div class="text">Like it? <span>Total <i>{{likes.total}}</i> likes this article! Total <i>{{detail.view}}</i> views!</span></div>
          <ul class="liker-wrapper">
            <li v-for="la in likerAvatars"><img :src="la"></li>
          </ul>
        </div>
        <el-input placeholder="评论内容..." v-model="commit" @keyup.enter.native="submit">
          <el-button slot="append" @click="submit">提交评论</el-button>
        </el-input>
        <hr>
        <div class="comment-wrapper">
          <ul>
            <li v-for="comment in comments" @click="reply(comment)">
              <div class="who flex-row-sb">
                <div v-if="comment.reply" class="avatar"><img :src="comment.user.avatar"><span>{{comment.user.name}}</span> 回复 <span>{{comment.reply.name}}</span> :</div>
                <div v-else class="avatar"><img :src="comment.user.avatar"><span>{{comment.user.name}}</span></div>
                <div class="date">{{comment.createdAt | formatDate}}</div>
              </div>
              <div class="comment">{{comment.content}}</div>
            </li>
          </ul>
          <div class="load-more" v-show="onLoading">加载中...</div>
          <div class="load-more" v-show="noMore">没有更多数据了</div>
        </div>
      </div>
      <div style="height: 100px;"></div>
      <div class="fixed-window fixed-bc">
        <div @click="backHome"><i class="el-icon-menu"></i></div>
        <div @click="backTop"><i class="el-icon-upload2"></i></div>
      </div>
    </div>
</template>
<script>
  import U from '~/utils/tools/ui'
  import T from "~/utils/tools/check"
  import {scrollMoreData} from "~/utils/mixins"

  export default {
    mixins: [scrollMoreData],
    head(){
      return{
        title: `${this.detail.title} - NUXT CMS`
      }
    },
    methods: {
      go(id){
        this.$router.push(`/detail/article/${id}`)
      },
      backHome(){
        this.$router.push('/')
      },
      backTop(){
        U.backToTop()
      },
      async loadMore(){
        if(!this.noMore){
          this.onLoading = true
          this.pageIndex ++
          let res = await this.$store.dispatch('comment/GET_COMMENTS', `?article=${this.detail._id}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`)
          this.onLoading = false
          if(T.isEmpty(res.data)) {
            this.noMore = true
          }else {
            this.comments = this.comments.concat(res.data)
            await this.$store.commit('comment/SET_COMMENTS',this.comments)
          }
        }
      },
      async reloadComments(){
        this.pageIndex = 1
        this.noMore = false
        this.comments = []

        let res = await this.$store.dispatch('comment/GET_COMMENTS', `?article=${this.detail._id}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`)
        this.comments = res.data
        this.$store.commit('comment/SET_COMMENTS',this.comments)
      },
      async reply(comment){
        try{
          if(!this.$store.state.user.id) throw('请先登录')
          this.$prompt('', '', {
            confirmButtonText: '回复',
            cancelButtonText: '取消',
            inputPlaceholder: '回复内容',
            inputPattern: /./,
            inputErrorMessage: '请输入内容'
          }).then(async({ value }) => {
            let body = {
              content: value,
              user: this.$store.state.user.id,
              reply: comment.user.id,
              article: comment.article.id
            }
            let res = await this.$store.dispatch('comment/POST_COMMENT',body)
            if(res.success) this.reloadComments()
          }).catch(() => {
            console.log('取消输入')
          })
        }catch (e) {
          this.$message({
            showClose: true,
            message: e,
            type: 'error'
          })
        }
      },
      async toggleLike(){
        try{
          if(!this.$store.state.user.id) throw('请先登录')
          this.like = !this.like
          let body = {
            user: this.$store.state.user.id,
            article: this.detail._id
          }
          if(this.like){
            this.likes.total ++
            let res = await this.$store.dispatch('like/POST_LIKE',body)
            this.likeId = res.data.id
            let res1 = await this.$store.dispatch('like/GET_LIKES',`?article=${this.detail._id}`)

            //清空点赞者头像重新拷贝
            this.likerAvatars = []
            res1.data.forEach(item=>{
              this.likerAvatars.push(item.user.avatar)
            })

            if(res.success && res1.success) {
              this.$message({
                showClose: true,
                message: '点赞成功',
                type: 'success'
              })
            }else {
              throw(res.message)
            }
          }else {
            this.likes.total --
            let res = await this.$store.dispatch('like/DEL_LIKE',this.likeId)
            let res1 = await this.$store.dispatch('like/GET_LIKES',`?article=${this.detail._id}`)

            //清空点赞者头像重新拷贝
            this.likerAvatars = []
            res1.data.forEach(item=>{
              this.likerAvatars.push(item.user.avatar)
            })

            if(res.success && res1.success) {
              this.$message({
                showClose: true,
                message: '取消点赞成功',
                type: 'success'
              })
            }else {
              throw(res.message)
            }
          }
        }catch (e) {
          this.$message({
            showClose: true,
            message: e,
            type: 'error'
          })
        }
      },
      async submit(){
        try{
          if(!this.$store.state.user.id) throw('请先登录')
          if(!this.commit) throw('请填写评论内容')
          let body = {
            content: this.commit,
            user: this.$store.state.user.id,
            article: this.detail._id
          }
          let res = await this.$store.dispatch('comment/POST_COMMENT',body)
          if(res.success) this.reloadComments()
        }catch (e) {
          this.$message({
            showClose: true,
            message: e,
            type: 'error'
          })
        }
      }
    },
    async asyncData({store,params}){
      let [res,res2,res3] = await Promise.all([
        store.dispatch('article/GET_ARTICLE',params.id),
        store.dispatch('like/GET_LIKES',`?article=${params.id}&user=${store.state.user.id}`),
        store.dispatch('like/GET_LIKES',`?article=${params.id}&pageSize=50`)
      ])

      //拷贝点赞者头像
      let likerAvatars = []
      if(res3.total > 0){
        res3.data.forEach(item=>{
          likerAvatars.push(item.user.avatar)
        })
      }

      return{
        detail:res.data,
        like: res2.total > 0 ? true : false,
        likeId: res2.total > 0 ? res2.data[0].id : null,
        likes: res3,
        likerAvatars
      }
    },
    async created(){
      let res = await this.$store.dispatch('comment/GET_COMMENTS', `?article=${this.detail._id}&pageIndex=1&pageSize=${this.pageSize}`)
      this.comments = res.data
      await this.$store.commit('comment/SET_COMMENTS',this.comments)
    },
    data(){
      return{
        commit: '',
        comments: [],
        pageIndex: 1,
        pageSize: 10,
        onLoading: false,
        noMore: false,
      }
    }
  }
</script>
