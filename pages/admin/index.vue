<template>
  <div class="admin-dashboard">
    <div class="grid-x">
      <div class="small-8 comments">
        <div class="container">
          <div class="title">评论列表</div>
          <div class="comment-holder">
            <ul class="comment-ul">
              <li v-for="comment in comments">
                <div class="info flex-center-sb">
                  <div v-if="comment.reply">
                    <img :src="comment.user.avatar">
                    <span class="user">{{comment.user.name}}</span>
                    在
                    <span class="article" @click="goDetail(comment.article.id)">{{comment.article.title}}</span>
                    回复
                    <span class="user">{{comment.reply.name}}</span>
                    :
                    <span class="del" @click="delComment(comment.id)">删除</span>
                  </div>
                  <div v-else>
                    <img :src="comment.user.avatar">
                    <span class="user">{{comment.user.name}}</span>
                    评论
                    <span class="article" @click="goDetail(comment.article.id)">{{comment.article.title}}</span>
                    <span class="del" @click="delComment(comment.id)">删除</span>
                  </div>
                  <div class="time">{{comment.createdAt | formatDate}}</div>
                </div>
                <div class="content">{{comment.content}}</div>
              </li>
            </ul>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageIndex"
              :page-size="pageSize"
              :page-sizes="[10, 20, 30, 40, 50]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </div>
        </div>
      </div>
      <div class="small-4 statistics">
        <div class="numbs">
          <div class="title">数据</div>
          <div class="grid-x small-up-3">
            <div class="cell">
              <div>期刊</div>
              <div class="num">{{numNews}} <span>篇</span></div>
            </div>
            <div class="cell">
              <div>日志</div>
              <div class="num">{{numBlog}} <span>篇</span></div>
            </div>
            <div class="cell">
              <div>留言</div>
              <div class="num">{{numMsg}} <span>条</span></div>
            </div>
          </div>
        </div>
        <div class="ranking">
          <div class="title">浏览排行 <span>TOP10</span></div>
          <div class="container">
            <ul>
              <li class="flex-row-sb" v-for="pop in popArticle">
                <div class="text-ellipsis"><span class="type">[{{pop.type}}]</span><span class="link" @click="goDetail(pop.id)">{{pop.title}}</span></div>
                <div class="view"><span>{{pop.view | numberUnit}}</span> 次</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    layout: 'admin',
    middleware: 'auth',
    methods: {
      goDetail(id){
        window.open(`/detail/article/${id}`)
        // this.$router.push(`/detail/article/${id}`)
      },
      async delComment(id){
        let res = await this.$store.dispatch('comment/DEL_COMMENT',id)
        if(res.success){
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          let res = await this.$store.dispatch('comment/GET_COMMENTS',`?pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`)
          this.comments = res.data
        }else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      },
      async handleSizeChange(val) {
        this.pageSize = val
        let res = await this.$store.dispatch('comment/GET_COMMENTS',`?pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`)
        this.comments = res.data
      },
      async handleCurrentChange(val) {
        this.pageIndex = val
        let res = await this.$store.dispatch('comment/GET_COMMENTS',`?pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`)
        this.comments = res.data
      }
    },
    data(){
      return{
        comments: [],
        popArticle: [],
        numNews: 0,
        numBlog: 0,
        numMsg: 0,
        pageIndex: 1,
        pageSize: 10,
        total: 0
      }
    },
    async fetch({store, params}) {
      return store.dispatch('GET_USERINFO', store.state.token)
    },
    async created() {
      let [res,res1,res2,res3,res4] = await Promise.all([
        this.$store.dispatch('comment/GET_COMMENTS', `?pageIndex=1&pageSize=${this.pageSize}`),
        this.$store.dispatch('article/GET_ARTICLES', '?type=期刊'),
        this.$store.dispatch('article/GET_ARTICLES', '?type=日志'),
        this.$store.dispatch('contact/GET_CONTACTS', ''),
        this.$store.dispatch('article/GET_ARTICLES', '?pageSort=view&pageSize=10')
      ])

      this.comments = res.data
      this.total = res.total
      this.popArticle = res4.data
      this.numNews = res1.total
      this.numBlog = res2.total
      this.numMsg = res3.total
    }
  }
</script>
