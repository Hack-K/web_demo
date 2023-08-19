<template>
  <el-scrollbar
    class="zn-column-bar-container"
    :class="{
      'is-collapse': collapse,
      ['zn-column-bar-container-' + theme.columnStyle]: true,
    }"
  >
    <zn-logo />
    <div class="zn-menu-title flex-center">
      <div class="pl-16 flex-center">
        <img
          :src="handleGroupImg"
          class="zn-menu-active-img mr-12"
          v-if="handleGroupImg"
        />
        <span>{{ handleGroupTitle }}</span>
      </div>
    </div>
    <el-tabs
      v-model="extra.first"
      tab-position="left"
      @tab-click="handleTabClick"
      :before-leave="beforeLeave"
    >
      <template v-for="(route, index) in handleRoutesList">
        <el-tab-pane
          :key="index + route.name"
          :name="route.name"
          :permission="!route.hashPermission"
        >
          <template slot="label">
            <div
              class="zn-column-grid"
              :class="{
                ['zn-column-grid-' + theme.columnStyle]: true,
                disable: !route.hashPermission,
              }"
              :title="route.meta.title"
            >
              <div class="zn-column-item">
                <img
                  :src="
                    route.name === extra.first
                      ? route.meta.selectImgPath
                      : route.meta.imgPath
                  "
                />
                <span>{{ route.meta.title }}</span>
              </div>
            </div>
          </template>
        </el-tab-pane>
      </template>
      <template>
        <el-tab-pane name="应用">
          <template slot="label">
            <zn-application
              :routeList="handleOtherRoutes"
              @routeUpdate="handleRoutesUpdate"
            />
          </template>
        </el-tab-pane>
      </template>
    </el-tabs>
    <el-menu
      class="mt-46"
      :background-color="variables['column-second-menu-background']"
      :default-active="activeMenu"
      :default-openeds="defaultOpeneds"
      mode="vertical"
      :unique-opened="uniqueOpened"
    >
      <template v-for="route in handlePartialRoutes">
        <zn-menu
          v-if="route.meta && !route.meta.hidden"
          :key="route.path"
          :item="route"
        />
      </template>
    </el-menu>

    <div class="bottom-container">
      <div
        class="setting flex-column"
        @click="settingRoute"
        v-if="
          handleSettingRoute.length > 0 && handleSettingRoute[0].hashPermission
        "
      >
        <zn-icon :iconName="'icon-setting'" />
      </div>
      <zn-avatar class="mb-16" />
    </div>
  </el-scrollbar>
</template>

<script>
import variables from '@/assets/styles/variables/variables.scss'
import { mapActions, mapGetters } from 'vuex'
import { defaultOpeneds, openFirstMenu, uniqueOpened } from '@/config'
import { handleActivePath, handleMatched } from '@/utils/routes'

