<template>
  <el-popover
    :placement="placement"
    :width="width"
    :visible-arrow="visible_arrow"
    v-model="visible"
    popper-class="popper-custom-select"
    class="custom-select"
  >
    <!-- 如果用户修改选择 -->
    <el-select
      popper-class="el-option-default"
      :popper-append-to-body="false"
      :value="
        selectValue
          ? selectValue
          : defaultSelectValue[defaultSelectObject['key']]
      "
      :placeholder="placeholder"
      slot="reference"
    >
      <el-option
        v-for="item in []"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <el-input
      class="popper-custom-input"
      v-model="search"
      @input="changeSeachInput"
      placeholder="查找或创建选项"
    ></el-input>
    <div class="create-list">
      <div
        @click.stop="selectItemOption(item)"
        class="create-item"
        v-for="(item, index) in options"
        :key="index"
      >
        {{ item.label }}
        <i class="el-icon-delete" @click.stop="del(item)"></i>
      </div>
    </div>
    <!-- 搜索 -->
    <div class="single" v-if="search && allowCreate">
      <div class="single-create" @click.stop="createOptionItem(search)">
        创建选项
        <span class="single-create-span">
          {{ search }}
        </span>
      </div>
    </div>
  </el-popover>
</template>
<script>
export default {
  name: 'SelectOptionCreate',
  props: {
    //pop宽度
    width: {
      type: Number,
      default: 400,
    },
    //pop方向
    placement: {
      type: String,
      default: 'bottom-start',
    },
    //是否显示箭头
    visible_arrow: {
      type: Boolean,
      vlaue: false,
    },
    //搜索框提示
    placeholder: {
      type: String,
      default: '请选择',
    },
    //列表数据
    options: {
      type: Array,
      default: () => {
        return []
      },
    },
    //是否允许创建
    allowCreate: {
      type: Boolean,
      default: true,
    },
    //指定选中列表中的key为展示项
    defaultSelectObject: {
      type: Object,
      default: () => {
        return {
          key: 'label',
          value: 'value',
        }
      },
    },
    defaultSelectValue: {
      default: () => {
        return {
          key: '',
          value: '',
        }
      },
    },
  },
  data() {
    return {
      showPop: false,
      visible: false,
      d: '',
      search: '',
      selectValue: '',
    }
  },
  methods: {
    del(e) {
      this.$emit('delOptionsChange', e)
    },
    changeSeachInput(e) {
      this.$emit('searchOptionsChange', e)
    },
    createOptionItem(e) {
      this.$emit('createOptionsChange', e)
    },
    selectItemOption(e) {
      let { key } = this.defaultSelectObject
      this.selectValue = e[key]
      this.visible = false
      this.$emit('selectOptionsClick', e)
    },
    clearSearch(is_close = true) {
      this.search = ''
      this.visible = true
    },
  },
}
</script>

<style lang="scss">
.custom-select .el-select-dropdown {
  opacity: 0 !important;
}
.custom-select .el-form-item__content {
  margin-left: 0 !important;
}
.popper-custom-select {
  padding: 0 0 4px 0 !important;
  .popper-custom-input .el-input__inner {
    border: 0;
    border-radius: 0;
    border-bottom: 1px solid #e5e6eb;
    color: #1d2129;
  }
}
.create-list {
  padding: 0 4px;
  margin-top: 4px;
  box-sizing: border-box;
  .create-item {
    height: 32px;
    line-height: 32px;
    border-radius: 4px;
    padding-left: 9px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 8px;
  }
  .el-icon-delete {
    border-radius: 4px;
    width: 22px;
    line-height: 22px;
    height: 22px;
    display: none;
  }
  .create-item:hover {
    background: #f2f3f5;
  }
  .create-item:hover .el-icon-delete {
    background: #e5e6eb;
    display: inline-block;
    text-align: center;
  }
}
.single {
  width: 100%;
  border-top: 1px solid #e5e6eb;
  cursor: pointer;
  padding: 0 4px;
  .single-create {
    margin-top: 8px;
    height: 32px;
    line-height: 32px;
    width: 100%;
    background: #f2f3f5;
    font-size: 14px;
    color: #86909c;
    padding-left: 9px;
    border-radius: 4px;
  }
  &-span {
    color: red;
  }
}
</style>