<template>
  <!-- 页签 -->
  <div class="zn-tabs">
    <zn-fold v-if="layout === 'common'" />
    <el-tabs
      v-model="tabActive"
      class="zn-tabs-content"
      :class="{
        ['zn-tabs-content-' + theme.tabsBarStyle]: true,
      }"
      type="card"
      @tab-click="handleTabClick"
      @tab-remove="handleTabRemove"
    >
      <el-tab-pane
        v-for="item in visitedRoutes"
        :key="item.path"
        :closable="!isNoClosable(item)"
        :name="item.path"
      >
        <span
          slot="label"
          style="display: inline-block"
          @contextmenu.prevent="openMenu($event, item)"
        >
          <template v-if="theme.showTabsIcon">
            <zn-icon
              class="mr-8"
              v-if="item.meta && item.meta.icon"
              :iconName="item.meta.icon"
              :is-custom-svg="item.meta.isCustomSvg"
            />
            <!--  如果没有图标那么取第二级的图标 -->
            <zn-icon class="mr-8" v-else :iconName="item.parentIcon" />
          </template>
          <span>{{ item.meta.title }}</span>
        </span>
      </el-tab-pane>
    </el-tabs>

    <el-dropdown @command="handleCommand" @visible-change="handleVisibleChange">
      <span class="zn-tabs-more" :class="{ 'zn-tabs-more-active': active }">
        <span class="zn-tabs-more-icon">
          <i class="box box-t"></i>
          <i class="box box-b"></i>
        </span>
      </span>
      <template #dropdown>
        <el-dropdown-menu class="tabs-more">
          <el-dropdown-item command="closeOthersTabs">
            <zn-icon :iconName="'close-other'" class="mr-5" />
            <span>关闭其他</span>
          </el-dropdown-item>
          <el-dropdown-item command="closeLeftTabs">
            <zn-icon :iconName="'left-arrow'" class="mr-5" />
            <span>关闭左侧</span>
          </el-dropdown-item>
          <el-dropdown-item command="closeRightTabs">
            <zn-icon :iconName="'right-arrow'" class="mr-5" />
            <span>关闭右侧</span>
          </el-dropdown-item>
          <el-dropdown-item command="closeAllTabs">
            <zn-icon :iconName="'close-all'" class="mr-5" />
            <span>关闭全部</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <ul
      v-if="visible"
      class="contextmenu el-dropdown-menu el-dropdown-menu--small"
      :style="{ left: left + 'px', top: top + 'px' }"
    >
      <li
        class="el-dropdown-menu__item"
        :class="{ 'is-disabled': visitedRoutes.length === 1 }"
        @click="closeOthersTabs"
      >
        <zn-icon :iconName="'close-other'" class="mr-5" />
        <span>关闭其他</span>
      </li>
      <li
        class="el-dropdown-menu__item"
        :class="{ 'is-disabled': !visitedRoutes.indexOf(hoverRoute) }"
        @click="closeLeftTabs"
      >
        <zn-icon :iconName="'left-arrow'" class="mr-5" />
        <span>关闭左侧</span>
      </li>
      <li
        class="el-dropdown-menu__item"
        :class="{
          'is-disabled':
            visitedRoutes.indexOf(hoverRoute) === visitedRoutes.length - 1,
        }"
        @click="closeRightTabs"
      >
        <zn-icon :iconName="'right-arrow'" class="mr-5" />
        <span>关闭右侧</span>
      </li>
      <li class="el-dropdown-menu__item" @click="closeAllTabs">
        <zn-icon :iconName="'close-all'" class="mr-5" />
        <span>关闭全部</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { handleActivePath, handleTabs } from '@/utils/routes'

