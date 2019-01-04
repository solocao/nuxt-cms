<template>
  <div class="admin-editor">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="角色" prop="type">
        <el-select v-model="form.role" placeholder="请选择">
          <el-option
            v-for="option in options"
            :key="option"
            :label="option"
            :value="option">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="名称" prop="title">
        <el-input v-model="form.name"></el-input>
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
        async onSubmit(formName) {
          let res = await this.$store.dispatch('UPDATE_USER',this.form)
          if(res.success) {
            this.$message({message:'提交成功',type:'success'})
            this.$router.push('/admin/users')
          }else {
            this.$message.error(res.message)
          }
        },
        onCancel(){
          this.$router.push('/admin/users')
        }
      },
      data() {
        return {
          form: {
            role: '',
            name: ''
          },
          options: ['超级管理员','管理员','用户']
        }
      },
      async mounted(){
        if(this.$route.query.id){
          let res = await this.$store.dispatch('GET_USERINFO_BY_ID',this.$route.query.id)
          Object.assign(this.form,res.data)
        }
      }
    }
</script>
