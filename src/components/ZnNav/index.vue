<template>
  <div class="zn-nav">
    <el-row :gutter="15">
      <el-col :lg="12" :md="12" :sm="12" :xl="12" :xs="4">
        <div class="left-panel">
          <zn-fold v-if="layout !== 'float'" />
          <zn-refresh class="ml-10" />
          <zn-full-screen class="mr-30 ml-30" />
          <el-tabs
            v-if="layout === 'comprehensive'"
            v-model="extra.first"
            tab-position="top"
            @tab-click="handleTabClick"
          >
            <template v-for="(route, index) in handleRoutes">
              <el-tab-pane :key="index + route.name" :name="route.name">
                <span slot="label">
                  <zn-icon
                    v-if="route.meta.icon"
                    :iconName="route.meta.icon"
                    :is-custom-svg="route.meta.isCustomSvg"
                    style="min-width: 16px"
                  />
                  {{ route.meta.title }}
                </span>
              </el-tab-pane>
            </template>
          </el-tabs>
          <!-- <zn-breadcrumb v-else class="hidden-xs-only"/> -->
        </div>
      </el-col>
      <el-col :lg="12" :md="12" :sm="12" :xl="12" :xs="20">
        <div class="right-panel">
          <!--          <zn-error-log/>-->
          <!--          <zn-search/>-->
          <!--          <zn-public-search/>-->
          <!--          <zn-notice/>-->
          <!--          <zn-full-screen/>-->
          <!--          <zn-theme/>-->
          <!--          <zn-refresh/>-->
          <!--          <zn-down-loading/>-->
          <!--          <zn-avatar/>-->
          <!--          <zn-refresh/>-->
          <!--          <zn-down-loading/>-->
          <!--          <zn-avatar/>-->
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { openFirstMenu } from '@/config'

export default {
  name: 'ZnNav',
  props: {
    layout: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      firstMenu: '',
    }
  },
  computed: {
    ...mapGetters({
      extra: 'settings/extra',
      routes: 'routes/routes',
    }),
    handleRoutes() {
      return this.routes.filter(
        (route) => route.meta && route.meta.hidden !== true
      )
    },
    handleActiveMenu() {
      return this.routes.find((route) => route.name === this.extra.first)
    },
    handlePartialRoutes() {
      const activeMenu = this.handleActiveMenu
      return activeMenu ? activeMenu.children : []
    },
  },
  watch: {
    $route: {
      handler(route) {
        const firstMenu = route.matched[0].name
        if (this.extra.first !== firstMenu) {
          this.extra.first = firstMenu
          this.handleTabClick(true)
        }
      },
      immediate: true,
    },
  },
  methods: {
    handleTabClick(handler) {
      if (handler !== true && openFirstMenu) {
        const { redirect } = this.handleActiveMenu
        this.$router.push(redirect ? redirect : this.handleActiveMenu)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.zn-nav {
  position: relative;
  height: $base-nav-height;
  padding-right: $base-padding;
  padding-left: $base-padding;
  // overflow: hidden;
  user-select: none;
  background: $base-fill-2;
  box-shadow: inset 0px -1px 0px 0px #F2F3F5;

  .left-panel {
    display: flex;
    align-items: center;
    justify-items: center;
    height: $base-nav-height;

    i {
      cursor: pointer;
    }

    ::v-deep {
      .fold-unfold {
        margin-right: $base-margin;
      }

      .el-tabs {
        width: 100%;
        margin-left: $base-margin;

        .el-tabs__header {
          margin: 0;

          > .el-tabs__nav-wrap {
            display: flex;
            align-items: center;

            .el-icon-arrow-left,
            .el-icon-arrow-right {
              font-weight: 600;
              color: $base-text-5;
            }
          }
        }

        .el-tabs__item {
          text-align: center;

          > div {
            display: flex;
            align-items: center;

            i {
              margin-right: 3px;
            }
          }
        }
      }

      .el-tabs__nav-wrap::after {
        display: none;
      }
    }
  }

  .right-panel {
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: flex-end;
    height: $base-nav-height;

    ::v-deep {
      [class*='ri-'] {
        margin-left: $base-margin;
        color: $base-text-5;
        cursor: pointer;
      }

      button {
        [class*='ri-'] {
          margin-left: 0;
          color: $base-fill-1;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
