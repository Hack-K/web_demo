<template>
  <!--分栏布局 -->
  <div
    class="layout-column"
    :class="{
      fixed: fixedHeader,
      'no-tabs-bar': !showTabs,
    }"
  >
    <zn-column-bar />
    <div
      class="zn-main"
      :class="{
        ['zn-main-' + theme.columnStyle]: true,
        'is-collapse-main': collapse,
      }"
    >
      <div
        class="layout-header"
        :class="{
          'fixed-header': fixedHeader,
        }"
      >
        <zn-nav />
        <zn-tabs v-show="showTabs" />
      </div>
      <zn-app-main />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'layoutColumn',
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
  },
  computed: {
    ...mapGetters({
      theme: 'settings/theme',
    }),
  },
}
</script>

<style lang="scss" scoped>
.layout-column {
  .zn-main {
    .fixed-header {
      left: $base-left-menu-width;
      width: $base-right-content-width;
    }

    &.is-collapse-main {
      &.zn-main-horizontal {
        margin-left: $base-left-menu-width-min * 1.3;

        ::v-deep {
          .fixed-header {
            left: $base-left-menu-width-min * 1.3;
            width: calc(100% - #{$base-left-menu-width-min} * 1.3);
          }
        }
      }
    }
  }
}
</style>
