<template>
  <el-dialog
    :visible.sync="dialogVisible"
    custom-class="zn-dialog"
    :append-to-body="true"
    :show-close="false"
  >
    <div class="el-message-box">
      <div class="el-message-box__header">
        <div class="el-message-box__title">
          <span>提示</span>
        </div>
        <button type="button" class="el-message-box__headerbtn" @click="cancel">
          <i class="el-message-box__close el-icon-close"></i>
        </button>
      </div>
      <div class="el-message-box__content">
        <div class="el-message-box__container">
          <div class="el-message-box__status el-icon-warning"></div>
          <div class="el-message-box__message">{{ content }}</div>
        </div>
      </div>
      <div class="el-message-box__btns">
        <button
          type="button"
          class="el-button el-button--default el-button--small"
          @click="cancel"
        >
          <span>取消</span>
        </button>
        <button
          type="button"
          class="el-button el-button--default el-button--small el-button--primary"
          @click="submit"
        >
          <span>确定</span>
        </button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    props: {
      // 是否展示 dialog 弹框
      dialogVisible: {
        type: Boolean,
        default: () => false,
      },
      // 弹框 title
      title: {
        type: String,
        default: () => '提示',
      },
      // 弹框 内容
      content: {
        type: String,
        default: () => '默认提示内容',
      },
    },
    data() {
      return {}
    },
    methods: {
      // 取消操作
      cancel() {
        this.$emit('dialogCancel', true)
      },
      // 确认操作
      submit() {
        this.$emit('dialogSubmit', true)
      },
    },
  }
</script>

<style lang="scss" scoped></style>
