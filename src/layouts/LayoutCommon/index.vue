<template>
  <!--常规布局 -->
  <div
    class="layout-common"
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
      <zn-header layout="common" />
      <div>
        <zn-side-bar layout="common" />
        <div
          v-show="showTabs"
          class="zn-main"
          :class="{
            'is-collapse-main': collapse,
          }"
        >
          <zn-tabs layout="common" />
        </div>
      </div>
    </div>
    <div
      class="zn-main main-padding"
      :class="{
        'is-collapse-main': collapse,
      }"
    >
      <zn-app-main />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'LayoutCommon',
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
  .layout-common {
    .zn-main {
      .fixed-header {
        left: $base-left-menu-width;
        width: $base-right-content-width;
      }
    }

    ::v-deep {
      .zn-tabs-content {
        width: calc(
          100% - 60px - #{$base-font-size-default} - #{$base-padding} - 2px
        ) !important;
      }

      .zn-header {
        .zn-main {
          width: 100%;
          margin: auto $base-margin;
        }
      }
    }
  }
</style>
