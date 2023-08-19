<template>
  <zn-icon
    v-if="theme.showRefresh"
    :iconName="'refresh-line'"
    @click="refreshRoute"
  />
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'ZnRefresh',
    computed: {
      ...mapGetters({
        theme: 'settings/theme',
        extra: 'settings/extra',
        visitedRoutes: 'tabs/visitedRoutes',
      }),
    },
    methods: {
      async refreshRoute() {
        this.$baseEventBus.$emit('reload-router-view')
      },
    },
  }
</script>
