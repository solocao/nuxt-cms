<template>
  <div class="sign-page flex-center-c">
    <div class="panel">
      <div class="logo">
        <span>登 录</span>
      </div>
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="form.password" placeholder="密码" @keyup.enter.native="login"></el-input>
        </el-form-item>
        <div id="captcha">
          <p v-show="isWait" class="waiting">正在加载验证码......</p>
        </div>
        <el-form-item>
          <el-button type="primary" @click="login">登 录</el-button>
        </el-form-item>
        <div class="no-account">
          <nuxt-link to="/sign-reset">重置密码</nuxt-link>
          没有账号？
          <nuxt-link to="/sign-up">点击注册</nuxt-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  import N from '../utils/tools/net'

  export default {
    layout: 'login',
    data() {
      return {
        isWait: true,
        form: {
          username: '',
          password: ''
        },
        rules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
          ]
        }
      }
    },
    async mounted() {
      let data = await this.$store.dispatch('GT_REGISTER')
      initGeetest({
        // 以下 4 个配置参数为必须，不能缺少
        gt: data.gt,
        challenge: data.challenge,
        offline: !data.success, // 表示用户后台检测极验服务器是否宕机
        new_captcha: data.new_captcha, // 用于宕机时表示是新验证码的宕机

        product: "popup", // 产品形式，包括：float，popup,bind
        width: "300px"
        // 更多配置参数说明请参见：http://docs.geetest.com/install/client/web-front/
      }, this.validate)
    },
    methods: {
      async login() {
        let result = window.captchaObj.getValidate()
        if (!this.form.username || !this.form.password) {
          return this.$message.error('请输入用户名和密码')
        } else if (!result) {
          return this.$message.error('请完成验证')
        }

        let geetestData = {
          geetest_challenge: result.geetest_challenge,
          geetest_validate: result.geetest_validate,
          geetest_seccode: result.geetest_seccode
        }

        let res = await this.$store.dispatch('LOGIN', Object.assign(this.form, geetestData))
        if (res.success) {
          N.setCookie('token', res.data.token)
          this.$router.push('/')
          this.$message({message: '登录成功', type: 'success'})
          setTimeout(() => {
            location.reload()
          }, 300)
        } else {
          this.$message.error(res.message)
          window.captchaObj.reset()
        }
      },
      async validate(captchaObj) {
        let _this = this
        captchaObj.appendTo('#captcha');
        captchaObj.onReady(() => {
          _this.isWait = false
        })
        window.captchaObj = captchaObj
      }
    }
  }
</script>
