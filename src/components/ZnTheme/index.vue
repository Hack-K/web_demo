<template>
  <span v-if="theme.showTheme">
    <zn-icon :iconName="'brush-2-line'" @click="handleOpenTheme" />
  </span>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'ZnTheme',
    computed: {
      ...mapGetters({
        theme: 'settings/theme',
      }),
    },
    methods: {
      handleOpenTheme() {
        this.$baseEventBus.$emit('theme')
      },
    },
  }
</script>
