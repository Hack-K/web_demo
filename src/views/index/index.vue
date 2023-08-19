<!--
 * @Descripttion: 
 * @version: v1.3.0
 * @Author: LiZeju
 * @Date: 2022-06-06 17:41:47
 * @LastEditors: LiZeju
 * @LastEditTime: 2022-06-27 15:30:43
-->
<template>
  <div class="index-container flex-column">
    <img src="@/assets/images/index.png" class="index-img">
  </div>
</template>

<script>
export default {
  name: 'Index',
  components: {},
  data() {
    return {
    }
  },
  created() {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.index-container {
  height: $base-keep-alive-height;
  box-shadow: none;
  overflow: hidden;
  background: none !important;

  &:hover {
    box-shadow: none !important;
  }

  .index-img{
    max-width: 100%;
    max-height: 70%;
  }
}
</style>
