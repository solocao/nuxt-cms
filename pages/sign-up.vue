<template>
    <div class="sign-page flex-center-c">
      <div class="panel">
        <div class="logo">
          <span>注 册</span>
        </div>
        <el-form :model="form" :rules="rules" ref="form">
          <el-form-item prop="email">
            <el-input v-model="form.email" placeholder="电子邮箱"></el-input>
          </el-form-item>
          <el-form-item prop="name">
            <el-input v-model="form.name" placeholder="昵称"></el-input>
          </el-form-item>
          <el-form-item prop="username">
            <el-input v-model="form.username" placeholder="登录账号/用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="form.password" placeholder="密码"></el-input>
          </el-form-item>
          <el-form-item prop="passwordAgain">
            <el-input type="password" v-model="form.passwordAgain" placeholder="确认密码" @keyup.enter.native="register('form')"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="register('form')">提 交</el-button>
          </el-form-item>
          <div class="no-account">已经有账号？<nuxt-link to="/sign-in">立即登录</nuxt-link></div>
        </el-form>
      </div>
    </div>
</template>

<script>
  import T from '../utils/tools/check'
    export default {
      layout: 'login',
        data(){
          let checkEmail = (rule, value, callback) => {
            if (!value) {
              return callback(new Error('请输入电子邮箱'));
            }else if (!T.isEmail(value)) {
              return callback(new Error('电子邮件格式不正确'));
            }else {
              callback();
            }
          };
          let validatePass = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入密码'));
            } else {
              if (this.form.passwordAgain !== '') {
                this.$refs.form.validateField('passwordAgain');
              }
              callback();
            }
          };
          let validatePassAgain = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请再次输入密码'));
            } else if (value !== this.form.password) {
              callback(new Error('两次输入密码不一致!'));
            } else {
              callback();
            }
          };
          return{
            isWait: true,
            form: {
              username: '',
              password: '',
              passwordAgain: '',
              email: '',
              name: ''
            },
            rules: {
              username: [
                { required: true, message: '必须设置一个登录账号/用户名', trigger: 'blur' }
              ],
              password: [
                { validator: validatePass, trigger: 'blur' }
              ],
              passwordAgain: [
                { validator: validatePassAgain, trigger: 'blur' }
              ],
              email: [
                { validator: checkEmail, trigger: 'blur' }
              ],
              name: [
                { required: true, message: '请输入昵称', trigger: 'blur' }
              ]
            }
          }
        },
      methods: {
        async register(formName){
          this.$refs[formName].validate(async(valid) => {
            if (valid) {
              let res = await this.$store.dispatch('REGISTER',this.form)
              if(res.success) {
                this.$message({message:'注册成功！',type:'success'})
                this.$router.push('/sign-in')
              }else {
                this.$message.error(res.message)
              }
            } else {
              this.$message.error('提交失败')
              return
            }
          })
        }
      }
    }
</script>
