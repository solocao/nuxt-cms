<template>
  <div class="home-page">
    <div class="grid-container">
      <div class="sec-title">
        <span>博主简介</span>
      </div>
      <div class="personal-wrapper">
        <div class="personal grid-x">
          <div class="cell small-12">
            <div class="experience">
              <!--<div class="title">工作经历：</div>-->
              <div class="work">
                <span>2008年</span>  |  3D特效师(3年)  |  3dsmax、Maya、Houdini、ZBrush、MotionBuilder、Endorphin、Realflow、Unity3D、JS/C#等<br>
                <span>2012年</span>  |  影视后期剪辑师(2年)  |  AfterEffects、PFtrack、Mocha、Avid、Resolve、MARI、Nuendo、Nuke、Smoke等<br>
                <span>2014年</span>  |  UI设计师(半年)  |  Photoshop、AI、Sketch、HTML5等<br>
                <span>2014年</span>  |  交互设计师(1年半)  |  Axure、Justinmind、AfterEffects、HTML5等<br>
                <span>2016年</span>  |  产品助理(半年)  |  Axure、Justinmind、AfterEffects、HTML5等<br>
                <span>2016年</span>  |  前端开发(半年)  |  Foundation、Element、HTML5、Less/Sass、Angular/Vue、jQuery、Git、Grunt、Mocha、Chai等<br>
                <span>2017年</span>  |  全栈开发(目前)  |  Nuxt、React、TypeScript、Nodejs、Express/Koa、Egg、MySQL、MongoDB、Mongoose、Nginx、Docker等<br>
                <div class="button" @click="dialogFormVisible = true">留言</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="sec-title">
        <span>项目链接</span>
      </div>
      <div class="project-wrapper">
        <ul class="grid-x grid-margin-x small-up-2 medium-up-5">
          <li class="cell" v-for="logo in logos" @click="goLink(logo.link)">{{logo.name}}</li>
        </ul>
      </div>
      <div class="sec-title">
        <span>标签列表</span>
      </div>
      <div class="tags-wrapper">
        <el-radio-group v-model="tag">
          <el-radio v-for="tag in tags" :key="tag.id" :label="tag.id">{{tag.name}}</el-radio>
        </el-radio-group>
      </div>
      <div class="search-wrapper">
        <el-input placeholder="请输入关键词搜索标题或内容" v-model="search" class="input-with-select" @keyup.enter.native="listBySearch">
          <el-button slot="append" icon="el-icon-search" @click="listBySearch"></el-button>
        </el-input>
      </div>
      <div class="sec-title">
        <span>文章列表</span>
      </div>
      <div class="masonry">
        <div class="item" v-for="item in $store.state.article.table" @click="goDetail(item.id)">
          <div class="item-content">
            <div class="thumb" v-if="item.thumb"><img :src="item.thumb"></div>
            <div class="thumb flex-center-c" v-else>日志</div>
            <ul class="tags">
              <li v-for="tag in item.tags">{{tag.name}}</li>
            </ul>
            <div class="title">{{item.title}}</div>
            <div class="desc">{{item.desc}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="load-more" v-show="onLoading">加载中...</div>
    <div class="load-more" v-show="noMore">没有更多数据了</div>
    <div class="load-more" v-show="noSearch">没有查询到相关数据</div>
    <div style="height: 100px;"></div>
    <!--el-dialog-->
    <el-dialog title="留言" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="" prop="name">
          <el-input v-model="form.name" placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="" prop="phone">
          <el-input v-model="form.phone" placeholder="电话"></el-input>
        </el-form-item>
        <el-form-item label="" prop="message">
          <el-input v-model="form.message" type="textarea" :rows="4" placeholder="留言内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </div>
    </el-dialog>
    <!--el-dialog-->
  </div>
</template>
<script>
  import {scrollMoreData} from "~/utils/mixins"
  import T from "~/utils/tools/check"

  export default {
    mixins: [scrollMoreData],
    methods: {
      goLink(link){
        window.open(link)
      },
      goDetail(id){
        this.$router.push(`/detail/article/${id}`)
      },
      async loadMore(){
        this.noSearch = false
        this.onLoading = true

        let storeTag = this.$store.state.tag.tag
        let pageIndex = this.$store.state.article.pageIndex
        let res
        if(storeTag) {
          let payload = {
            tagId: storeTag,
            query: `?pageIndex=${pageIndex}&pageSize=${this.pageSize}`
          }
          res = await this.$store.dispatch('article/GET_ARTICLES_BY_TAG_ID', payload)
        }else {
          res = await this.$store.dispatch('article/GET_ARTICLES', `?pageIndex=${pageIndex}&pageSize=${this.pageSize}`)
        }

        this.onLoading = false
        if(T.isEmpty(res.data)) {
          this.noMore = true
        }else {
          this.table = this.table.concat(res.data)
          await this.$store.commit('article/SET_TABLE',this.table)
        }
      },
      async listBySearch(){
        if(!this.search) return
        // reset
        this.noMore = false
        await this.$store.commit('article/SET_TABLE',[])

        let payload = {
          keyword: this.search,
          query: `?pageIndex=1&pageSize=${this.pageSize}`
        }
        let res = await this.$store.dispatch('article/GET_ARTICLES_BY_SEARCH', payload)
        if(T.isEmpty(res.data)){
          this.noSearch = true
        }else {
          this.table = res.data
          await this.$store.commit('article/SET_TABLE',this.table)
        }
      },
      async getTagContent(storeTag){
        let payload = {
          tagId: storeTag,
          query: `?pageIndex=1&pageSize=${this.pageSize}`
        }
        let res = await this.$store.dispatch('article/GET_ARTICLES_BY_TAG_ID', payload)
        this.table = res.data
        await this.$store.commit('article/SET_TABLE',this.table)
      },
      async getAllContent(){
        let res = await this.$store.dispatch('article/GET_ARTICLES', `?pageIndex=1&pageSize=${this.pageSize}`)
        this.table = res.data
        await this.$store.commit('article/SET_TABLE',this.table)
      },
      async submitForm(formName) {
        if(!this.isSubmitMessage){
          this.$refs[formName].validate(async(valid) => {
            if (valid) {
              let res = await this.$store.dispatch('contact/POST_CONTACT',this.form)
              if(res.success){
                this.$message({
                  message: '留言成功',
                  type: 'success'
                })
                this.isSubmitMessage = true
                this.dialogFormVisible = false
              }else {
                this.$message({
                  message: res.message,
                  type: 'error'
                })
                this.$refs['form'].resetFields()
              }
            } else {
              return
            }
          })
        }
      },
    },
    watch:{
      async tag(newVal, oldVal){
        await this.$store.commit('tag/SET_TAG',newVal)
        await this.$store.commit('article/RESET_PAGEINDEX')

        if(newVal){
          this.getTagContent(newVal)
        }else {
          this.getAllContent()
        }
        setTimeout(() => {
          this.noMore = false //修复切换标签，滑动调取同时调用两次API
        },200)
      },
      async search(newVal, oldVal){
        if(!newVal){
          this.noMore = false
          this.noSearch = false
          this.getAllContent()
        }
      }
    },
    head(){
      return{
        title: '首页 - NUXT CMS'
      }
    },
    data(){
      const validatePhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入电话号码'))
        } else if (!T.isPhone(value)) {
          callback(new Error('电话号码格式不正确'))
        } else {
          callback()
        }
      };
      return{
        table: [],
        tag: '',
        tags: [],
        logos: [],
        search: '',
        pageSize: 20,
        onLoading: false,
        noMore: false,
        noSearch: false,
        throttleLoad: null,
        dialogFormVisible: false,
        form: {
          name: '',
          phone: '',
          message: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          phone: [
            { validator: validatePhone, trigger: 'blur' }
          ],
          message: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
        },
        isSubmitMessage: false
      }
    },
    async mounted(){
      let res = await this.$store.dispatch('tag/GET_TAGS', '')
      let res2 = await this.$store.dispatch('logo/GET_LOGOS', '')
      this.tags = res.data
      this.logos = res2.data

      let tag = {
        name: '全部',
        id: ''
      }
      this.tags.unshift(tag)

      let storeTag = this.$store.state.tag.tag

      if(storeTag) {
        this.tag = storeTag
        this.getTagContent(storeTag)
      }

      if(this.$store.state.article.table.length === 0 || !this.search) this.getAllContent()
    }
  }
</script>
