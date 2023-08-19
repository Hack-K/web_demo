<template>
  <!--综合布局 -->
  <div
    class="layout-comprehensive"
    :class="{
      fixed: fixedHeader,
      'no-tabs-bar': !showTabs,
    }"
  >
    <zn-side-bar layout="comprehensive" />
    <div
      class="zn-main"
      :class="{
        'is-collapse-main': collapse,
      }"
    >
      <div
        class="layout-header"
        :class="{
          'fixed-header': fixedHeader,
        }"
      >
        <zn-nav layout="comprehensive" />
        <zn-tabs v-show="showTabs" />
      </div>
      <zn-app-main />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'LayoutComprehensive',
    props: {
      collapse: {
        type: Boolean,
        default() {
          return false
        },
      },
      fixedHeader: {
        type: Boolean,
        default() {
          return true
        },
      },
      showTabs: {
        type: Boolean,
        default() {
          return true
        },
      },
      device: {
        type: String,
        default() {
          return 'desktop'
        },
      },
    },
  }
</script>

<style lang="scss" scoped>
  .layout-comprehensive {
    .fixed-header {
      left: $base-left-menu-width;
      width: $base-right-content-width;
    }
  }
</style>
