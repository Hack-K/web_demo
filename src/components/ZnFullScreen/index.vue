<template>
  <zn-icon
    class="fullscreen"
    v-if="theme.showFullScreen"
    :iconName="isFullscreen ? 'fullscreen-put-away' : 'fullscreen-exit-fill'"
    @click="click"
  />
</template>

<script>
import {mapGetters} from 'vuex'
import screenfull from 'screenfull'

export default {
  name: 'ZnFullScreen',
  data() {
    return {
      isFullscreen: false,
    }
  },
  computed: {
    ...mapGetters({
      theme: 'settings/theme',
    }),
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.destroy()
  },
  methods: {
    click() {
      if (!screenfull.isEnabled) {
        this.$baseMessage('开启全屏失败', 'error', 'zn-hey-message-error')
      }
      screenfull.toggle()
      this.$emit('refresh')
    },
    change() {
      this.isFullscreen = screenfull.isFullscreen
    },
    init() {
      if (screenfull.isEnabled) screenfull.on('change', this.change)
    },
    destroy() {
      if (screenfull.isEnabled) screenfull.off('change', this.change)
    },
  },
}
</script>
<style lang="scss" scoped>
.fullscreen {
  color: $base-fill-1;
}
</style>
