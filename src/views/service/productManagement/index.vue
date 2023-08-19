<template>
  <div class="product-container">
    <zn-query-form>
      <zn-query-form-left-panel>
        <zn-views-tabs 
          :source="'productManagement'"
          :options="viewsTabsOptions" 
          :filterOptions="managementOptions"
          :mark="mark"
          :views_id="queryForm.views_id"
          @upTable="getHeader" 
          @allUpdate="getViewsTabs"
        />
      </zn-query-form-left-panel>
      <zn-query-form-right-panel>
        <!-- 搜索 -->
        <zn-search-btn
          @up-Search="upSearch"
          @closeOtherPopover="closeOtherPopover"
        />
        <!-- 筛选 -->
        <zn-screen-btn
          ref="ZnScreenBtn"
          :mark="mark"
          :views_id="queryForm.views_id"
          :options="managementOptions"
          @upTable="fetchData"
        />
        <!-- 字段管理 -->
        <zn-field-management-btn
          ref="ZnFieldManagementBtn"
          v-if="viewsType == 'table'"
          :mark="mark"
          :views_id="queryForm.views_id"
          :options="managementOptions"
          @upTable="upTableData"
        />
        <!-- 卡片管理 -->
        <zn-card-management-btn
          ref="ZnCardManagementBtn"
          v-if="viewsType == 'gallery'"
          :mark="mark"
          :views_id="queryForm.views_id"
          :options="managementOptions"
          @upCard="upCardData"
        />
        <el-button
          class="el-add"
          type="primary"
          size="medium"
          @click="addProduct"
          v-permissions="{ permission: ['service:productManagement:add'] }"
        >
          <zn-icon :iconName="'icon-add'" />
          添加商品
        </el-button>
      </zn-query-form-right-panel>
    </zn-query-form>
    <!-- 相册试图页面 -->
    <div v-if="viewsType === 'gallery'" class="content-view album-view"></div>
    <!-- 表格试图页面 -->
    <div class="content-view table-view" v-else>
      <zn-filter-table
        v-if="viewsType == 'table'"
        ref="filterTable"
        :class="total === 0 ? 'table-view-empty' : ''"
        :multiple="true"
        :tableData="tableList"
        :finallyColumns="finallyColumns"
        :deatilsPath="deatilsPath"
        :maxHeight="'650'"
        @selectList="getSelect"
        @fetch-data="fetchData"
        :defaultPageImgUrl="
          require('@/assets/images/default_page/pic-currency.png')
        "
        :defaultPageTips="'暂无数据'"
      >
        <el-button
          v-permissions="{ permission: ['service:productManagement:del'] }"
          class="batch-button"
          type="text"
          size="medium"
          icon="el-icon-delete"
          @click="batchDelete"
        >
          <span>删除</span>
        </el-button>
        <el-button
          v-permissions="{ permission: ['service:productManagement:low'] }"
          class="batch-button"
          type="text"
          size="medium"
          icon="el-icon-set-up"
          @click="batchUpdate(2)"
        >
          <span>下架</span>
        </el-button>
        <el-button
          v-permissions="{ permission: ['service:productManagement:put'] }"
          class="batch-button"
          type="text"
          size="medium"
          icon="el-icon-set-up"
          @click="batchUpdate(1)"
        >
          <span>上架</span>
        </el-button>
      </zn-filter-table>
      <zn-pagination
        v-show="total > 0"
        :page.sync="queryForm.page"
        :limit.sync="queryForm.listRows"
        @pagination="fetchData"
        :total="total"
        :algin="'right'"
      />
    </div>
    <!-- 添加商品 -->
    <add-product ref="addProduct" @add-update="fetchData" />
  </div>
</template>

