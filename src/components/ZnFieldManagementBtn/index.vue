<template>
  <el-popover
    placement="bottom"
    trigger="click"
    width="256"
    popper-class="field-management-btn-popover"
    :visible-arrow="false"
  >
    <div class="field-management-header mb-8">字段管理</div>
    <el-input
      class="field-management-search mb-4"
      placeholder="搜索"
      prefix-icon="el-icon-search"
      v-model="filterText"
      clearable
      @input="getSearch"
    ></el-input>
    <el-button class="font-normal" type="text" size="medium" slot="reference">
      <zn-icon :iconName="'icon-list'" />
      <span>字段管理</span>
    </el-button>
    <div
      class="field-management-main"
      v-if="options.fields && getSearch().length > 0"
    >
      <div class="row-flex">
        <zn-draggable
          v-bind="dragOptions"
          :list="options.fields"
          @end="submitHeader()"
        >
          <div
            class="item flex-center mt-4"
            :class="item.isShow ? 'outer-layer' : 'outer-layer-discoloration'"
            v-for="(item, index) in getSearch()"
            :key="item.id + item.label + index"
          >
            <div class="item-icon flex-center-between">
              <zn-icon :iconName="'icon-drag-dot'" />
              <zn-icon :iconName="item.extra.icon" />
            </div>
            <div class="item-title overflowOne">
              {{ item.label }}
            </div>
            <div class="item-trigger flex-column">
              <zn-icon
                :iconName="'icon-eye'"
                v-if="item.isShow"
                @click="setIsShow(item)"
              />
              <zn-icon
                :iconName="'icon-eye-invisible'"
                v-else
                @click="setIsShow(item)"
              />
            </div>
          </div>
        </zn-draggable>
      </div>
    </div>
    <div class="field-management-main dataTips" v-else>
      <div>{{ dataTips }}</div>
    </div>
    <div
      class="field-management-footer"
      v-if="options.fields && getSearch().length > 0"
    >
      <el-row :gutter="10">
        <el-col :span="12">
          <el-button type="primary" size="medium" @click="hideAll">
            隐藏所有
          </el-button>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" size="medium" @click="showAll">
            显示所有
          </el-button>
        </el-col>
      </el-row>
    </div>
  </el-popover>
</template>

<script>
import ZnDraggable from 'vuedraggable'
import { saveHeader } from '@/api/index'

export default {
  name: 'ZnFieldManagementBtn',
  components: {
    ZnDraggable,
  },
  props: {
    options: {
      type: Object, // 字段管理数据
      default: () => {},
    },
    views_id: [Number, String],
    mark: {
      type: String, // mark特定标识
      default: () => '',
    },
  },
  data() {
    return {
      filterText: '',
      dataTips: '',
      checkList: [],
      form: {
        mark: this.mark,
        header: {
          fields: [],
        },
        views_id: '',
      },
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 600,
        group: 'description',
      }
    },
    // 搜索
    filterSearch() {
      if (this.filterText) {
        return this.options.fields.filter((value) =>
          value.label.includes(this.filterText)
        )
      }
    },
  },
  created() {},
  watch: {
    'options.fields': {
      handler(newVal) {
        if (this.options.fields && this.options.fields.length > 0) {
          this.checkList = []
          this.options.fields.forEach((item) => {
            if (item.isShow == true) {
              this.checkList.push(item.label)
            }
          })
        } else {
          this.checkList = []
        }
        this.notifyParent()
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {},
  methods: {
    // 处理提示
    getSearch() {
      if (!this.filterText) {
        if (!this.options.fields.length > 0) {
          this.dataTips = '暂无数据'
        }
        return this.options.fields
      } else {
        if (!this.filterSearch.length > 0) {
          this.dataTips = '暂无搜索结果'
        }
        return this.filterSearch
      }
    },
    // 单条数据处理显示与否
    setIsShow(item) {
      this.options.fields.forEach((i, t) => {
        if (i.id === item.id) {
          i.isShow = !i.isShow
        }
        this.checkList.splice(t, 0, this.options.fields[t].label)
      })
      this.submitHeader()
    },
    // 保存更改
    submitHeader() {
      this.form.views_id = this.views_id
      this.form.header.fields = this.options.fields
      saveHeader(this.form).then((res) => {})
      this.notifyParent()
    },
    // 提示父级更新
    notifyParent() {
      this.$emit('upTable', this.options.fields, this.checkList)
    },

    // 隐藏所有
    hideAll() {
      this.options.fields.forEach((item) => {
        item.isShow = false
      })
      this.submitHeader()
    },
    // 显示所有
    showAll() {
      this.options.fields.forEach((item) => {
        item.isShow = true
      })
      this.submitHeader()
    },
  },
}
</script>

<style lang="scss" scoped>
.field-management-header {
  font-weight: 600;
}
::v-deep.field-management-search {
  .el-input__inner {
    height: 28px;
    line-height: 22px;
    padding-bottom: 5px;
    padding-left: 20px;
    border: none;
    font-size: 14px;
    border-radius: 0;
    border-bottom: 1px solid $base-fill-3;
  }
  .el-input__prefix {
    margin-left: -10px;
  }
  .el-input__icon{
    transform: translateY(-1px);
    line-height: 20px;
    font-weight: bold;
  }
}
.row-flex {
  height: 300px;
  overflow-y: auto;
  padding-right: 12px;
  margin-bottom: 49px;
  .outer-layer {
    color: $base-text-5;
  }
  .outer-layer-discoloration {
    color: $base-line-4;
  }
  .outer-layer-discoloration,
  .outer-layer {
    border-radius: 4px;
    padding: 5px 8px;
    line-height: 22px;
    cursor: pointer;
  }
  .outer-layer:hover {
    background-color: $base-fill-4;
    cursor: pointer;
  }
}
.dataTips {
  min-height: 300px;
  padding: 24px;
  text-align: center;
  color: $base-line-4;
}
.field-management-main{
  margin-left: -8px;
  margin-right: -20px;
  .zn-icon{
    margin-right: 0;
  }
  .item-icon {
    width: 36px;
  }
  .item-title{
    width: calc(100% - 36px - 16px);
    padding-left: 6px;
  }
  .item-trigger{
    width: 20px;
    height: 20px;
    border-radius: 4px;
    margin: 0 -2px;
    &:hover{
      background: $base-fill-5;
    }
  }
}
.field-management-footer {
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  border-top: 1px solid $base-line-1;
  padding: 16px 24px;
  background: #fff;
  .el-button {
    border: $base-line-1;
    background: $base-line-1;
    color: $base-text-5;
    border-radius: 4px;
    &:hover{
      background: $base-fill-4;
    }
  }
}

.font-normal {
  display: inline-block;
  padding: 0 8px;
  line-height: 32px;
  color: #1d2129 !important;
}
.font-normal:hover {
  display: inline-block;
  // padding: 0 8px;
  border-radius: 2px;
  background: #f7f8fa;
  color: #1d2129 !important;
}
</style>
