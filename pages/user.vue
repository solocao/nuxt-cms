<template>
    <div class="user-page grid-container flex-center-c">
      <div class="user-container">
        <div class="avatar">
          <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :on-error="handleAvatarError"
            :before-upload="beforeAvatarUpload">
            <img v-if="avatar" :src="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <div class="info">
          <div class="name">昵称：<el-input v-model="user.name"></el-input></div>
          <div class="email">邮箱：<el-input v-model="user.email"></el-input></div>
        </div>
        <nuxt-link to="" @click.native="saveUser" class="save">保存资料</nuxt-link>
        <nuxt-link to="/">返回首页</nuxt-link>
      </div>
    </div>
</template>
<script>
  import T from '~/utils/tools/check'
  export default {
    head(){
      return{
        title: '个人资料页 - NUXT CMS'
      }
    },
    data(){
      return{
        user: {},
        avatar: ''
      }
    },
    created(){
      this.avatar = this.$store.state.user.avatar
      this.user.name = this.$store.state.user.name
      this.user.email = this.$store.state.user.email
    },
    methods: {
      async saveUser(){
        this.user.avatar = this.avatar
        this.user.id = this.$store.state.user.id
        try{
          if(!T.isEmail(this.user.email)) throw('请填写正确的邮箱地址')
          console.log(this.user)
          let res = await this.$store.dispatch('UPDATE_USER',this.user)
          if(res.success){
            this.$message({
              message: '修改用户信息成功',
              type: 'success'
            })
            setTimeout(()=>{
              this.$router.push('/')
            },300)
          }else {
            throw(res.message)
          }
        }catch (e) {
          this.$message({
            message: e,
            type: 'error'
          })
        }
      },
      handleAvatarSuccess(res,file) {
        this.avatar = res.data.url
      },
      handleAvatarError(e) {
        console.log(e)
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpg';
        const isJPEG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        let isFormat = false
        if (isJPG || isJPEG || isPNG) {
          isFormat = true
        }else {
          this.$message.error('缩略图只能是 JPG或PNG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('缩略图片大小不能超过 2MB!');
        }
        return isFormat && isLt2M;
      },
    }
  }
</script>