export default {
  name: 'ZnColumnBar',
  data() {
    return {
      activeMenu: '',
      groupTitle: '',
      defaultOpeneds,
      uniqueOpened,
      variables,
      handleRoutesList: [],
      disableRoutes: [], // 禁用公共列表
    }
  },
  created() {
    this.handleRoutesUpdate()
    // console.log("handleRoutesList",this.handleRoutesList)
  },
  computed: {
    ...mapGetters({
      extra: 'settings/extra',
      theme: 'settings/theme',
      routes: 'routes/routes',
      collapse: 'settings/collapse',
      activeName: 'routes/activeName',
    }),
    /**
     * @description 原路由数据 [已停用]
     *  */
    handleRoutes() {
      let extraApplication = window.sessionStorage.getItem('extraApplication')
      return this.routes.filter(
        (route) =>
          (route.essential === 1 || route.name === extraApplication) &&
          route.meta &&
          route.meta.hidden !== true
      )
    },
    /**
     * @description 过滤设置路由
     */
    handleSettingRoute() {
      return this.routes.filter((route) => route.name === '设置')
    },
    handleOtherRoutes() {
      return this.routes.filter(
        (route) =>
          route.essential === 0 && route.meta && route.meta.hidden !== true
      )
    },
    handleActiveMenu() {
      return this.routes.find((route) => route.name === this.extra.first)
    },
    handlePartialRoutes() {
      const activeMenu = this.handleActiveMenu
      return activeMenu ? activeMenu.children : []
    },
    handleGroupTitle() {
      const activeMenu = this.handleActiveMenu
      return activeMenu ? activeMenu.meta.title + '管理' : ''
      /* 
      return activeMenu && activeMenu.meta.title !== '工作台'
        ? activeMenu.meta.title + '管理'
        : ''
       */
    },
    handleGroupImg() {
      const activeMenu = this.handleActiveMenu
      return activeMenu ? activeMenu.meta.selectImgPath : ''
      /* 
      return activeMenu && activeMenu.meta.title !== '工作台'
        ? activeMenu.meta.selectImgPath
        : ''
       */
    },
  },
  watch: {
    $route: {
      handler(route) {
        this.activeMenu = handleActivePath(route)
        const firstMenu = route.matched[0].name
        if (this.extra.first !== firstMenu) {
          this.extra.first = firstMenu
          this.handleTabClick(true)
        }
      },
      immediate: true,
    },
    activeName: {
      handler(val) {
        const matched = handleMatched(this.routes, val)
        this.extra.first = matched[0].name
        this.activeMenu = matched[matched.length - 1].path
      },
    },
  },
  methods: {
    ...mapActions({
      openSideBar: 'settings/openSideBar',
      foldSideBar: 'settings/foldSideBar',
    }),
    handleTabClick(handler) {
      let extraApplication = window.sessionStorage.getItem('extraApplication')

      if (handler !== true) {
        if (extraApplication && extraApplication !== handler.name) {
          // window.sessionStorage.removeItem("extraApplication")
          this.handleRoutesUpdate()
        }
      }
      if (handler !== true && openFirstMenu) {
        const { redirect } = this.handleActiveMenu
        this.$router.push(redirect ? redirect : this.handleActiveMenu)
      }
    },
    /**
     * @description 更新最新路由
     * @description 过滤公共应用/本地缓存应用
     */
    handleRoutesUpdate() {
      let extraApplication = window.sessionStorage.getItem('extraApplication')
      this.disableRoutes = this.routes
        .filter((route) => {
          return route.essential === 1 && !route.hashPermission
        })
        .map((item) => item.name)
      this.disableRoutes.push('应用')
      this.handleRoutesList = this.routes.filter((route) => {
        let permission =
          (route.essential === 1 || route.name === extraApplication) &&
          route.name !== '设置'
        return permission && route.meta && route.meta.hidden !== true
      })
    },
    /**
     * @descript 设置
     */
    settingRoute() {
      if (this.handleSettingRoute && this.handleSettingRoute.length < 1) {
        this.$notify({
          title: '设置失败',
          message: `路由返回失败`,
          type: 'error',
          duration: 1000,
        })
        return
      }
      this.extra.first = this.handleSettingRoute[0].name
      const { redirect } = this.handleActiveMenu
      this.$router.push(redirect ? redirect : this.handleActiveMenu)
    },
    /**
     *@description tabs切换拦截钩子
     *
     */
    beforeLeave(activeName) {
      if (this.disableRoutes.includes(activeName)) {
        return false
      } else {
        return true
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@mixin active {
  &:hover {
    color: $base-main-tone;
    background-color: $base-column-second-menu-background-active !important;

    i,
    svg {
      color: $base-main-tone;
    }
  }

  &.is-active {
    color: $base-main-tone;
    background-color: $base-column-second-menu-background-active !important;
  }
  &.is-active:after {
    content: '';
    position: absolute;
    width: 4px;
    height: 28px;
    top: 7px;
    right: 9px;
    background: $base-main-tone;
    border-radius: 10px;
  }
}
.mt-46 {
  margin-top: 46px;
}
.zn-menu-title {
  position: absolute;
  right: 0;
  top: 0;
  height: 106px;
  width: 100%;
  padding-left: $base-left-menu-width-min;
  width: 100%;
  border: 0;
  .zn-menu-active-img {
    width: 32px;
    height: 32px;
  }
  span {
    font-size: 20px;
    font-weight: 500;
    color: $base-text-5;
  }
}
.zn-column-bar-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: $base-left-menu-width;
  height: 100vh;
  z-index: 2;
  overflow: hidden;
  background: $base-fill-2;
  box-shadow: inset -1px 0px 0px $base-fill-4;

  ::v-deep {
    * {
      // transition: $base-transition;
    }
  }

  &-vertical,
  &-card,
  &-arrow {
    ::v-deep {
      .el-tabs + .el-menu {
        //left: $base-left-menu-width-min;
        width: $base-left-menu-width - $base-left-menu-width-min;
        border: 0;
      }
    }
  }

  &-horizontal {
    ::v-deep {
      .logo-container-column {
        .logo {
          width: $base-left-menu-width-min * 1.3 !important;
        }

        .title {
          margin-left: $base-left-menu-width-min * 1.3 !important;
        }
      }

      .el-tabs + .el-menu {
        //left: $base-left-menu-width-min * 1.3;
        width: $base-left-menu-width - $base-left-menu-width-min * 1.3;
        border: 0;
      }
    }
  }

  &-card {
    ::v-deep {
      .el-tabs {
        .el-tabs__item {
          padding-bottom: 15px !important;
          margin: 0 5px !important;
          .zn-column-grid {
            width: $base-left-menu-width-min - 12 !important;
            //height: $base-left-menu-width-min - 10 !important;

            height: 52px;
            border-radius: 8px;
            font-size: 12px;
            &.disable {
              cursor: no-drop;
            }
          }

          &.is-active {
            background: transparent !important;

            .zn-column-grid {
              background: $base-main-tone;

              span {
                color: #3e97ff;
                font-size: 12px !important;
              }
            }
          }
        }
        .el-tabs__item:last-child {
          margin-top: 4px !important;
        }
      }

      .el-tabs + .el-menu {
        //left: $base-left-menu-width-min + 10;
        left: $base-left-menu-width-min;
        overflow: hidden;
        width: $base-left-menu-width - $base-left-menu-width-min;
      }

      .el-submenu .el-submenu__title,
      .el-menu-item {
        min-width: 180px- $base-padding * 2;
        border-radius: 0px;
        padding: 0 26px !important;
        position: relative;
      }
    }
  }

  &-arrow {
    ::v-deep {
      .el-tabs {
        .el-tabs__item {
          line-height: 0 !important;

          &.is-active {
            background: transparent !important;

            .zn-column-grid {
              background: transparent !important;

              &:after {
                position: absolute;
                right: 0;
                width: 0;
                height: 0;
                overflow: hidden;
                content: '';
                border-color: transparent #{$base-fill-1} transparent transparent;
                border-style: solid dashed dashed;
                border-width: 8px;
              }
            }
          }
        }
      }

      .el-tabs + .el-menu {
        left: $base-left-menu-width-min + 10;
        width: $base-left-menu-width - $base-left-menu-width-min - 20;
      }

      .el-submenu .el-submenu__title,
      .el-menu-item {
        min-width: 180px;
        border-radius: 5px;
      }
    }
  }

  .zn-column-grid {
    display: flex;
    align-items: center;
    width: $base-left-menu-width-min;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    white-space: nowrap;

    &-vertical,
    &-card,
    &-arrow {
      justify-content: center;
      height: $base-left-menu-width-min;

      > div {
        svg {
          position: relative;
          top: 8px;
          display: block;
          width: $base-font-size-default + 4;
          height: $base-font-size-default + 4;
        }

        [class*='ri-'] {
          display: block;
          height: 20px;
        }
      }
    }

    &-horizontal {
      justify-content: left;
      width: $base-left-menu-width-min * 1.3;
      height: #{math.div($base-left-menu-width-min, 1.3)};
      padding-left: #{math.div($base-padding, 2)};
    }
  }

  ::v-deep {
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }

    .el-tabs {
      position: fixed;

      .el-tabs__header.is-left {
        margin-right: 0 !important;

        .el-tabs__nav-wrap.is-left {
          margin-right: 0 !important;
          background: $base-column-first-menu-background;

          .el-tabs__nav-scroll {
            padding-top: 32px;
            height: 100%;
            overflow-y: auto;
            min-width: $base-left-menu-width-min;
            &::-webkit-scrollbar {
              width: 0px;
              height: 0px;
            }
          }
        }
      }

      .el-tabs__nav {
        height: calc(100vh - #{$base-logo-height});
        background: $base-column-first-menu-background;
      }

      .el-tabs__item {
        height: auto;
        padding: 0;
        color: $base-fill-1;

        &.is-active {
          background: $base-main-tone;
        }
      }
    }

    .el-tabs__active-bar.is-left,
    .el-tabs--left .el-tabs__nav-wrap.is-left::after {
      display: none;
    }

    .el-menu {
      border: 0;
      background: transparent !important;
      .el-divider {
        margin: 0 0 $base-margin 0;
        background-color: $base-line-1;

        &__text {
          color: $base-text-5;
        }
      }

      .el-menu-item,
      .el-submenu__title {
        height: $base-menu-item-height;
        overflow: hidden;
        line-height: $base-menu-item-height;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: middle;
        background: transparent !important;
        @include active;
      }
    }
  }

  &.is-collapse {
    ::v-deep {
      width: 0;
    }
  }
}

.bottom-container {
  width: $base-left-menu-width-min;
  // height: 100px;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  flex-direction: column;
  color: $base-fill-1;
  align-content: center;
  //justify-content: space-between;
  align-items: center;
  cursor: pointer;
  .zn-icon {
    margin-right: 0;
  }
  .setting {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    color: #6a7e9b;
    margin-bottom: 18px;
    &:hover{
      background: #0F1D31;
    }
    .zn-icon {
      width: 20px;
      height: 20px;
    }
  }
}

.zn-column-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  img {
    width: 28px;
    height: 28px;
  }

  span {
    line-height: 20px;
  }
}
</style>
