<template>
  <transition mode="out-in" name="fade-transform">
    <keep-alive :include="keepAliveNameList" :max="keepAliveMaxNum">
      <router-view :key="routerKey" />
    </keep-alive>
  </transition>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { keepAliveMaxNum } from '@/config'
  import ZnProgress from 'nprogress'
  import { handleActivePath } from '@/utils/routes'

  export default {
    name: 'ZnRouterView',
    data() {
      return {
        routerKey: null,
        keepAliveMaxNum,
        keepAliveNameList: [],
        dynamicNewTab: false,
      }
    },
    computed: {
      ...mapGetters({
        theme: 'settings/theme',
        visitedRoutes: 'tabs/visitedRoutes',
      }),
    },
    watch: {
      $route: {
        handler() {
          this.routerKey = handleActivePath(this.$route, true)
        },
        immediate: true,
      },
      visitedRoutes: {
        handler() {
          this.updateKeepAliveNameList()
        },
      },
    },
    created() {
      this.updateKeepAliveNameList()
      this.$baseEventBus.$on(
        'reload-router-view',
        (refreshRouteName = this.$route.name) => {
          if (this.theme.showProgressBar) ZnProgress.start()
          const cacheActivePath = this.routerKey
          this.routerKey = null
          this.updateKeepAliveNameList(refreshRouteName)
          this.$nextTick(() => {
            this.routerKey = cacheActivePath
            this.updateKeepAliveNameList()
          })
          setTimeout(() => {
            if (this.theme.showProgressBar) ZnProgress.done()
          }, 200)
        }
      )
    },
    methods: {
      updateKeepAliveNameList(refreshRouteName = null) {
        this.keepAliveNameList = this.visitedRoutes
          .filter(
            (item) => !item.meta.noKeepAlive && item.name !== refreshRouteName
          )
          .map((item) => item.name)
      },
    },
  }
</script>
