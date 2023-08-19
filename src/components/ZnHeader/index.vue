<template>
  <div class="zn-header">
    <div class="zn-main">
      <el-row :gutter="20">
        <el-col :span="6">
          <zn-logo />
        </el-col>
        <el-col :span="18">
          <div class="right-panel">
            <el-menu
              v-if="'horizontal' === layout"
              :active-text-color="variables['menu-color-active']"
              :background-color="variables['menu-background']"
              :default-active="activeMenu"
              menu-trigger="hover"
              mode="horizontal"
              :text-color="variables['menu-color']"
            >
              <template v-for="(route, index) in handleRoutes">
                <zn-menu
                  v-if="route.meta && !route.meta.hidden"
                  :key="index + route.name"
                  :item="route"
                  :layout="layout"
                />
              </template>
            </el-menu>
            <zn-error-log />
            <zn-public-search />
            <zn-call-bar/>
            <zn-notice />
            <zn-full-screen />
            <zn-theme />
            <zn-refresh />
            <zn-down-loading/>
            <zn-avatar />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import variables from '@/assets/styles/variables/variables.scss'
  import { mapGetters } from 'vuex'
  import { handleActivePath, handleMatched } from '@/utils/routes'

  export default {
    name: 'ZnHeader',
    props: {
      layout: {
        type: String,
        default: 'horizontal',
      },
    },
    data() {
      return {
        activeMenu: '',
        menuTrigger: 'hover',
      }
    },
    computed: {
      ...mapGetters({
        routes: 'routes/routes',
        activeName: 'routes/activeName',
      }),
      variables() {
        return variables
      },
      handleRoutes() {
        return this.routes.flatMap((route) => {
          return route.meta && route.meta.levelHidden === true && route.children
            ? route.children
            : route
        })
      },
    },
    watch: {
      $route: {
        handler(route) {
          this.activeMenu = handleActivePath(route)
        },
        immediate: true,
      },
      activeName: {
        handler(val) {
          const matched = handleMatched(this.routes, val)
          this.activeMenu = matched[matched.length - 1].path
        },
      },
    },
  }
</script>

<style lang="scss" scoped>
  .zn-header {
    display: flex;
    align-items: center;
    justify-items: flex-end;
    height: $base-top-bar-height;
    background: $base-menu-background;

    .zn-main {
      padding: 0 $base-padding 0 $base-padding;

      .right-panel {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        height: $base-top-bar-height;

        ::v-deep {
          > .el-menu--horizontal.el-menu
            > .el-submenu
            > .el-submenu__title
            > .el-submenu__icon-arrow {
            float: right;
            margin-top: #{math.div($base-top-bar-height - 11, 2)} !important;
          }

          > .el-menu--horizontal.el-menu > .el-menu-item {
            .el-tag {
              margin-top: #{math.div($base-top-bar-height, 2)} - 7.5 !important;
              margin-left: 5px;
            }

            .zn-dot {
              float: right;
              margin-top: #{math.div($base-top-bar-height - 6, 2)} + 1;
            }

            @media only screen and (max-width: 1199px) {
              .el-tag {
                display: none;
              }
            }
          }

          .el-menu {
            &.el-menu--horizontal {
              display: flex;
              align-items: center;
              justify-content: flex-end;
              height: $base-top-bar-height;
              border-bottom: 0 solid transparent !important;

              .el-menu-item,
              .el-submenu__title {
                height: #{math.div($base-top-bar-height, 1.3)};
                padding: 0 $base-padding;
                line-height: #{math.div($base-top-bar-height, 1.3)};
              }

              > .el-menu-item,
              > .el-submenu {
                height: $base-top-bar-height;
                line-height: $base-top-bar-height;

                .el-submenu__icon-arrow {
                  float: right;
                  margin-top: #{math.div($base-menu-item-height - 16, 2)};
                }

                > .el-submenu__title {
                  display: flex;
                  align-items: flex-start;
                  height: $base-top-bar-height;
                  line-height: $base-top-bar-height;
                }
              }
            }

            [class*='ri-'] {
              margin-left: 0;
              color: rgba($base-fill-1, 0.9);
              cursor: pointer;
            }

            .el-submenu,
            .el-menu-item {
              i {
                color: inherit;
              }

              &.is-active {
                border-bottom: 0 solid transparent;

                .el-submenu__title {
                  border-bottom: 0 solid transparent;
                }
              }
            }

            .el-menu-item {
              &.is-active {
                background: $base-main-tone !important;
              }
            }
          }

          .user-name {
            color: rgba($base-fill-1, 0.9);
          }

          .user-name + i {
            color: rgba($base-fill-1, 0.9);
          }

          [class*='ri-'] {
            margin-left: $base-margin;
            color: rgba($base-fill-1, 0.9);
            cursor: pointer;
          }

          button {
            svg {
              margin-right: 0;
              color: rgba($base-fill-1, 0.9);
              cursor: pointer;
              fill: rgba($base-fill-1, 0.9);
            }
          }
        }
      }
    }
  }
</style>
