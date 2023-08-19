<template>
  <footer class="zn-footer">
    Copyright
    <zn-icon :iconName="'copyright-line'" />
    {{ fullYear }} {{ title }}
  </footer>
</template>

<script>
  import { title } from '@/config'

  export default {
    name: 'ZnFooter',
    data() {
      return {
        fullYear: new Date().getFullYear(),
        title,
      }
    },
  }
</script>

<style lang="scss" scoped>
  .zn-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 55px;
    padding: 0 $base-padding 0 $base-padding;
    color: rgba(0, 0, 0, 0.45);
    // background: $base-fill-1;
    background: $base-color-public;
    border-top: 1px dashed $base-border-color;

    i {
      margin: 0 5px;
    }
  }
</style>
