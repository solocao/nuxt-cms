<template>
  <div class="admin-editor">
    <el-form ref="form" :rules="rules" :model="form" label-width="100px">
      <el-form-item label="机构名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="链接地址" prop="link">
        <el-input v-model="form.link"></el-input>
      </el-form-item>
      <el-form-item label="缩略图" prop="thumb">
        <el-upload
          class="avatar-uploader"
          action="/api/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :on-error="handleAvatarError"
          :before-upload="beforeAvatarUpload">
          <img v-if="form.imgPath" :src="form.imgPath" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div class="info">为保证前端样式统一，请上传图片尺寸226x92的图片</div>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">立即提交</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
    export default {
      layout: 'admin',
      middleware: 'auth',
      methods: {
        onSubmit(formName) {
          this.$refs[formName].validate(async (valid) => {
            if (valid) {
              let res
              if(this.$route.query.id){
                res = await this.$store.dispatch('logo/PATCH_LOGO',this.form)
              }else {
                res = await this.$store.dispatch('logo/POST_LOGO',this.form)
              }
              if(res.success) {
                this.$message({message:'提交成功',type:'success'})
                this.$router.push('/admin/logos')
              }else {
                this.$message.error(res.message)
              }
            } else {
              this.$message.error('提交失败')
              return false;
            }
          });
        },
        onCancel(){
          this.$router.push('/admin/logos')
        },
        handleAvatarSuccess(res,file) {
          this.form.imgPath = res.data.url
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
        }
      },
      data() {
        return {
          form: {
            link: '',
            imgPath: '',
            name: ''
          },
          rules: {
            link: [
              { required: true, message: '请输入链接地址', trigger: 'blur' }
            ],
            name: [
              { required: true, message: '请输入机构名称', trigger: 'blur' }
            ],
            imgPath: [
              { required: true, message: '请上传缩略图', trigger: 'blur' }
            ]
          }
        }
      },
      async mounted(){
        if(this.$route.query.id){
          let res = await this.$store.dispatch('logo/GET_LOGO',this.$route.query.id)
          Object.assign(this.form,res.data)
        }
      }
    }
</script>
