<!--
 * @Descripttion: 
 * @version: v1.3.0
 * @Author: LiZeju
 * @Date: 2022-06-20 15:50:31
 * @LastEditors: LiZeju
 * @LastEditTime: 2022-06-21 11:45:50
-->
<template>
  <div class="no-permission-container">
    <div class="content">
      <img src="@/assets/images/no-permission.png" alt="" />
      <p class="tip-title mt-8 mb-8">没有权限访问</p>
      <p class="tip-deatils">
        当前登录账号为{{
          $store.state.user.username
        }}，由于所有者所在企业的管理员设置，你暂时无权限访问，请联系管理员处理
      </p>
    </div>
    <reset-dialog ref="ResetDialog" />
  </div>
</template>

<script>
import ResetDialog from './components/ResetDialog'
export default {
  name: 'index',
  components: {
    ResetDialog,
  },
  props: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {
    setTimeout(() => {
      if (this.$store.state.user.isRestPswd==1) {
      this.$refs.ResetDialog.show()
    }
    }, 500)
  },
  mounted() {},
  methods: {
  },
}
</script>

<style lang="scss" scoped>
.no-permission-container {
  overflow: hidden;
  .content {
    width: 725px;
    max-height: calc(#{$base-keep-alive-height} - 75px - 75px);
    margin: 75px auto;
    text-align: center;
    img {
      width: 100%;
      height: 100%;
    }
    .tip-deatils {
      color: $base-text-3;
      font-weight: 400;
      font-size: 14px;
    }
    .tip-title {
      color: $base-text-5;
      font-weight: 400;
      font-size: 18px;
    }
  }
}
</style>
