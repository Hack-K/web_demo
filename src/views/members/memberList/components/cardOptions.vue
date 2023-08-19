<template>
  <el-row class="pl-8 pr-8" :gutter="16">
    <el-col :span="layoutSpan" v-for="(item, index) in optionsData" :key="index">
      <div
        class="options-item flex-center"
        :class="{ active: optionActive === item.value }"
        @click="optionClick(item)"
      >
        <div class="options-item-icon flex-column">
          <img :src="item.icon" />
        </div>
        <div class="options-item-text">
          <div class="options-item-title">{{ item.label }}</div>
          <div class="options-item-price">{{ item.price }}</div>
        </div>
        <div class="options-item-select flex-column">
          <zn-icon :iconName="'icon-gou'" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "CardOptions",
  props: {
    /* 布局span份数 */
    layoutSpan: {
      type: Number,
      default: () => 6,
    },
    /* 选项列表 */
    optionsData: {
      type: Array,
      default: () => [],
    },
    /* 选中数据值 */
    optionActive: {
      type: [String, Number],
      default: () => "",
    },
  },
  data() {
    return {};
  },
  methods: {
    // 选择类型
    optionClick(item) {
      this.$emit("optionChange", item);
    },
  },
};
</script>

<style lang="scss" scoped>
.options-item {
  height: 74px;
  line-height: 22px;
  padding: 16px;
  border-radius: 8px;
  background: #ffffff;
  border: 1px solid #e5e6eb;
  cursor: pointer;
  &-icon {
    width: 44px;
    height: 44px;
  }
  &-text {
    flex: 1;
    padding-left: 8px;
  }
  &-title {
    font-size: 14px;
    font-weight: 500;
  }
  &-price{
    color: $base-text-3;
    font-size: 12px;
    line-height: 20px;
  }
  &-select {
    width: 18px;
    height: 18px;
    border-radius: 100%;
    border: 2px solid #e5e6eb;
  }
  .zn-icon {
    display: none;
  }
  &.active {
    border: 2px solid $base-Brand1-6;
    .options-item-select {
      color: #fff;
      border: none;
      background: $base-Brand1-6;
      .zn-icon {
        display: block;
        margin-right: 0;
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
