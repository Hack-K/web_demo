<template>
  <div class="add-phone">
    <div class="add-title mb-16">咨询电话</div>
    <div class="add-items pt-4" v-if="items.length > 0">
      <div class="add-item mb-16" v-for="(item, index) in items" :key="index">
        <el-input
          type="text"
          v-model="item.value"
          placeholder="请填写电话号码"
          maxlength="11"
        ></el-input>
        <el-button
          class="del-button"
          icon="el-icon-delete"
          @click="delPhone(index)"
        ></el-button>
      </div>
    </div>
    <el-button class="add-button" size="medium" icon="el-icon-plus" @click="addPhone"
      >添加咨询电话</el-button
    >
  </div>
</template>

<script>
export default {
  name: "AddPhone",
  props:{
    phoneList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      items: [],
    };
  },
  methods: {
    // 删除电话
    delPhone(index) {
      this.items.splice(index, 1);
    },
    // 添加电话
    addPhone() {
      this.items.push({
        value: "",
      });
    },
    // 更新数据
    updatePhone(){
      this.$emit("updatePhone", this.items)
    }
  },
  watch: {
    phoneList: {
      immediate: true,
      handler(newVal, oldVal){
        if(newVal && newVal.length > 0){
          this.items = newVal
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.add-title {
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
}
.add-item {
  position: relative;
}
.del-button {
  position: absolute;
  top: 50%;
  right: -27px;
  border: none;
  padding: 10px 5px;
  color: $base-Error-6;
  transform: translateY(-50%);
  &:hover,
  &:focus {
    color: $base-Error-6;
    background-color: transparent;
  }
}
.add-button {
  width: 100%;
  color: $base-Brand1-6;
  border-radius: 4px;
  border: 1px solid #e5e6eb;
}
</style>
