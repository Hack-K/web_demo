<template>
  <component
    :is="menuComponent"
    v-if="item.meta && !item.meta.hidden"
    :item-or-menu="item"
  >
    <template v-if="item.children && item.children.length">
      <el-scrollbar
        v-if="
          (layout === 'horizontal' && item.children.length > 18) ||
          (layout !== 'horizontal' && collapse && item.children.length > 18)
        "
        class="zn-menu-children-height"
      >
        <zn-menu
          v-for="route in item.children"
          :key="route.path"
          :item="route"
        />
      </el-scrollbar>
      <template v-else>
        <zn-menu
          v-for="route in item.children"
          :key="route.path"
          :item="route"
        />
      </template>
    </template>
  </component>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'ZnMenu',
    props: {
      item: {
        type: Object,
        required: true,
      },
      layout: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        menuComponent: 'ZnMenuItem',
      }
    },
    computed: {
      ...mapGetters({
        collapse: 'settings/collapse',
      }),
    },
    created() {
      if (
        this.item.children &&
        this.item.children.some((route) => {
        
    
          return route.meta && route.meta.hidden !== true
        })
      )
        this.menuComponent = 'ZnSubmenu'
    },
  }
</script>

<style lang="scss" scoped>
  .zn-menu-children-height {
    height: 60vh !important;
  }
</style>
