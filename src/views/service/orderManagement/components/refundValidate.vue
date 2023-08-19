<template>
  <div v-if="drawer">
    <el-dialog
      :visible.sync="drawer"
      width="340px"
      append-to-body
      center
      custom-class="refund"
      :top="'20vh'"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      ref="dialog"
    >
      <div class="refund-dialog">
        <div class="refund-title">退款验证</div>
        <div class="refund-price">
          退款金额
          <span class="font-weight">¥{{ pay_amount }}</span>
        </div>
        <div class="refund-code">
          <div class="font-weight">验证码</div>
          <div v-if="count_down.timmer_number">
            {{ count_down.timmer_number }}s
          </div>
          <div class="reset_code_text" @click="getPhoneCode" v-else>
            重新发送验证码
          </div>
        </div>
        <div class="refund-value">
          <div
            class="refund-value-item"
            v-for="(item, index) in captchas"
            :key="index"
          >
            <input
              :key="index"
              v-model="item.num"
              :id="'captcha' + index"
              @input="inputFinash(index)"
              @focus="adjust(index)"
              @keydown="inputDirection(index)"
              class="refund-value-input"
              type="tel"
              maxlength="1"
            />
          </div>
        </div>
        <div class="refun-value-error">{{ error }}</div>
        <div class="refund-phone">
          验证码已发送至安全手机号：{{ phone }}，请联系管理员获取
        </div>
        <div class="refund-handle">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="commit" :loading="isLoading">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { refund, refundCode } from '@/api/service/order'
  export default {
    data() {
      return {
        drawer: false,
        modal: true,
        isLoading: false,
        // 当前输入框
        activeInput: 0,
        captchas: [{ num: '' }, { num: '' }, { num: '' }, { num: '' }],
        pay_amount: '',
        remark: '',
        refundId: '',
        phone: '',
        count_down: {
          timmer: '',
          timmer_number: 60,
        },
        error: '',
        inputDelStart: {
          index: 0,
          start: 1,
        },
      }
    },
    methods: {
      // 确定退款
      commit() {
        let check_code = true
        this.modal = false
        let code = ''
        for (let index = 0; index < this.captchas.length; index++) {
          if (!this.captchas[index]['num']) {
            this.error = '请输入完整验证码'
            check_code = false
          } else {
            code += this.captchas[index]['num']
          }
        }
        if (check_code) {
          //提交验证验证码
          if(this.isLoading) return
          this.isLoading = true
          this.error = ''
          refund({ id: this.refundId, code, remark: this.remark }).then(
            (res) => {
              if (res.code === 200) {
                // 退款成功
                this.$notify({
                  title: '退款成功',
                  message: '收款已退回',
                  type: 'success',
                  duration: 1000
                })
                this.captchas = [
                  { num: '' },
                  { num: '' },
                  { num: '' },
                  { num: '' },
                ]
                this.$emit('updateRefund')
                this.cancel()
                this.isLoading = false
              } else {
                this.error = res.msg
                this.isLoading = false
                return
              }
            }
          ).catch(err => {
            this.error = err.msg
            this.isLoading = false
          })
        }
      },
      // 取消
      cancel() {
        this.$nextTick(() => {
          let getDom = document.querySelector('.v-modal')
          let drawer_container = document.querySelector('.cancel-drawer')
          drawer_container.append(getDom)
          this.drawer = false
        })
      },
      // 打开退款验证
      show(pay_amount, remark, id, phone) {
        if(this.count_down['timmer']){
          clearInterval(this.count_down['timmer'])
        }
        this.pay_amount = pay_amount
        this.remark = remark
        this.refundId = id
        this.phone = phone
        this.drawer = true
        this.count_down['timmer_number'] = 60
        this.count_down['timmer'] = setInterval(() => {
          if (this.count_down['timmer_number'] <= 0) {
            clearInterval(this.count_down['timmer'])
          } else {
            this.count_down['timmer_number'] =
              this.count_down['timmer_number'] - 1
          }
        }, 1000)
      },
      // 重新发送验证码
      getPhoneCode() {
        this.count_down['timmer_number'] = 60
        this.error = ''
        this.captchas = [
          { num: '' },
          { num: '' },
          { num: '' },
          { num: '' },
        ]
        refundCode({ id: this.refundId }).then((res) => {
          if (res.code === 200) {
            this.pay_amount = res.data.amount
            this.phone = res.data.phone
            this.count_down['timmer'] = setInterval(() => {
              if (this.count_down['timmer_number'] <= 0) {
                clearInterval(this.count_down['timmer'])
              } else {
                this.count_down['timmer_number'] =
                  this.count_down['timmer_number'] - 1
              }
            }, 1000)
          }else{
            this.error = res.msg
            this.count_down.timmer_number = 0
          }
        }).catch(err => {
          this.error = res.msg
          this.count_down.timmer_number = 0
        })
      },
      // 自动校准输入顺序
      adjust(index) {
        let dom = document.getElementById('captcha' + this.activeInput)
        if (index !== this.activeInput && dom) {
          dom.focus()
        }
      },
      // 控制前后方向
      inputDirection(index) {
        let val = this.captchas[index].num
        // 回退键处理
        if (event.keyCode == 8 && val == '') {
          // 重新校准
          let dom = document.getElementById('captcha' + (index - 1))
          this.activeInput = index - 1
          if (dom) dom.focus()
        }
        if (event.keyCode != 8 && val != '') {
          let dom = document.getElementById('captcha' + (index + 1))
          this.activeInput = index + 1
          if (dom) dom.focus()
        }
      },
      // 输入框相互联动
      inputFinash(index) {
        let val = this.captchas[index].num
        this.activeInput = val ? index + 1 : index - 1
        let dom = document.getElementById('captcha' + this.activeInput)
        if (dom) dom.focus()
        if (index == this.captchas.length - 1) {
          let code = this.captchas.map((x) => x.num).join('')
          if (code.length == 4) {
            this.$emit('finish', code)
          }
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .refund-dialog {
    width: 340px;
    height: 315px;
    border-radius: 4px;
    background: #ffffff;
    padding: 20px 16px 0 16px;
    box-sizing: border-box;
    position: relative;

    .refund-title {
      font-size: 16px;
      color: #1d2129;
      font-weight: 500;
      font-size: 14px;
    }
    .refund-price {
      margin-top: 12px;
      width: 100%;
      height: 38px;
      line-height: 38px;
      border-radius: 4px;
      background: #f2f3f5;
      padding-left: 12px;
      box-sizing: border-box;
    }
    .font-weight {
      font-weight: 500;
    }
    .refund-code {
      font-size: 14px;
      color: #1d2129;
      margin-top: 12px;
      display: flex;
      justify-content: space-between;
    }
    .refund-value {
      margin-top: 8px;
      display: flex;
      justify-content: space-between;
    }
    .refund-value-item {
      width: 65px;
      height: 50px;
      display: inline-block;
      border-radius: 4px;
      box-sizing: border-box;
      border: 1px solid #e5e6eb;
      overflow: hidden;
    }
    .refund-value-input {
      width: 60px;
      line-height: 50px;
      height: 50px;
      border: none;
      color: #1d2129;
      font-size: 24px;
      text-align: center;
    }
    .refund-phone {
      margin-top: 24px;
      width: 100%;
      font-size: 12px;
      line-height: 20px;
      color: #1d2129;
      background: #f7f8fa;
      padding: 4px 16px;
      position: absolute;
      left: 0;
    }
    .refund-handle {
      margin-top: 85px;
      float: right;
    }
    .reset_code_text {
      color: #005bd9;
      cursor: pointer;
      font-size: 14px;
    }
    .refun-value-error {
      margin-top: 2px;
      color: #f94b4b;
      font-size: 12px;
    }
  }

  ::v-deep .el-dialog__header {
    display: none;
  }
  ::v-deep .el-dialog--center .el-dialog__body {
    padding: 0 !important;
  }
</style>

<style>
  .v-modal {
    /* background: rgba(0, 0, 0, 1) !important; */
  }
</style>
