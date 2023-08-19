<template>
  <zn-icon
    class="fold-unfold"
    :iconName="collapse ? 'user-icon-zhankai' : 'fold-unfold'"
    :style="classObject"
    @click="toggleCollapse"
  />
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: 'ZnFold',
    data() {
      return {}
    },
    computed: {
      ...mapGetters({
        theme: 'settings/theme',
        collapse: 'settings/collapse',
      }),
      classObject() {
        return {
          display:
            ['column'].indexOf(this.theme.layout) + 1 &&
            this.$route.meta.noColumn
              ? 'none'
              : '',
        }
      },
    },
    watch: {
      classObject: {
        handler({ display }) {
          if (display === 'none') this.foldSideBar()
          else this.openSideBar()
        },
        immediate: true,
      },
    },
    methods: {
      ...mapActions({
        openSideBar: 'settings/openSideBar',
        foldSideBar: 'settings/foldSideBar',
        toggleCollapse: 'settings/toggleCollapse',
      }),
    },
  }
</script>

<style lang="scss" scoped>
  .fold-unfold {
    color: $base-text-5;
    cursor: pointer;
  }
</style>
