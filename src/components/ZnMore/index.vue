<template>
  <el-popover
    placement="bottom"
    trigger="click"
    popper-class="select-popover"
    :visible-arrow="false"
  >
    <slot />
    <el-button
      slot="reference"
      type="primary"
      size="medium"
      plain
      :disabled="disabled"
    >
      <zn-icon :iconName="'icon-more'" />
      更多
    </el-button>
  </el-popover>
</template>

<script>
export default {
  name: 'index',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  components: {},
  data() {
    return {
      moreList: [],
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style lang="scss" scoped>
</style>
