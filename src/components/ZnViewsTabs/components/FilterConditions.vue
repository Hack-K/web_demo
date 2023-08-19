<template>
    <div class="screen-management-content" @click="screenClick">
      <div class="screen-management-header mb-8">设置筛选条件</div>
      <div class="screen-management-tip">添加筛选条件，限制出现在此视图中的数据</div>
      <section class="screen-management-main mt-20" v-if="form.filters.length > 0">
        <el-row :gutter="8" v-for="(item, index) in form.filters" :key="index">
          <el-col
            :span="4"
            v-if="index == 0"
            :class="index != 1 ? 'no-select-icon' : ''"
          >
            <el-select v-model="form.filters[index].where" :disabled="index != 1">
              <el-option
                v-for="item in conditionList1"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="4" v-else :class="index != 1 ? 'no-select-icon' : ''">
            <el-select
              v-model="form.filters[1].where"
              :disabled="index != 1"
              @change="submitFilters"
            >
              <el-option
                v-for="item in conditionList2"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="5">
            <el-select
              v-model="form.filters[index].field"
              placeholder="请选择"
              @change="handleField(index)"
            >
              <el-option
                v-for="item in optionsFilter"
                :key="item.name"
                :label="item.label"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select
              v-model="form.filters[index].exp"
              placeholder="请选择"
              @change="handlerValueType(index)"
            >
              <el-option
                v-for="item in getJudgeList(index)"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <!--*  文本：text
              *  单选：radio
              *  单选: radioSelect
              *  带搜索单选: personnel
              *  多选：select
              *  日期：date
              *  人员：personnel
              *  附件：attachment
              *  数字：number
              *  复选框：checkBox
              -->
          <el-col
            :span="10"
            v-if="['null', 'notNull'].includes(form.filters[index].exp)"
          >
            <el-col :span="24"></el-col>
          </el-col>
          <el-col
            :span="10"
            v-else
            :class="
              form.filters[index].type == 'checkBox' ? '' : 'col-special-style'
            "
          >
            <!-- 文本：text -->
            <el-col :span="24" v-if="form.filters[index].type == 'text'">
              <el-input
                v-model="form.filters[index].options.valueStr"
                placeholder="请输入"
                @input="submitFilters"
              />
            </el-col>
            <!-- 单选：radio -->
            <el-col :span="24" v-if="form.filters[index].type == 'radio'">
              <el-radio-group
                v-model="form.filters[index].options.valueStr"
                @change="submitFilters"
                class="col-radio"
              >
                <el-radio
                  v-for="(item, index) in getData(index).param"
                  :key="index"
                  :label="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-col>
            <!-- 单选：select -->
            <el-col :span="24" v-if="form.filters[index].type == 'radioSelect'">
              <el-select
                v-model="form.filters[index].options.valueStr"
                collapse-tags
                placeholder="请选择"
                @change="submitFilters"
              >
                <el-option
                  v-for="item in getData(index).param"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-col>
            <!-- 带搜索的单选: personnel -->
            <el-col :span="24" v-if="form.filters[index].type == 'personnel'">
              <el-popover
                :ref="'searchPopover' + index"
                popper-class="search-popover"
                placement="bottom-start"
                width="300"
                :visible-arrow="false"
                @show="searchPopoverShow(index)"
              >
                <div class="serach-input">
                  <el-input 
                    :ref="'searchPopoverInput' + index"
                    v-model="commonText[form.filters[index].field]" 
                    placeholder="搜索关键词" 
                    @input="searchHandler(form.filters[index].source, form.filters[index].field, commonText[form.filters[index].field])"
                  ></el-input>
                </div>
                <div class="search-content">
                  <ul class="search-ul mt-8" v-if="commonOption[form.filters[index].field] && commonOption[form.filters[index].field].length > 0">
                    <!--  -->
                    <li
                      class="search-item pos-relative" 
                      :class="item.id === form.filters[index].options.valueStr ? 'search-item-active' : ''"
                      v-for="(item, tindex) in commonOption[form.filters[index].field]" 
                      :key="tindex" 
                      @click="itemSubmit(item, index)" >
                      <div class="search-name flex-center mb-4">
                        <span class="mr-8">{{ item.nickname }}</span>
                        <span class="position">{{ item.job }}</span>
                      </div>
                      <div class="search-phone">{{ item.mobile || '--' }}</div>
                      <div class="searcj-icon pos-absolute">
                        <zn-icon :iconName="'icon-success'" />
                      </div>
                    </li>
                  </ul>
                  <div class="search-empty" v-else>
                    没有找到搜索结果
                  </div>
                </div>
                <el-select
                  slot="reference"
                  v-model="form.filters[index].options.valueStr "
                  placeholder="请输入关键词"
                  value-key="id"
                  popper-class="search-select"
                >
                  <el-option
                    v-for="item in commonOption[form.filters[index].field]"
                    :key="item.id"
                    :label="item.nickname"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-popover>
            </el-col>
            <!-- 多选：select -->
            <el-col :span="24" v-if="form.filters[index].type == 'select'">
              <el-select
                v-model="form.filters[index].options.valueArray"
                multiple
                collapse-tags
                placeholder="请选择"
                @change="submitFilters"
              >
                <el-option
                  v-for="item in getData(index).param"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-col>
            <!-- 日期：date -->
            <el-col
              :span="24"
              v-if="form.filters[index].type == 'date'"
              class="col-special-style"
            >
              <el-col :span="11">
                <el-select
                  v-model="form.filters[index].options.valueType"
                  @change="submitFilters"
                >
                  <el-option
                    v-for="item in getData(index).param"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col
                :span="13"
                v-if="form.filters[index].options.valueType == '-1'"
              >
                <el-date-picker
                  v-model="form.filters[index].options.valueStr"
                  type="date"
                  prefix-icon=""
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  @change="submitFilters"
                ></el-date-picker>
                <!-- :picker-options="pickerOptions" -->
              </el-col>
              <el-col :span="13" v-else></el-col>
            </el-col>
            <!-- 附件：attachment -->
            <el-col :span="24" v-if="form.filters[index].type == 'attachment'">
              <el-input
                v-model="form.filters[index].options.valueStr"
                placeholder="请输入"
                @input="submitFilters"
              />
            </el-col>
            <!-- 数字：number -->
            <el-col :span="24" v-if="form.filters[index].type == 'number'">
              <el-input
                v-model="form.filters[index].options.valueStr"
                placeholder="请输入"
                @input="submitFilters"
              />
            </el-col>
            <!-- 复选框：checkBox -->
            <el-col
              :span="24"
              v-if="form.filters[index].type == 'checkBox'"
              class="col-checkbox"
            >
            </el-col>
          </el-col>
          <el-col :span="1" class="icon-close">
            <zn-icon :iconName="'icon-close'" @click="delCurrentRow(index)" />
          </el-col>
        </el-row>
      </section>
      <div class="add mt-16">
        <el-button
          class="screen-button"
          type="text"
          size="medium"
          @click="addCurrentRow"
        >
          <zn-icon :iconName="'icon-add'" />
          添加条件
        </el-button>
      </div>
    </div>
