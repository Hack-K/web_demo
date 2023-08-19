<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <zn-query-form>
        <zn-query-form-top-panel>
          <el-form :inline="true" label-width="0" @submit.native.prevent>
            <el-form-item label="">
              <el-input v-model="queryForm.title" clearable />
            </el-form-item>
            <el-form-item label-width="0">
              <el-button
                native-type="submit"
                type="primary"
                size="small"
                @click="queryData"
              >
                查询
              </el-button>
            </el-form-item>
          </el-form>
        </zn-query-form-top-panel>
      </zn-query-form>
    </el-col>

    <el-col v-for="(item, index) in queryIcon" :key="index" :span="6">
      <el-card shadow="hover" @click.native="handleIcon(item)">
        <zn-icon :iconName="item" />
      </el-card>
    </el-col>
    <el-col :span="24">
      <el-pagination
        :background="background"
        :current-page="queryForm.pageNo"
        :layout="layout"
        :page-size="queryForm.listRows"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </el-col>
  </el-row>
</template>

<script>
import iconList from './iconName.js'
export default {
  name: 'ZnIconSelector',
  data() {
    return {
      icon: '24-hours-fill',
      layout: 'total, prev, next',
      total: 0,
      background: true,
      height: 0,
      selectRows: '',
      queryIcon: [],
      queryForm: {
        pageNo: 1,
        listRows: 16,
        title: '',
      },
    }
  },
  created() {
    this.fetchData(iconList)
  },
  methods: {
    handleSizeChange(val) {
      this.queryForm.listRows = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.queryForm.pageNo = val
      this.fetchData()
    },
    queryData() {
      let arr = []
      this.queryForm.pageNo = 1
      if (this.queryForm.title != '') {
        arr = iconList.filter((item) => item.startsWith(this.queryForm.title))
        this.fetchData(arr)
      } else {
        this.fetchData(iconList)
      }
    },
    async fetchData(arr) {
      this.queryIcon = this.getIconArray(arr)
      this.total = arr.length
    },
    getIconArray(arr) {
      return arr.slice(
        (this.queryForm.pageNo - 1) * this.queryForm.listRows,
        this.queryForm.listRows * this.queryForm.pageNo
      )
    },
    handleIcon(item) {
      this.icon = item
      this.$emit('handle-icon', item)
    },
  },
}
</script>

<style lang="scss">
.icon-selector-popper {
  .el-card {
    text-align: center;
    .el-card__body {
      padding: 10px;
      cursor: pointer;

      .zn-icon {
        width: 30px;
        height: 30px;
        cursor: pointer;
      }
    }
  }

  .el-pagination {
    margin: 0;
  }
}
</style>
