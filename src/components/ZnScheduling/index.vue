<template>
  <div class="zn-scheduling">
    <div class="item flex-center mb-16">
      <div class="item-left">
        <el-row :gutter="10">
          <el-col :span="6" class="head-title">护理分类</el-col>
          <el-col :span="6" class="head-title">护理项目</el-col>
          <el-col :span="4" class="head-title">标准时长</el-col>
          <el-col :span="4" class="head-title">服务频率</el-col>
          <el-col :span="4" class="head-title">服务时长</el-col>
        </el-row>
      </div>
    </div>
    <div
      class="item flex-center mb-16"
      v-for="(item, index) in form"
      :key="item.id"
    >
      <div class="item-left">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-select
              v-model="item.category"
              placeholder="请选择护理分类"
              size="medium"
              @change="categoryChange(index, item)"
            >
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.pname"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select
              v-model="item.project"
              placeholder="请选择护理分类"
              size="medium"
              @change="projectChange(index,item)"
            >
              <el-option
                v-for="option in item.projectOptions"
                :key="option.id"
                :label="option.pname"
                :value="option.id"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-input
              placeholder="请输入内容"
              size="medium"
              disabled
              v-model="item.time"
            >
              <template slot="suffix">分钟</template>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-input
              placeholder="请输入内容"
              size="medium"
              maxlength="2"
              v-model="item.count"
              oninput="value=value.replace(/[^0-9]/g,'')"
              @input="inputChange(index)"
            >
              <template slot="suffix">次/周</template>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-input
              placeholder="请输入内容"
              size="medium"
              disabled
              v-model="item.service_time"
            >
              <template slot="suffix">分钟</template>
            </el-input>
          </el-col>
        </el-row>
      </div>
      <div class="item-right pl-16 flex-center-between">
        <el-button icon="el-icon-plus" circle @click="addProject(index)"></el-button>
        <el-button
          icon="el-icon-minus"
          circle
          @click="reduceProject(index)"
          :disabled="form.length === 1"
        ></el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { getCateList, getProjectList } from '@/api/system/standard'
  export default {
    name: 'ZnScheduling',
    data() {
      return {
        options: [], // 护理分类
        form: [
          {
            id: Math.random(),
            category: '',
            projectOptions: [],
            projectActive: null,
            project: '',
            time: '0',
            count: '0',
            service_time: "0",
          },
        ],
      }
    },
    created() {
      getCateList().then((res) => {
        this.options = res.data
      })
    },
    methods: {
      // 选择分类
      categoryChange(index, item) {
        getProjectList({
            pid: item.category
        }).then(res => {
            this.form[index].projectOptions = res.data.data
        })
      },
      // 选择项目
      projectChange(index, item){
        let result = this.form[index].projectOptions.filter(option => option.id === item.project)
        this.form[index].projectActive = result[0]
        this.form[index].time = result[0].min_length + '~' + result[0].max_length
        this.form[index].count = result[0].nursing_num.value
        this.form[index].service_time = parseInt(result[0].max_length) * parseInt(result[0].nursing_num.value)
      },
      // 服务频率变更 
      inputChange(index){
        this.form[index].count = parseInt(this.form[index].count) || 0
        this.form[index].service_time = parseInt(this.form[index].projectActive.max_length) * this.form[index].count
      },
      // 添加项目
      addProject(index) {
        this.form.splice(index + 1, 0, {
          id: Math.random(),
          category: '',
          projectOptions: [],
          project: '',
          time: '0',
          count: '0',
          service_time: "0",
        })
      },
      // 减少项目
      reduceProject(index) {
        this.form.splice(index, 1)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .zn-scheduling {
    padding: 16px;
    background: $base-fill-2;
    border-radius: 8px;
    .item {
      &:last-child {
        margin-bottom: 0 !important;
      }
      &-left {
        width: calc(100% - 78px);
        .head-title {
          line-height: 22px;
        }
        // element 表单样式
        .el-select {
          width: 100%;
        }
        ::v-deep .el-input__inner {
          border-radius: 4px;
          padding-left: 10px;
          border-color: $base-line-2;
        }
        ::v-deep .el-input__icon {
          width: 15px;
        }
        ::v-deep .el-input__suffix {
          right: 10px;
          &-inner {
            line-height: 36px;
            color: $base-text-5;
          }
        }
      }
      &-right {
        width: 78px;
        .el-button {
          padding: 4px;
          border-color: $base-fill-4;
          background: $base-fill-4;
          i {
            font-weight: bold;
          }
        }
      }
    }
  }
</style>
