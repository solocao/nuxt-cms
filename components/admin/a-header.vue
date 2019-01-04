<template>
  <div class="a-header">
    <div class="grid-x">
      <div class="cell shrink menu-collapse"><i :class="$store.state.admin.isMenuCollapse ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'" @click="$store.commit('admin/SET_COLLAPSE')"></i></div>
      <div class="cell auto">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item v-for="(b,index) in breadcrumbs" :key="index" :to="b.path">{{b.name}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="cell shrink float-r welcome">
        <div>Hi {{$store.state.user.name}}， {{dayTime}}好！</div>
        <div>
          <el-dropdown size="small" @command="handleCommand">
              <span class="el-dropdown-link">
                {{lang}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="zh_CN">中文</el-dropdown-item>
              <el-dropdown-item command="en_US">English</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import D from '~/utils/tools/date'
  import N from '~/utils/tools/net'

  export default {
    computed: {
      dayTime: function () {
        return D.countTime(new Date(), 'daytime')
      },
      lang: function () {
        switch (this.$store.state.locale) {
          case 'zh_CN':
            return '中文'
            break
          case 'en_US':
            return 'English'
            break
        }
      }
    },
    watch:{
      '$route' (to, from) {
        let arr = N.getBreadcrumbs(to.path)

        console.log(to.path)
        let breadcrumbs = []
        arr.forEach(item => {
          switch (item) {
            case '':
              breadcrumbs.push({path:'/',name:this.$t('admin.home')})
              break
            case 'admin':
              breadcrumbs.push({path:'/admin',name:this.$t('admin.dashboard')})
              break
            case 'users':
              breadcrumbs.push({path:'/admin/users',name:this.$t('admin.userManagement')})
              break
            case 'articles':
              breadcrumbs.push({path:'/admin/articles',name:this.$t('admin.articleManagement')})
              break
            case 'logos':
              breadcrumbs.push({path:'/admin/logos',name:this.$t('admin.logoManagement')})
              break
            case 'contact':
              breadcrumbs.push({path:'/admin/contact',name:this.$t('admin.contactManagement')})
              break
            case 'editor':
              breadcrumbs.push({path:'/admin/articles/editor',name:this.$t('admin.articleEditor')})
              break
          }
        })
        this.breadcrumbs = breadcrumbs
      }
    },
    methods: {
      handleCommand(command) {
        this.$store.commit('SET_LANG', command)
        this.$i18n.locale = command
      },
    },
    data(){
      return{
        breadcrumbs: [{
          path:'/',
          name:this.$t('admin.home')
        },{
          path:'/admin',
          name:this.$t('admin.dashboard')
        }]
      }
    }
  }
</script>
