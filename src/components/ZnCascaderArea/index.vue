<template>
  <el-cascader
    v-if="isShowInfo"
    :props="props"
    v-model="options"
    placeholder="请选择省市区"
    size="medium"
    @change="handleChange"
    @blur="handleBlur"
    @visible-change="visibleChange"
  ></el-cascader>
</template>
<script>
import { getRegion } from '@/api'
export default {
  name: 'cascaderArea',
  props:['selectedValue'],
  data() {
    return {
      options: [],
      isShowInfo: true,
      change: '',     //下拉框出现/隐藏 标记[【2:展开 1:隐藏 '':未做任何操作】
      props: {
        value: 'value',
        label: 'label',
        lazy: true,
        lazyLoad: (node, resolve) => {
          const { level } = node // node 节点数据
          const nodes = [] // 动态节点
          let id = level == 0 ? '0' : node.value // 0 代表第一次请求
          this.provinceFn(id)
            .then((res) => {
              res.data.map((item) => {
                let area = {
                  value: item.value,
                  label: item.label,
                  leaf: node.level >= 4, //数据层级
                }
                nodes.push(area)
              })
              resolve(nodes) // 回调
            })
            .catch((error) => {
              console.log(error)
            })
        },
      },
    }
  },
  watch: {
    selectedValue: {
      immediate: true,
      handler(val){
        this.options = val;
      }
    }
  },
  methods: {
    // 操控回显
    setArea(arr) {
      this.options = []
      this.isShowInfo = false
      if (arr) {
        this.options = [...arr]
      }
      this.$nextTick(() => {
        this.isShowInfo = true
      })
    },
    provinceFn(id) {
      // 获取省市区街道
      return getRegion({ parent_code: id })//请求接口数据
    },
    handleChange(value) {
      // 选择的数据
      this.$emit('getSelectedOptions', value)
    },
    handleBlur(){
      // 失焦触发【判断是否应该要失焦 value: true失焦】
      let value = false;
      if(this.change === ''){
        value = true
      }
      this.$emit('handleBlur', value)
    },
    visibleChange(val){
      this.change = val ? 2 : 1
    }
  },
}
</script>
<style lang="scss" scoped>
</style>