</template>

<script>
import { filterRules, saveFilters, optionsList } from '@/api/index'
export default {
  name: 'FilterConditions',
  components: {},
  props: {
    options: {
      type: Object, // 字段管理数据
      default: () => {},
    },
    views_id: {
      type: Number, // 视图ID
      default: () => "",
    },
    mark: {
      type: String, // mark特定标识
      default: () => "",
    },
  },
  data() {
    return {
      memberActive: '',
      checkList: ['选中且禁用', '复选框 A'],
      judgeList: [],
      conditionList1: [{ value: 'when', label: '当' }],
      conditionList2: [
        { value: 'and', label: '并且' },
        { value: 'or', label: '或者' },
      ],
      form: {
        mark: this.mark, //页面标识
        views_id: '', //视图ID
        filters: [],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
      },
      commonOption: {},   // 筛选 personnel 类型下拉选项数据 {key: value}
      commonText: {},   // 筛选 personnel 类型keywords集合 {key: value}
      optionsList: [],
    }
  },
  computed: {
    optionsFilter(){
      if(this.options && this.options.fields){
        return this.options.fields.filter(item => item.isFilter)
      }
    }
  },
  created() {
    // 回显刷选 personnel 类型
    setTimeout(() => {
      this.initEchoData()
    },500)
    this.getFilterRules()
  },
  mounted() {},
  methods: {
    /** 筛选 personnel 类型
     * @description 初始加载回显
     */
     initEchoData(){
      this.form.filters.forEach((item,index) => {
        if(item.type === 'personnel'){
          let optionsArr = this.optionsFilter.filter(option => item.field === option.name)
          this.form.filters[index].source = optionsArr.length > 0 ? optionsArr[0].param.type : ''
          this.initCommonText(item.field, '')
          this.searchHandler(this.form.filters[index].source, item.field, this.commonText[item.field], this.form.filters[index].options.valueStr)
        }
      })
    },
    /** 筛选 personnel 类型
     * @description 格式化 initCommonText 数据 {key: value}
     * @param {*} key initCommonText对象key值
     * @param {*} value initCommonText对象value值
     */
    initCommonText(key, value){
      this.$set( this.commonText, key, value)
    },
    /** 筛选 personnel 类型
     * @description 格式化 initCommonOption 数据 {key: value}
     * @param {*} key initCommonOption对象key值
     * @param {*} value initCommonOption对象value值
     */
    initCommonOption(key, value){
      this.$set( this.commonOption, key, value)
    },
    /** 筛选 personnel 类型
     * @description 搜索数据
     * @param {*} type 数据源标识
     * @param {*} key commonOption选项key
     * @param {*} keywords 当前选项关键词
     * @param {*} id 可选项[回显时当前ID不在选项时传入]
     */
    searchHandler(type, key, keywords, id){
      optionsList({
        type,
        id,
        keywords: keywords,
      }).then((res) => {
        this.initCommonOption(key, res.data)
      });
    },
    /** 筛选 personnel 类型
     * @description popover框展开事件
     * @param {*} index 当前项索引
     */
    searchPopoverShow(index){
      this.$nextTick(() => {
        this.$refs[`searchPopoverInput${index}`][0].focus()
      })
    },
    /** 筛选 personnel 类型
     * @description 选择搜索项事件
     * @param {*} item 当前项对象数据
     * @param {*} index 当前项索引
     */
    itemSubmit(item,index){
      this.form.filters[index].options.valueStr = item.id
      this.$refs[`searchPopover${index}`][0].doClose()
      this.submitFilters()
    },
    // 全局点击关闭  personnel 弹框
    screenClick(){
      for(let key in this.$refs){
        if(/^searchPopover\d+/.test(key)){
          if(this.$refs[key] && this.$refs[key].length > 0){
            this.$refs[key][0].doClose()
          }
        }
      }
    },
    // 获取全局定义筛选规则
    getFilterRules() {
      filterRules().then((res) => {
        this.judgeList = res.data
      })
    },
    // 关闭 popover 弹框
    closePopover() {
      this.$refs['conditionPopover'].doClose()
    },
    // 添加一行筛选条件
    addCurrentRow() {
      let defaultField = this.optionsFilter[0].name
      this.form.filters.push({
        where: '', //when:当，and:并且，or:或者
        exp: this.judgeList[this.getDefaultType()][0].value, //表达式 筛选规则对应当value
        field: defaultField, //字段名 表头对应当name
        type: this.getDefaultType(),
        options: {
          valueStr: '', //值为字符串
          valueArray: '', //值为数组
          valueType: '', //对应value的类型 例：日期的今日、昨日等
        },
        source:
          this.optionsFilter[0].type === 'personnel'
            ? this.optionsFilter[0].param.type
            : '',
      })
      // 带搜索的下拉框数据
      if(this.optionsFilter[0].type === 'personnel'){
        this.initCommonText(defaultField, '')
        this.this.initCommonOption(defaultField, this.commonOption[defaultField] ? this.commonOption[defaultField] : [])
      }
      
      if (this.form.filters.length == 1) {
        this.form.filters[0].where = this.conditionList1[0].value
      } else if (this.form.filters.length == 2) {
        this.form.filters[1].where = this.conditionList2[0].value
      } else {
        this.form.filters[2].where = this.form.filters[1].where
      }
      this.submitFilters()
    },
    // 删除当前行筛选条件
    delCurrentRow(index) {
      this.form.filters.splice(index, 1)
      if (this.form.filters.length > 0) {
        this.form.filters[0].where = this.conditionList1[0].value
      }
      if (this.form.filters.length > 1) {
        this.form.filters[1].where = this.conditionList2[0].value
      }
      this.submitFilters()
    },
    getJudgeList(index) {
      return this.judgeList[this.form.filters[index].type]
    },
    getDefaultType() {
      let obj = this.optionsFilter.find((item) => {
        return item.name == this.optionsFilter[0].name
      })
      return obj.type
    },
    // 联动数据返回
    getData(index) {
      let obj = {}
      if (this.form.filters[index].field && this.optionsFilter) {
        //父传子 第一次是options=[]
        obj = this.optionsFilter.find((item) => {
          return item.name == this.form.filters[index].field
        })
      } else {
        obj.type = 'text'
      }
      return obj
    },
    // 操作第二列-字段
    handleField(index) {
      this.form.filters[index].options.valueStr = ''
      this.form.filters[index].options.valueType = ''
      this.form.filters[index].options.valueArray = ''
      this.form.filters[index].type = this.getData(index).type
      this.form.filters[index].source = this.getData(index).param.type
      this.form.filters[index].exp = this.getJudgeList(index)[0].value
      // 搜索类型 personnel 数据选项加载
      if(this.form.filters[index].type === 'personnel'){
        this.initCommonText(this.form.filters[index].field, '')
        this.searchHandler(this.form.filters[index].source, this.form.filters[index].field, this.commonText[this.form.filters[index].field])
      }
      
      // 设置默认值
      if (
        ['date', 'select', 'checkBox', 'radio', 'radioSelect', 'personnel'].includes(
          this.form.filters[index].type
        )
      ) {
        // 目前只针对日期类型的(以后再有扩展的,用includes去匹配)
        if (['date'].includes(this.form.filters[index].type)) {
          this.form.filters[index].options.valueType =
            this.getData(index).param[0].value
        } else {
          this.form.filters[index].options.valueType = ''
        }
      }
      this.submitFilters()
    },
    // 操作第三列-条件
    handlerValueType(index) {
      this.form.filters[index].options.valueStr = ''
      this.form.filters[index].options.valueType = ''
      this.form.filters[index].options.valueArray = ''
      if (
        ['date'].includes(this.form.filters[index].type) &&
        !['Null', 'NotNull'].includes(this.form.filters[index].exp)
      ) {
        this.form.filters[index].options.valueType =
          this.getData(index).param[0].value
      }
      this.submitFilters()
    },
    // 保存筛选条件
    submitFilters() {
      // this.getFilterFormData()
      this.form.views_id = this.views_id
      saveFilters(this.form).then((res) => {
        if (res.code == 200) {
          if (this.getFilterFormData()) {
            this.$emit('upTable',this.form.filters) //更新父级列表数据
          }
        }
      })
    },
    // 去除过滤后的数据
    getFilterFormData() {
      let { filters } = this.form
      if (filters.length === 0) return true
      let data_filter = []
      filters.forEach((item) => {
        if (item['exp'] === 'notNull' || item['exp'] === 'null') {
          data_filter.push(item)
        }
        let { options, type } = item
        if (options.valueStr.length && type === 'text') {
          data_filter.push(item)
        }

        if (options.valueArray.length && type === 'select') {
          data_filter.push(item)
        }

        if (options.valueArray.length >= 1 && type === 'radio') {
          data_filter.push(item)
        }

        if (options.valueStr.toString().length >= 1 && type === 'radio') {
          data_filter.push(item)
        }

        if (options.valueStr.toString().length >= 1 && type === 'radioSelect') {
          data_filter.push(item)
        }

        if (options.valueType && type === 'date') {
          data_filter.push(item)
        }

        if (options.valueStr && type === 'number') {
          data_filter.push(item)
        }
        if (options.valueStr >= 1 && type === 'personnel') {
          data_filter.push(item)
        }
      })
      if (data_filter.length === 0) {
        return false
      }
      return true
    },
  },
}
</script>

