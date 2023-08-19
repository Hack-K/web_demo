<template>
  <el-drawer
    class="cancel-drawer"
    title="退款"
    :visible.sync="drawer"
    :direction="direction"
    :modal-append-to-body="false"
    :close-on-press-escape="false"
    :wrapperClosable="false"
    :before-close="cancel"
    :size="680"
  >
    <el-form
      class="refund-form"
      ref="refundForm"
      :model="refundForm"
      :rules="rules"
      label-position="top"
    >
      <el-form-item label="退款金额" prop="amount">
        <el-input v-model="refundForm.amount" placeholder="请输入" disabled>
          <span slot="suffix">元</span>
        </el-input>
      </el-form-item>
      <el-form-item label="退款原因">
        <el-input
          v-model="refundForm.remark"
          type="textarea"
          placeholder="请输入"
          :maxlength="200"
          show-word-limit
        ></el-input>
      </el-form-item>
      <div class="drawer-footer">
        <el-button class="el-cancel" @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit" :loading="refundLoading">提交</el-button>
      </div>
    </el-form>
    <!-- 退款验证 -->
    <RefundValidate @updateRefund="updateRefund" ref="RefundValidate" />
  </el-drawer>
</template>

<script>
  import { refundCode } from '@/api/service/order'
  import RefundValidate from './refundValidate'
  export default {
    name: 'Refund',
    components: {
      RefundValidate,
    },
    data() {
      return {
        drawer: false,
        direction: 'rtl',
        orderId: '',
        orderAmount: '',
        orderPhone: '',
        refundLoading: false,
        refundCode: '',
        refundForm: {
          amount: '',
          remark: '',
        },
        rules: {
          amount: [
            { required: true, message: '退款金额未填写', trigger: 'blur' },
          ],
        },
      }
    },
    methods: {
      // 展开抽屉
      show(data) {
        this.orderId = data.id
        this.refundForm.amount = data.amount
        this.drawer = true
      },
      // 取消
      cancel() {
        this.drawer = false
        this.refundForm.amount = ''
        this.refundForm.remark = ''
        this.$refs['refundForm'].clearValidate()
      },
      // 提交
      submit() {
        this.$refs['refundForm'].validate((valid) => {
          if (valid) {
            if(this.refundLoading) return
            this.refundLoading = true
            refundCode({
              id: this.orderId,
            }).then((res) => {
              if(res.code === 200){
                this.orderAmount = res.data.amount
                this.orderPhone = res.data.phone
                this.$refs['RefundValidate'].show(
                  res.data.amount,
                  this.refundForm.remark,
                  this.orderId,
                  res.data.phone
                )
              }
              this.refundLoading = false
            }).catch(err => {
              if(err.code === 204){
                this.$refs['RefundValidate'].show(
                  this.orderAmount || this.refundForm.amount,
                  this.refundForm.remark,
                  this.orderId,
                  this.orderPhone
                )
              }
              this.refundLoading = false
            })
          }
        })
      },
      // 退款刷新
      updateRefund() {
        this.cancel()
        this.$emit('updateDetail')
      },
    },
  }
</script>

<style lang="scss" scoped>
  .cancel-drawer{
    >::v-deep .el-drawer__container{
      z-index: 2009;
    }
  }
  .refund-form {
    ::v-deep .el-textarea__inner {
      min-height: 240px !important;
    }
    ::v-deep .el-input__suffix {
      right: 10px;
      color: $base-text-5;
    }
  }
</style>