<script>
import { getList, batchUpdate, batchDelete } from '@/api/service/product'
import { newViewsTabs, newGetTableHeader, newFilters } from '@/api/index'
import addProduct from './components/addProduct'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ProductManagement',
  components: {
    addProduct,
  },
  data() {
    return {
      mark: 'Product', //特定标识,根据业务模块不同,传输的标识也不同,标识由后端定义(或者字典维护)
      viewsType: '', //当前页面显示视图类型
      total: 0,
      tableList: [],
      viewsTabsOptions: [], // viewsTabs数据
      managementOptions: {}, // 字段、卡片管理数据
      listLoading: false,
      queryForm: {
        page: 1,
        listRows: 100,
        keywords: '',
        views_id: '', //当前页面显示视图ID
      },
      deatilsPath: '/service/productManagement/components/detail', //表格当前行跳转路径
      columns: [], //筛选条件中的数据
      checkList: [], //筛选条件中选中的数据
      moreList: [], //表格复选多选中的数据
      recode_key: 'ServiceProductManagement',
    }
  },
  created() {
    let { record } = this.$store.state['recordData']
    if (record[this.recode_key]) {
      this.queryForm = record[this.recode_key]
      this.getViewsTabs()
    } else {
      this.getViewsTabs()
    }
  },
  methods: {
    ...mapActions({
      setRecordData: 'recordData/setRecordData',
    }),

    // 添加商品
    addProduct() {
      this.$refs['addProduct'].show()
    },
    // 关闭其他 popover 框
    closeOtherPopover() {
      if (this.$refs['ZnScreenBtn']) {
        this.$refs['ZnScreenBtn'].closePopover()
      }
    },
    // table顶栏左侧viewsTabs
    getViewsTabs(data) {
      newViewsTabs({ mark: this.mark }).then((res) => {
        this.viewsTabsOptions = res.data
        if (res.code == 200 && res.data.length > 0) {
          if(data){
            this.queryForm.views_id = data.views_id
            this.viewsType = data.type
            this.getHeader({
              id: data.views_id,
              type: data.type
            });
          }else{
            this.queryForm.views_id = res.data[0].id // 更新当前页面显示视图ID
            this.viewsType = res.data[0].type // 更新当前页面显示视图类型
            this.getFilters() //回显筛选
            this.getHeader()
            this.fetchData()
          }
        }
      })
    },
    // table顶栏右侧字段管理、卡片管理
    async getHeader(obj) {
      newGetTableHeader({
        mark: this.mark,
        views_id: obj ? obj.id : this.queryForm.views_id,
      }).then((res) => {
        this.managementOptions = res.data //字段管理、卡片管理
        this.columns = res.data.fields //table列(未经卡片管理、字段管理筛选的数据)
        if (obj) {
          this.queryForm.views_id = obj.id // 更新当前页面显示视图ID
          this.viewsType = obj.type // 更新当前页面显示视图类型
          this.getFilters() //回显筛选
          this.fetchData();   // 刷新列表
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
      newFilters({ mark: this.mark, views_id: this.queryForm.views_id }).then(
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
      this.setRecordData({ key: this.recode_key, ...this.queryForm })
      const {
        data: { data, total },
      } = await getList(this.queryForm)
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
    // 批量上架
    batchUpdate(type) {
      batchUpdate({
        ids: this.moreList.map((item) => item.id).join(','),
        status: type,
      }).then((res) => {
        if (res.code === 200) {
          let tip = type === 1 ? '上架' : '下架'
          this.$notify({
            title: `${tip}成功`,
            message: `商品已${tip}`,
            type: 'success',
            duration: 1000
          })
          this.fetchData()
        }
      })
    },
    // 批量删除
    batchDelete() {
      this.$confirm('是否确认删除商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        batchDelete({
          ids: this.moreList.map((item) => item.id).join(','),
        }).then((res) => {
          if (res.code === 200) {
            this.$notify({
              title: '警告',
              message: '商品已删除',
              type: 'warning',
              duration: 1000
            })
            this.fetchData()
          }
        })
      })
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
.product-container {
  height: $base-keep-alive-height;
}
.batch-button {
  color: $base-Brand1-6 !important;
}
</style>