export default {
  name: 'ZnTabs',
  props: {
    layout: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      tabActive: '',
      active: false,
      visible: false,
      top: 0,
      left: 0,
      hoverRoute: null,
    }
  },
  computed: {
    ...mapGetters({
      theme: 'settings/theme',
      routes: 'routes/routes',
      visitedRoutes: 'tabs/visitedRoutes',
    }),
  },
  watch: {
    $route: {
      handler(route) {
        this.$nextTick(() => {
          this.addTabs(route)
        })
      },
      immediate: true,
    },
    visible(value) {
      if (value) document.body.addEventListener('click', this.closeMenu)
      else document.body.removeEventListener('click', this.closeMenu)
    },
  },
  created() {
    this.initNoClosableTabs(this.routes)
  },
  methods: {
    ...mapActions({
      addVisitedRoute: 'tabs/addVisitedRoute',
      delVisitedRoute: 'tabs/delVisitedRoute',
      delOthersVisitedRoutes: 'tabs/delOthersVisitedRoutes',
      delLeftVisitedRoutes: 'tabs/delLeftVisitedRoutes',
      delRightVisitedRoutes: 'tabs/delRightVisitedRoutes',
      delAllVisitedRoutes: 'tabs/delAllVisitedRoutes',
    }),
    handleTabClick(tab) {
      if (this.isActive(tab.name))
        this.$baseEventBus.$emit('reload-router-view')
      else this.$router.push(this.visitedRoutes[tab.index])
    },
    handleVisibleChange(val) {
      this.active = val
    },
    initNoClosableTabs(routes) {
      routes.forEach((route) => {
        if (route.meta && route.meta.noClosable) this.addTabs(route)
        if (route.children) this.initNoClosableTabs(route.children)
      })
    },
    /**
     * 添加标签页
     * @param tag route
     * @returns {Promise<void>}
     */
    async addTabs(tag) {
      const tab = handleTabs(tag)
      if (tab) {
        await this.addVisitedRoute(tab)
        this.tabActive = tab.path
      }
    },
    /**
     * 根据原生路径删除标签中的标签
     * @param rawPath 原生路径
     * @returns {Promise<void>}
     */
    async handleTabRemove(rawPath) {
      await this.delVisitedRoute(rawPath)
      if (this.isActive(rawPath)) this.toLastTab()
    },
    handleCommand(command) {
      switch (command) {
        case 'closeOthersTabs':
          this.closeOthersTabs()
          break
        case 'closeLeftTabs':
          this.closeLeftTabs()
          break
        case 'closeRightTabs':
          this.closeRightTabs()
          break
        case 'closeAllTabs':
          this.closeAllTabs()
          break
      }
    },
    /**
     * 删除其他标签页
     * @returns {Promise<void>}
     */
    async closeOthersTabs() {
      if (this.hoverRoute) {
        await this.$router.push(this.hoverRoute)
        await this.delOthersVisitedRoutes(this.hoverRoute.path)
      } else
        await this.delOthersVisitedRoutes(handleActivePath(this.$route, true))
      await this.closeMenu()
    },
    /**
     * 删除左侧标签页
     * @returns {Promise<void>}
     */
    async closeLeftTabs() {
      if (this.hoverRoute) {
        await this.$router.push(this.hoverRoute)
        await this.delLeftVisitedRoutes(this.hoverRoute.path)
      } else
        await this.delLeftVisitedRoutes(handleActivePath(this.$route, true))
      await this.closeMenu()
    },
    /**
     * 删除右侧标签页
     * @returns {Promise<void>}
     */
    async closeRightTabs() {
      if (this.hoverRoute) {
        await this.$router.push(this.hoverRoute)
        await this.delRightVisitedRoutes(this.hoverRoute.path)
      } else
        await this.delRightVisitedRoutes(handleActivePath(this.$route, true))
      await this.closeMenu()
    },
    /**
     * 删除所有标签页
     * @returns {Promise<void>}
     */
    async closeAllTabs() {
      await this.delAllVisitedRoutes()
      this.toLastTab()
      await this.closeMenu()
    },
    /**
     * 跳转最后一个标签页
     */
    toLastTab() {
      const latestView = this.visitedRoutes.slice(-1)[0]
      if (latestView) this.$router.push(latestView)
      else this.$router.push('/')
    },
    isActive(path) {
      return path === handleActivePath(this.$route, true)
    },
    isNoClosable(tag) {
      return tag.meta && tag.meta.noClosable
    },
    openMenu(e, item) {
      const offsetLeft = this.$el.getBoundingClientRect().left
      const offsetWidth = this.$el.offsetWidth
      const maxLeft = Math.round(offsetWidth)
      const left = Math.round(e.clientX - offsetLeft)
      if (left > maxLeft) this.left = maxLeft
      else this.left = left
      this.top = Math.round(e.clientY - 80)
      this.hoverRoute = item
      this.hoverRoute.path = item.path
      this.visible = true
    },
    closeMenu() {
      this.visible = false
      this.hoverRoute = null
    },
  },
}
</script>