<style lang="scss" scoped>
$size-40: 40px;
@mixin size {
  height: $size-40 !important;
  line-height: $size-40 !important;
}
.screen-management-header {
  font-weight: 600;
  line-height: 22px;
}
.screen-management-tip{
  color: $base-text-3;
  line-height: 22px;
}
// 还原UI设计尺寸
.screen-management-main {
  .el-row {
    margin-top: 8px!important;
  }
  .el-row:first-child{
    margin-top: 0!important;
  }
  .col-special-style {
    padding: 0 !important;
    border: none;
  }
  .col-radio {
    .el-radio {
      margin-right: 10px;
    }
  }
  .col-checkbox,
  .col-radio {
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
  }
  ::-webkit-scrollbar {
    width: 4px !important;
    height: 4px !important;
  }
  .icon-close{
    color: $base-line-4;
  }
}

::v-deep.el-col {
  @include size;
  border: 1px solid transparent; //el-col没有内容时占位
  .el-select {
    width: 100%;
  }
  .el-input {
    .el-input__inner {
      @include size;
    }
  }
  .el-date-editor {
    width: 100%;
    .el-input__inner {
      padding-left: 15px;
    }
    .el-input__prefix {
      display: none;
    }
  }
  .el-radio-group {
    @include size;
    .el-radio {
      @include size;
    }
  }
}
::v-deep.no-select-icon {
  .el-select {
    .el-input {
      .el-input__suffix {
        display: none;
      }
    }
    .is-disabled {
      .el-input__inner {
        cursor: auto;
        background: $base-fill-1;
        color: $base-text-5;
      }
    }
  }
}
.screen-button{
  margin: 0!important;
  color: $base-text-4;
  padding: 2px 0px;
  .zn-icon{
    margin-right: 0;
  }
}
</style>
