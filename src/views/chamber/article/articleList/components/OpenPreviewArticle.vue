<template>
  <el-drawer
    :title="'预览详情'"
    :visible.sync="drawer"
    :direction="direction"
    custom-class="prevuewArtcle"
    :append-to-body="false"
    :modal-append-to-body="false"
    :close-on-press-escape="false"
    :wrapperClosable="false"
    :before-close="cancel"
    :size="'100%'"
  >
    <div class="preview"></div>
  </el-drawer>
</template>
<script>
export default {
  props: {
    drawer: {
      type: Boolean,
      default: () => true,
    },
  },

  data() {
    return {
      direction: 'rtl',
      ceterDialogVisible: true,
    }
  },
  methods: {
    cancel() {},
    openDrawer() {},
  },
}
</script>
<style lang="scss">
</style>
<style lang="scss" scoped>
.preview {
  width: 320px;
  height: 692.91px;
  border-radius: 24px;
  border: 8px solid #b3cef4;
  box-shadow: 0px 0px 24px 0px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}
</style>