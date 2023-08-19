<template>
  <el-dialog
    custom-class="preview-image"
    :visible.sync="show"
    :modal-append-to-body="false"
    :show-close="false"
    :append-to-body="true"
  >
    <div class="preview-box">
      <div class="preview-title">图片效果预览</div>
      <div class="preview-box-phone">
        <img
          class="preview-phone-bg"
          src="https://ynother.yinuocloud.com/2gzLe0InYTrgXMCOoMYtYVxsQSmtab.png"
          alt=""
        />
        <div class="preview-content">
          <div class="preview-content-title">
            {{ form.title }}
            <img class="preview-content-img" :src="form.img_url" alt="" />
          </div>
        </div>
      </div>
      <el-button
        @click="close"
        size="small"
        class="close-preview"
        type="primary"
      >
        关闭预览
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    form: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {}
  },
  methods: {
    close() {
      this.$emit('closePreviewImage')
    },
  },
}
</script>

<style lang="scss" scoped>
.preview-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.preview-title {
  font-size: 16px;
  color: #1d2129;
  margin-bottom: 28px;
}
.preview-box-phone {
  width: 280px;
  height: 368px;
  border: 8px solid #c9cdd4;
  border-radius: 20px 20px 0px 0px;
  background: #f7f8fa;
  border-bottom: 0;
  overflow: hidden;
}
.preview-phone-bg {
  width: 272px;
  height: 64px;
}
.close-preview {
  margin-top: 40px;
  width: 88px;
  height: 32px;
  border-radius: 4px;
  padding: 5px 16px;
}
.preview-content {
  margin: 20px auto;
  width: 256px;
  height: 232px;
  border-radius: 8px;
  background: #ffffff;
  padding: 16px;
  box-sizing: border-box;
}
.preview-content-title {
  font-size: 12px;
  font-weight: 500;
  color: #1d2129;
}
.preview-content-img {
  margin-top: 12px;
  width: 100%;
  height: 170px;
  border-radius: 8px;
}
</style>

<style lang="scss">
.preview-image .el-dialog__header {
  display: none;
}
.preview-image .el-dialog__body {
  padding: 32px 130px 24px 130px !important;
  box-sizing: border-box;
}
</style>