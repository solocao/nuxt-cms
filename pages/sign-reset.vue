<template>
  <div class="sign-page flex-center-c">
    <div class="panel">
      <div class="logo">
        <span>重置密码</span>
      </div>
      <el-form :model="form1" :rules="rules" ref="form1">
        <el-form-item prop="username">
          <el-input v-model="form1.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model="form1.email" placeholder="邮箱"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getCode('form1')">获取验证码</el-button>
        </el-form-item>
      </el-form>

      <el-form :model="form2" :rules="rules" ref="form2">
        <el-form-item prop="code">
          <el-input v-model="form2.code" placeholder="验证码"></el-input>
        </el-form-item>
        <el-form-item prop="newPassword">
          <el-input v-model="form2.newPassword" placeholder="新密码"></el-input>
        </el-form-item>
        <el-form-item>
          <div style="height: 10px;"></div>
          <el-button type="primary" @click="submit('form2')">确 认</el-button>
        </el-form-item>
        <div class="no-account">
          <nuxt-link to="/sign-in">返回登录</nuxt-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  import T from '../utils/tools/check'

  export default {
    layout: 'login',
    data() {
      let checkEmail = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入电子邮箱'));
        } else if (!T.isEmail(value)) {
          return callback(new Error('电子邮件格式不正确'));
        } else {
          callback();
        }
      };
      let checkPassword = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入新密码'));
        } else if (!T.isPassword(value)) {
          return callback(new Error('密码以字母开头，长度在6~18之间，只能包含字母、数字和下划线'));
        } else {
          callback();
        }
      };
      return {
        form1: {
          username: '',
          email: ''
        },
        form2: {
          code: '',
          newPassword: ''
        },
        rules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          email: [
            {validator: checkEmail, trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入验证码', trigger: 'blur'}
          ],
          newPassword: [
            {validator: checkPassword, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      async submit(formName) {
        this.$refs[formName].validate(async(valid) => {
          if (valid) {
            let data = Object.assign(this.form1,this.form2)
            let res = await this.$store.dispatch('RESET_PASSWORD',data)
            if(res.success) {
              this.$message({message:'重置密码成功',type:'success'})
              this.$router.push('/sign-in')
            }else {
              this.$message.error(res.message)
            }
          } else {
            this.$message.error('提交失败')
            return
          }
        })
      },
      async getCode(formName) {
        this.$refs[formName].validate(async(valid) => {
          if (valid) {
            let res = await this.$store.dispatch('GET_CODE',this.form1)
            if(res.success) {
              this.$message({message:'验证码已经发送到你邮箱，请查收！',type:'success'})
            }else {
              this.$message.error(res.message)
            }
          } else {
            this.$message.error('获取验证码失败')
            return
          }
        })
      }
    }
  }
</script>
