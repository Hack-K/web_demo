<template>
  <div class="login-container">
    <div class="login-form">
      <div class="login-logo">
        <img src="@/assets/images/login-logo.png" alt="" />
      </div>
      <div class="login-title">
        欢迎使用商会运营后台
      </div>

      <el-row :gutter="24">
        <el-col :span="7.5">
          <span
            @click="switchTab(1)"
            :class="{
              'login-checkout-default': true,
              'login-checkout': type === 1,
            }"
          >
            验证码登录
          </span>
        </el-col>
        <el-col :span="12">
          <span
            @click="switchTab(2)"
            :class="{
              'login-checkout-default': true,
              'login-checkout': type === 2,
            }"
          >
            账号密码登录
          </span>
        </el-col>
      </el-row>

      <el-form
        ref="form"
        :model="form"
        class="form"
        key="1"
        :rules="rules"
        v-if="type === 1"
      >
        <el-row :gutter="0">
          <el-col :span="24">
            <el-form-item prop="phone">
              <el-input
                type="text"
                v-model="form.phone"
                placeholder="请输入手机号码"
                autocomplete="off"
                class="account-phone-input"
              >
                <template slot="prefix">
                  <div class="account-phone-prefix">中国 +86</div>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="code">
              <el-input
                type="text"
                maxlength="6"
                class="account-phone-code"
                auto-complete="off"
                autocomplete="off"
                v-model="form.code"
                placeholder="请输入短信验证码"
              >
                <template slot="suffix">
                  <div
                    class="account-phone-suffix"
                    v-if="!codeTimmer"
                    @click="sendCode"
                  >
                    {{ codeText }}
                  </div>
                  <div class="account-phone-suffix code" v-else>
                    {{ timmer }}S
                  </div>
                </template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-form
        ref="form"
        :model="form"
        class="form"
        key="2"
        :rules="rules"
        v-else
      >
        <el-row :gutter="0">
          <el-col :span="24">
            <el-form-item prop="account">
              <el-input
                v-model="form.account"
                placeholder="请输入您的账号"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="password">
              <el-input
                :type="inputType"
                v-model="form.password"
                placeholder="请输入您的密码"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-button
        class="commit"
        type="primary"
        @click="handleLogin"
        :loading="loading"
      >
        登录
      </el-button>
      <div class="copyright">Copyright ©️ 2011-2022 智脑科技版权所有</div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { sendSms, loginMobile } from '@/api/index'
export default {
  name: 'Login',
  data() {
    const validateCode = (rule, value, callback) => {
      if (!this.form.code) callback(new Error('请输入短信验证码'))
      else callback()
    }
    return {
      //登录类型 1.验证码登录 2.账号密码登录
      type: 2,
      form: {
        //账号
        account: '',
        //密码
        password: '',
        phone: '',
        code: '',
      },
      loading: false,
      rules: {
        account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
        code: [
          {
            validator: validateCode,
            trigger: 'blur',
          },
        ],
      },
      //计时器
      codeTimmer: null,
      timmer: 60,
      codeText: '获取验证码',
    }
  },
  methods: {
    ...mapActions({
      login: 'user/login',
    }),
    handleRoute() {
      return this.redirect === '/404' || this.redirect === '/403' || this.redirect === '/permission/index'
        ? '/'
        : this.redirect
    },
    handleLogin() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          this.loading = true
          try {
            await this.login({
              mobile: this.type == 2 ? '' : this.form.phone,
              code: this.type == 2 ? '' : this.form.code,
              type: this.type,
              username: this.type == 2 ? this.form.account : '',
              password: this.type == 2 ? this.form.password : '',
            }).catch(() => {})
            await this.$router.push(this.handleRoute())
          } finally {
            this.loading = false
          }
        }
      })
    },
    switchTab(num) {
      if (this.type !== num) this.$refs['form'].resetFields() //切换登录方式后清除rules校验
      this.type = num
    },
    sendCode() {
      let self = this
      this.$refs['form'].validateField('phone', (phoneError) => {
        if (phoneError) return
        // 发送验证码请求
        else
          self.codeTimmer = setInterval(() => {
            if (self.timmer === 1) {
              clearInterval(self.codeTimmer)
              self.codeTimmer = null
              self.timmer = 60
            }
            self.timmer = self.timmer - 1
          }, 1000)
        sendSms({ type: 'signIn', mobile: self.form.phone }).then((res) => {
          this.$message.success('短信发送成功')
          this.codeText = '重新获取验证码'
        })
      })
    },
  },
  watch: {
    $route: {
      handler(route) {
        this.redirect = (route.query && route.query.redirect) || '/'
      },
      immediate: true,
    },
  },
  computed: {
    inputType() {
      return this.type === 2 ? 'password' : 'text'
    },
  },
  mounted() {
    // 检测断网
    let self = this
    window.addEventListener('offline', () => {
      this.$confirm('当前网络已经断开是否刷新', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning',
      })
        .then(() => {
          location.reload()
        })
        .catch(() => {})
    })
    window.addEventListener('online', () => {})
  },
}
</script>