<style lang="scss" scoped>
.zn-tabs {
  position: relative;
  box-sizing: border-box;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: space-between;
  min-height: $base-tabs-height;
  padding-right: $base-padding;
  padding-left: $base-padding;
  user-select: none;
  background: $base-fill-2;
  box-shadow: inset 0px -1px 0px 0px #F2F3F5;
  ::v-deep {
    .fold-unfold {
      margin-right: $base-margin;
    }

    [class*='ri'] {
      margin-right: 3px;
    }
  }

  &-content {
    width: calc(100% - 40px);

    &-card {
      height: $base-tag-item-height;

      ::v-deep {
        .el-tabs__nav-next,
        .el-tabs__nav-prev {
          height: $base-tag-item-height;
          line-height: $base-tag-item-height;
        }

        .el-tabs__header {
          border-bottom: 0;

          .el-tabs__nav {
            border: 0;
          }

          .el-tabs__item {
            box-sizing: border-box;
            height: $base-tag-item-height;
            margin-right: 5px;
            line-height: $base-tag-item-height;
            border: 1px solid $base-border-color;
            border-radius: $base-border-radius;
            transition: padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) !important;

            &.is-active {
              color: $base-main-tone;
              background: mix($base-fill-1, $base-main-tone, 90%);
              border: 1px solid $base-main-tone;
              outline: none;
            }

            &:hover {
              border: 1px solid $base-main-tone;
            }
          }
        }
      }
    }

    &-smart {
      height: $base-tag-item-height;

      ::v-deep {
        .el-tabs__nav-next,
        .el-tabs__nav-prev {
          height: $base-tag-item-height;
          line-height: $base-tag-item-height;
        }

        .el-tabs__header {
          border-bottom: 0;

          .el-tabs__nav {
            border: 0;
          }

          .el-tabs__item {
            height: $base-tag-item-height;
            margin-right: 5px;
            line-height: $base-tag-item-height;
            border: 0;
            outline: none;
            transition: padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) !important;

            &.is-active {
              background: mix($base-fill-1, $base-main-tone, 90%);
              outline: none;

              &:after {
                width: 100%;
                transition: $base-transition;
              }
            }

            &:after {
              position: absolute;
              bottom: 0;
              left: 0;
              width: 0;
              height: 2px;
              content: '';
              background-color: $base-main-tone;
              transition: $base-transition;
            }

            &:hover {
              background: mix($base-fill-1, $base-main-tone, 90%);

              &:after {
                width: 100%;
                transition: $base-transition;
              }
            }
          }
        }
      }
    }

    &-smooth {
      height: $base-tag-item-height + 4;

      ::v-deep {
        .el-tabs__nav-next,
        .el-tabs__nav-prev {
          height: $base-tag-item-height + 4;
          line-height: $base-tag-item-height + 4;
        }

        .el-tabs__header {
          border-bottom: 0;

          .el-tabs__nav {
            border: 0;
          }

          .el-tabs__item {
            height: $base-tag-item-height + 4;
            padding: 0 18px 0 18px;
            margin-top: #{math.div(
                $base-tabs-height - $base-tag-item-height - 4.1,
                2
              )};
            // margin-right: -18px;
            line-height: $base-tag-item-height + 3;
            text-align: center;
            border: 0;
            border-radius: 4px 4px 0 0;
            border: 1px solid transparent;
            border-bottom: none;
            outline: none;
            transition: padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) !important;
            &.is-active {
              padding: 0 18px 0 18px;
              color: $base-main-tone;
              background: mix($base-fill-1, $base-main-tone, 90%);
              outline: none;
              // mask: url('~@/assets/images/tabs_images/zn-tab.png');
              mask-size: 100% 100%;
              border: 1px solid #e0e4e8;
              border-bottom: none;
              &:hover {
                padding: 0 18px 0 18px;
                color: $base-main-tone;
                background: mix($base-fill-1, $base-main-tone, 90%);
                // mask: url('~@/assets/images/tabs_images/zn-tab.png');
                mask-size: 100% 100%;
                border: 1px solid #e0e4e8;
                border-bottom: none;
              }
            }

            &:hover {
              padding: 0 18px 0 18px;
              color: $base-text-5;
              background: #dee1e6;
              // mask: url('~@/assets/images/tabs_images/zn-tab.png');
              mask-size: 100% 100%;
            }
          }
        }
      }
    }
  }

  .contextmenu {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
  }

  &-more {
    position: relative;
    box-sizing: border-box;

    &-active,
    &:hover {
      &:after {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 0;
        content: '';
      }

      .zn-tabs-more-icon {
        transform: rotate(90deg);

        .box-t {
          &:before {
            transform: rotate(45deg);
          }
        }

        .box:before,
        .box:after {
          background: $base-main-tone;
        }
      }
    }

    &-icon {
      display: inline-block;
      color: #9a9a9a;
      cursor: pointer;
      transition: transform 0.3s ease-out;

      .box {
        position: relative;
        display: block;
        width: 14px;
        height: 8px;

        &:before {
          position: absolute;
          top: 2px;
          left: 0px;
          width: 6px;
          height: 6px;
          content: '';
          background: #9a9a9a;
        }

        &:after {
          position: absolute;
          top: 2px;
          left: 8px;
          width: 6px;
          height: 6px;
          content: '';
          background: #9a9a9a;
        }
      }

      .box-t {
        &:before {
          transition: transform 0.3s ease-out 0.3s;
        }
      }
    }
  }
}
</style>
