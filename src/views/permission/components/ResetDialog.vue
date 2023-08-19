<template>
  <el-dialog :close-on-press-escape="false" :close-on-click-modal="false" :visible.sync="dialogVisible" :width="'569px'"
    :show-close="false" :modal="true" :append-to-body="true" custom-class="reset-dialog" title="修改密码">
    <el-form :model="form" ref="form" :rules="rules" :validate-on-rule-change="false">
      <el-col :span="24" class="tips">
        当前为初始密码，安全性较低，请立即修改密码
      </el-col>
      <!-- <el-col :span="24">
        <el-form-item label="当前密码" prop="old_pwd">
          <el-input
            v-model="form.old_pwd"
            clearable
            type="password"
            placeholder="请输入"
            auto-complete="new-password"
          ></el-input>
        </el-form-item>
      </el-col> -->

      <el-col :span="24">
        <el-form-item label="新密码" prop="new_pwd" :style="accountTipShow ? { marginBottom: 0 } : { marginBottom: '25px' }
          ">
          <el-input v-model="form.new_pwd" placeholder="请输入" class="no-autofill-pwd" clearable></el-input>
          <p class="tips-p" v-if="accountTipShow">
            密码6~14位
          </p>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="确认密码" prop="new_pwd2">
          <el-input class="no-autofill-pwd" v-model="form.new_pwd2" clearable placeholder="请输入"
            auto-complete="new-password"></el-input>
        </el-form-item>
      </el-col>
    </el-form>
    <div class="dialog-footer">
      <el-tooltip class="item" effect="dark" content="确认后，使用新密码重新登录" placement="top">
        <el-button class="dialog-commit" @click="commit" type="primary">
          确认
        </el-button>
      </el-tooltip>
    </div>
  </el-dialog>
</template>

<script>
import { editPwd } from '@/api/index'
import { mapActions } from 'vuex'
export default {
  name: 'ResetDialog',
  data() {
    const validatePass2 = (rule, value, callback) => {
      if (value == '') callback(new Error('请再次输入密码'))
      if (value !== this.form.new_pwd)
        callback(new Error('两次输入密码不一致!'))
      else callback()
    }
    const validatePass = (rule, value, callback) => {
      // let reg = /^(?=.*[A-Z])(?=.*\d)[^]{8,16}$/
      if (value == '') {
        this.accountTipShow = false
        callback(new Error('请输入密码'))
      }
      // if (!reg.test(value)) {
      //   this.accountTipShow = false
      //   callback(new Error('密码至少包含大写字母，数字，8～16位之间'))
      // } else callback()

      if (value.length <= 5 || value.length >= 15) {
        this.accountTipShow = false
        callback(new Error('密码6~14位'))
      } else callback()
    }

    return {
      dialogVisible: false,
      form: {
        // old_pwd: '',
        new_pwd: '',
        new_pwd2: '',
      },
      rules: {
        // old_pwd: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
        new_pwd: [
          {
            required: true,
            trigger: ['blur', 'change'],
            validator: validatePass,
          },
        ],
        new_pwd2: [
          { required: true, trigger: 'blur', validator: validatePass2 },
        ],
      },
      accountTipShow: true,
    }
  },
  methods: {
    ...mapActions({
      _logout: 'user/logout',
    }),
    async logout() {
      await this._logout()
      await this.$router.push(toLoginRoute(this.$route.fullPath))
    },
    show() {
      this.dialogVisible = true
    },
    commit() {
      this.$refs['form'].validate((valid) => {
        this.accountTipShow = valid
        if (valid) {
          let data = {
            // old_pwd: this.form.old_pwd,
            new_pwd: this.form.new_pwd,
          }
          editPwd(data).then((res) => {
            if (window.V7Softphone) {
              window.V7Softphone.webPhoneApi.disconnect() //注销设备
              window.V7Softphone.agentApi.offline({
                //退出登录
                toAnswerOffline: '0',
                success: (res) => {
                  if (res.success) {
                    this.$notify({
                      title: '成功',
                      message: '坐席已退出',
                      type: 'success',
                      duration: 1000
                    })
                  }
                },
                fail: function (error) {
                  this.$message.error(error)
                },
              })
            }
            setTimeout(() => {
              this.logout()
            }, 1000)
          })
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep .reset-dialog {
  height: 600px;
  position: relative;
  border-radius: $base-border-radius-8;

  .el-dialog__header {
    background: $base-text-4;
    font-weight: 700;
    font-size: 16px;
    padding: 20px 24px;
    border-top-left-radius: $base-border-radius-8;
    border-top-right-radius: $base-border-radius-8;

    .el-dialog__title {
      color: $base-text-1;
    }
  }

  .el-dialog__body {
    padding: 16px 24px;
    overflow: hidden;

    .dialog-footer {
      text-align: right;
      position: absolute;
      right: 24px;
      bottom: 20px;
    }

    .el-form {
      clear: both;

      .el-form-item__error {
        height: 25px;
        line-height: 25px;
      }

      .tips-p {
        color: $base-Warning-6;
      }

      .tips {
        color: $base-Warning-6;
        background: $base-Warning-1;
        border-radius: 2px;
        padding: 9px 16px;
        font-weight: 400;
        font-size: 14px;
      }

      .el-col {
        .el-form-item {
          margin-bottom: 25px;

          .el-input {
            .el-input__inner {
              height: $base-input-height;
              line-height: $base-input-height;
              border: 1px solid $base-line-3;
              border-radius: $base-border-radius-4;
            }

            .el-input__suffix {
              line-height: $base-input-height;
            }
          }
        }
      }
    }
  }
}

.dialog-content {
  height: 536px;
  padding: 16px 24px;
  box-sizing: border-box;

  .password-tips {
    color: $base-Warning-6;
    margin: 8px 0;
  }

  .dialog-commit {
    position: absolute;
    width: 83px;
    right: 24px;
    bottom: 16px;
  }
}

.no-autofill-pwd {
  ::v-deep .el-input__inner {
    -webkit-text-security: disc !important;
  }
}
</style>
