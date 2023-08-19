<template>
  <!-- 横向布局 -->
  <div
    class="layout-horizontal"
    :class="{
      fixed: fixedHeader,
      'no-tabs-bar': !showTabs,
    }"
  >
    <div
      class="layout-header"
      :class="{
        'fixed-header': fixedHeader,
      }"
    >
      <zn-header />
      <div
        v-show="showTabs"
        :class="{
          'tabs-horizontal': showTabs,
        }"
      >
        <div class="zn-main">
          <zn-tabs />
        </div>
      </div>
    </div>
    <div class="zn-main main-padding">
      <zn-app-main />
    </div>
  </div>
</template>

<script>
export default {
  name: 'LayoutHorizontal',
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
.layout-horizontal {
  // background-color: $base-color-public !important;
  ::v-deep {
    .zn-main {
      width: 92% !important;
      margin: auto;
    }
  }

  .tabs-horizontal {
    background: $base-fill-1;
    box-shadow: $base-box-shadow;
  }

  .zn-nav {
    .fold-unfold {
      display: none;
    }
  }
}
</style>
