<template>
  <el-drawer
    v-if="drawer"
    title="选择商品分类"
    custom-class="add-category"
    :visible.sync="drawer"
    :direction="direction"
    :append-to-body="false"
    :modal-append-to-body="false"
    :close-on-press-escape="false"
    :wrapperClosable="false"
    :before-close="cancel"
    :size="680"
  >
    <div class="drawer-product height-100">
      <div class="drawer-body height-100">
        <zn-query-form>
          <zn-query-form-left-panel>
            <zn-views-tabs :options="viewsTabsOptions" @upTable="getHeader" />
          </zn-query-form-left-panel>
          <zn-query-form-right-panel>
            <!-- 搜索 -->
            <zn-search-btn
              @up-Search="upSearch"
              @closeOtherPopover="closeOtherPopover"
            />
          </zn-query-form-right-panel>
        </zn-query-form>
        <!-- 相册试图页面 -->
        <div
          v-if="viewsType === 'gallery'"
          class="content-view album-view"
        ></div>
        <!-- 表格试图页面 -->
        <div class="content-view table-view" v-else>
          <zn-filter-table
            v-if="viewsType == 'table'"
            ref="filterTable"
            :class="total === 0 ? 'table-view-empty' : ''"
            :multiple="true"
            :tableData="tableList"
            :finallyColumns="finallyColumns"
            :maxHeight="'650'"
            @selectList="getSelect"
            @fetch-data="fetchData"
            :defaultPageImgUrl="
              require('@/assets/images/default_page/pic-currency.png')
            "
            :defaultPageTips="'暂无数据'"
            :hasDetail="false"
          ></zn-filter-table>
          <div class="table-pagination flex-center-between pl-24 pr-16">
            <span class="table-pagination-tip">
              已选择{{ moreList.length }}个分类
            </span>
            <el-pagination
              class="flex-center"
              background
              :current-page="queryForm.page"
              :page-size="queryForm.listRows"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              v-bind="$attrs"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </div>
      <div class="drawer-tip pl-16 pr-16 pos-absolute" v-if="tipsShow">
        请至少选择一个分类
      </div>
      <div class="drawer-footer">
        <el-button class="el-cancel" @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import {
  getCategory,
  getCategoryViews,
  getCategoryBuilder,
} from '@/api/service/product'
import { getTableHeader, viewsTabs, filters } from '@/api/index'
export default {
  name: 'AddProduct',
  data() {
    return {
      drawer: false,
      direction: 'rtl',
      mark: 'CatalogProduct', //特定标识,根据业务模块不同,传输的标识也不同,标识由后端定义(或者字典维护)
      viewsType: '', //当前页面显示视图类型
      total: 0,
      tableList: [],
      viewsTabsOptions: [], // viewsTabs数据
      managementOptions: {}, // 字段、卡片管理数据
      listLoading: false,
      queryForm: {
        page: 1,
        listRows: 20,
        keywords: '',
        views_id: '', //当前页面显示视图ID
        status: 1,
      },
      deatilsPath: '/settlement/billDetail', //表格当前行跳转路径 /nursing/project/components/projectDetail
      columns: [], //筛选条件中的数据
      checkList: [], //筛选条件中选中的数据
      moreList: [], //表格复选多选中的数据
      tipsShow: false,
      pageSizes: [10, 20, 30, 50, 100],
    }
  },
  created() {
    this.getViewsTabs()
  },
  methods: {
    // 打开抽屉
    show(moreList) {
      this.tipsShow = false
      this.drawer = true
      // 回显已选商品
      this.$nextTick(() => {
        this.tableList
          .filter((item) => moreList.includes(item.id))
          .forEach((row) => {
            this.$refs['filterTable'].$refs['table'].toggleRowSelection(row)
          })
        this.$refs['filterTable'].checkedList = this.tableList.map(
          (item, index) => {
            let i = moreList.includes(item.id) ? index : -1
            return i >= 0 ? true : false
          }
        )
      })
    },
    // 关闭其他 popover 框
    closeOtherPopover() {
      if (this.$refs['ZnScreenBtn']) {
        this.$refs['ZnScreenBtn'].closePopover()
      }
    },
    // table顶栏左侧viewsTabs
    getViewsTabs() {
      getCategoryViews({ mark: this.mark }).then((res) => {
        this.viewsTabsOptions = res.data.data
        if (res.code == 200 && res.data.data.length > 0) {
          this.queryForm.views_id = res.data.data[0].id // 更新当前页面显示视图ID
          this.viewsType = res.data.data[0].type // 更新当前页面显示视图类型
          this.getFilters() //回显筛选
          this.getHeader()
          this.fetchData()
        }
      })
    },
    // table顶栏右侧字段管理、卡片管理
    async getHeader(obj) {
      getCategoryBuilder({
        mark: this.mark,
        viewsId: obj ? obj.id : this.queryForm.views_id,
      }).then((res) => {
        this.managementOptions = res.data //字段管理、卡片管理
        this.columns = res.data.fields //table列(未经卡片管理、字段管理筛选的数据)
        if (obj) {
          this.queryForm.views_id = obj.id // 更新当前页面显示视图ID
          this.viewsType = obj.type // 更新当前页面显示视图类型
          this.getFilters() //回显筛选
        }
        this.managementOptions.fields.map((item) => {
          if (item.isShow == true) {
            this.checkList.push(item.label)
          }
        })
      })
    },
    // 获取已保存的筛选规则
    getFilters() {
      return
      filters({ mark: this.mark, views_id: this.queryForm.views_id }).then(
        (res) => {
          if (this.$refs.ZnScreenBtn) {
            this.$refs.ZnScreenBtn.form.filters = res.data.filters
          }
        }
      )
    },
    // 请求table数据
    async fetchData() {
      this.listLoading = true
      const {
        data: { data, total },
      } = await getCategory(this.queryForm)
      this.tableList = data
      this.total = total
      this.listLoading = false
    },
    // 更新搜索字段,更新table数据
    upSearch(val) {
      this.queryForm.keywords = val
      this.fetchData()
    },
    // 获取多选选中的table数据(需求未出,功能暂留)
    getSelect(list) {
      this.moreList = list
    },
    // 卡片管理子组件条件返回,更新表格视图
    upTableData(columns, checkList) {
      this.columns = columns //所有表头
      this.checkList = checkList //对应表头
    },
    // 卡片管理子组件条件返回,更新表格视图
    upCardData(columns, checkList, showLabel) {
      this.columns = columns //所有表头
      this.checkList = checkList //对应表头
      this.showLabel = showLabel //卡片视图中是否显示label
    },
    // 取消操作
    cancel() {
      this.drawer = false
    },
    // 提交操作
    submit() {
      if (this.moreList.length < 1) {
        this.tipsShow = true
        return false
      }
      this.tipsShow = false
      this.$emit('update-product', this.moreList, 'category')
      this.drawer = false
    },
    // 改变分页数
    handleSizeChange(val) {
      this.queryForm.listRows = val
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
      this.fetchData()
    },
    // 选择页码
    handleCurrentChange(val) {
      this.queryForm.page = val
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
      this.fetchData()
    },
  },
  computed: {
    finallyColumns() {
      if (this.checkList.length > 0) {
        return this.columns.filter((item) =>
          this.checkList.includes(item.label)
        )
      }
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep .add-category {
  .el-drawer__body {
    padding: 0;
    padding-bottom: 80px !important;
  }
  .is-active {
    color: $base-text-5;
    .views-tabs-title::after {
      display: none;
    }
  }
  .zn-blinds {
    display: none;
  }
}
.drawer-tip {
  background: #ffece8;
  line-height: 32px;
  font-size: 12px;
  color: $base-Error-6;
  left: 0;
  bottom: 56px;
  right: 0;
  z-index: 2;
}
::v-deep .table-view {
  height: calc(100% - 55px);
  .filter-table {
    height: calc(100% - 50px);
    overflow: hidden;
  }
  .el-table {
    height: 100%;
  }
  .el-table__body-wrapper {
    height: calc(100% - 48px);
    overflow: auto;
  }
}
.table-pagination {
  background: #fff;
  &-tip {
    font-size: 14px;
  }
  ::v-deep .el-pagination {
    margin-top: 0;
    padding: 0;
    .el-pagination__total {
      font-size: 12px;
    }
    &.is-background .btn-prev,
    &.is-background .btn-next,
    &.is-background .el-pager li {
      min-width: 36px;
      height: 36px;
      line-height: 36px;
      margin: 0 4px;
      font-size: 14px;
      background: $base-fill-2;
      color: $base-text-4;
    }
    &.is-background .el-pager li:not(.disabled).active {
      background-color: rgba(0, 91, 217, 0.1);
      color: $base-main-tone;
    }
  }
}
</style>