<style lang="scss" scoped>
.login-container {
  width: 100%;
  height: 100vh;
  position: relative;
  background: url('~@/assets/images/login_images/background2.png') 100% 100%
    fixed no-repeat;
  background-size: cover;

  .login-form {
    width: 622px;
    height: 100vh;
    background: $base-fill-1;
    position: absolute;
    right: 0;
    padding: 137px 102px 24px 122px;
    box-sizing: border-box;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .login-logo {
      margin: 0 auto 94px auto;
      width: 88px;
      height: 88px;
      // background: $base-fill-1;
      border-radius: 12px;
      box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
    }

    .login-title {
      color: #303133;
      font-weight: 600;
      font-size: 36px;
      display: inline-block;
      margin-bottom: 28px;
      position: relative;

      span {
        font-size: 14px;
        position: absolute;
        bottom: 4px;
        margin-left: 2px;
      }
    }

    .login-checkout-default {
      font-size: 16px;
      font-weight: 600;
      color: #86909c;
      line-height: 28px;
      height: 28px;
      cursor: pointer;
      display: inline-block;
      margin-bottom: 48px;
    }

    .login-checkout {
      font-weight: 600;
      font-size: 20px;
      color: #005bd9;
    }
  }

  .form::v-deep .el-row .el-col {
    margin-bottom: 28px;
  }

  .form ::v-deep .el-row .el-col:last-child {
    margin-bottom: 76px;
  }

  .form ::v-deep .el-input--small .el-input__inner {
    height: 52px;
    line-height: 52px;
    background: $base-fill-1;
    border-radius: 6px;
    font-size: 14px;
    color: #1d2129;
    margin-bottom: 0;
  }

  .el-form-item--small.el-form-item {
    margin-bottom: 0;
  }

  .commit {
    width: 100%;
    height: 52px;
    flex-shrink: 0;
  }

  .account-phone-input ::v-deep .el-input__inner {
    padding-left: 111px;
  }

  .account-phone-input ::v-deep .el-input__prefix,
  .el-input__suffix {
    left: 0;
  }

  .account-phone-code ::v-deep .el-input__suffix {
    right: 16px;
  }

  .account-phone-prefix {
    line-height: 20px;
    font-size: 14px;
    color: #1d2129;
    width: 94px;
    position: relative;
    margin-top: 15px;
    border-right: 1px solid #c9cdd4;
  }

  .account-phone-suffix {
    line-height: 20px;
    font-size: 14px;
    color: #1d2129;
    position: relative;
    margin-top: 15px;
    color: #005bd9;
    cursor: pointer;
  }

  .code {
    color: #86909c;
  }

  .copyright {
    font-size: 12px;
    display: flex;
    justify-content: flex-end;
    flex: 1;
    flex-direction: column;
    align-items: center;
  }
  .no-autofill-pwd {
    ::v-deep .el-input__inner {
      -webkit-text-security: disc !important;
    }
  }
}
</style>

<style lang="scss" scoped>
@media screen and (min-height: 100px) and (max-height: 600px) {
  .login-form {
    padding-top: 10px !important;
    .login-logo {
      margin-bottom: 40px !important;
    }
  }
}
</style>
