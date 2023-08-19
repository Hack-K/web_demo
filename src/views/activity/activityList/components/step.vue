<template>
  <div class="step flex">
    <div
      class="step-item flex-center"
      :class="{ active: item.value <= activeStep }"
      v-for="(item, index) in stepList"
      :key="index"
    >
      <div class="step-icon"></div>
      <div class="step-name">{{ item.label }}</div>
      <div class="step-line" v-if="index < 1"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Step",
  props: {
    activeStep: {
      type: Number,
      default: () => 1,
    },
  },
  data() {
    return {
      stepList: [
        {
          label: "活动信息",
          value: 1,
        },
        {
          label: "活动详情",
          value: 2,
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.step {
  padding: 24px;
  border-radius: 8px;
  background: $base-fill-2;
  border: 1px solid $base-line-2;
  &-icon {
    width: 24px;
    height: 24px;
    border-radius: 100%;
    border: 6px solid rgba(0, 91, 217, 0.1);
  }
  &-name {
    padding-left: 8px;
    color: $base-text-4;
    line-height: 22px;
    font-weight: 500;
  }
  &-line {
    width: 419px;
    height: 2px;
    background: $base-Brand1-6;
    margin: 0 12px;
  }
  .active {
    .step-icon {
      border-color: $base-Brand1-6;
    }
    .step-name {
      color: $base-Brand1-6;
    }
  }
}
</style>
