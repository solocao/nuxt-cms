<template>
  <div class="admin-editor">
    <el-form ref="form" :rules="rules" :model="form" label-width="80px">
      <el-form-item label="类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择">
          <el-option
            v-for="option in options"
            :key="option"
            :label="option"
            :value="option">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item v-if="form.type === '期刊'" label="描述" prop="desc">
        <el-input type="textarea" v-model="form.desc"></el-input>
      </el-form-item>
      <el-form-item v-if="form.type === '期刊'" label="缩略图" prop="thumb">
        <el-upload
          class="avatar-uploader"
          action="/api/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :on-error="handleAvatarError"
          :before-upload="beforeAvatarUpload">
          <img v-if="form.thumb" :src="form.thumb" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <div class="quill-editor"
             v-model="form.content"
             v-quill:myQuillEditor="editorOption">
        </div>
      </el-form-item>
      <el-form-item label="标签" prop="tags">
        <el-tag
          :key="tag"
          v-for="tag in form.tags"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)">
          {{tag}}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="tagInputVisible"
          v-model="tagInputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 标签</el-button>
      </el-form-item>
      <el-form-item label="常用标签">
        <el-tag
          v-for="tag in tags"
          :key="tag"
          :disable-transitions="false"
          @click.native="clickTag(tag)">
          {{tag}}
        </el-tag>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">立即提交</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
  import A from '~/utils/tools/array'
    export default {
      layout: 'admin',
      middleware: 'auth',
      methods: {
        clickTag(tag){
          this.tags = A.remove(this.tags,tag)
          this.form.tags.push(tag)
        },
        onSubmit(formName) {
          this.$refs[formName].validate(async (valid) => {
            if (valid) {
              let user = this.$store.state.user.id, res
              if(this.$route.query.id){
                this.form.id = this.$route.query.id
                delete this.form.user
                res = await this.$store.dispatch('article/PATCH_ARTICLE',this.form)
              }else {
                res = await this.$store.dispatch('article/POST_ARTICLE',Object.assign(this.form,{user}))
              }
              if(res.success) {
                this.$message({message:'提交成功',type:'success'})
                this.$router.push('/admin/articles')
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
          this.$router.push('/admin/articles')
        },
        handleAvatarSuccess(res,file) {
          this.form.thumb = res.data.url
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
        handleClose(tag) {
          this.form.tags.splice(this.form.tags.indexOf(tag), 1);
          this.tags.push(tag)
        },
        showInput() {
          this.tagInputVisible = true;
          this.$nextTick(_ => {
            this.$refs.saveTagInput.$refs.input.focus();
          });
        },
        handleInputConfirm() {
          let inputValue = this.tagInputValue;
          if (inputValue) {
            this.form.tags.push(inputValue);
          }
          this.tagInputVisible = false;
          this.tagInputValue = '';
        }
      },
      data() {
        return {
          tagInputVisible: false,
          tagInputValue: '',
          editorOption: { theme: 'snow'  },
          form: {
            type: '',
            title: '',
            desc: '',
            thumb: '',
            content: '',
            tags: []
          },
          rules: {
            type: [
              { required: true, message: '请选择类型', trigger: 'blur' }
            ],title: [
              { required: true, message: '请输入标题', trigger: 'blur' }
            ],
            desc: [
              { required: true, message: '请输入描述', trigger: 'blur' }
            ],
            thumb: [
              { required: true, message: '请上传缩略图', trigger: 'blur' }
            ],
            content: [
              { required: true, message: '请输入内容', trigger: 'blur' }
            ],
            tags: [
              { required: true, message: '请输入标签', trigger: 'blur' }
            ]
          },
          options: [ '期刊','日志' ],
          tags: []
        }
      },
      async created(){
        let res = await this.$store.dispatch('tag/GET_TAGS')
        res.data.forEach(item => {
          this.tags.push(item.name)
        })
      },
      async mounted(){
        if(this.$route.query.id){
          let res = await this.$store.dispatch('article/GET_ARTICLE',this.$route.query.id)
          let arr = res.data.tags
          res.data.tags = []
          arr.forEach(item => {
            res.data.tags.push(item.name)
          })
          Object.assign(this.form,res.data)
        }
      }
    }
</script>
