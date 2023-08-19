<template>
  <div class="project-container">
    <zn-query-form>
      <zn-query-form-left-panel>
        <zn-views-tabs 
        :source="'orderManagement'"
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
        <!-- <el-button
          v-if="moreList.length === 1"
          class="batch-button"
          type="text"
          size="medium"
          icon="el-icon-set-up"
          @click="refundClick"
        >
          <span>退款</span>
        </el-button> -->
        <el-button
          v-if="
            moreList.length === 1 &&
            [1, 6].includes(moreList[0].service_status.value) &&
            moreList[0].status.value !== 6
          "
          class="batch-button"
          type="text"
          size="medium"
          icon="el-icon-set-up"
          @click="orderDistribution"
        >
          <span>分派订单</span>
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
    <!-- 退款抽屉 -->
    <refund ref="refund" @updateDetail="fetchData"></refund>
  </div>
</template>

<script>
import refund from './components/refund'
import { getList } from '@/api/service/order'
// import { getWorkOrderConfig } from '@/api/workOrder'
import { newViewsTabs, newGetTableHeader, newFilters } from '@/api/index'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'OrderManagement',
  components: {
    refund,
  },
  data() {
    return {
      mark: 'Order', //特定标识,根据业务模块不同,传输的标识也不同,标识由后端定义(或者字典维护)
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
      deatilsPath: '/service/orderManagement/components/detail', //表格当前行跳转路径
      configData: null,
      columns: [], //筛选条件中的数据
      checkList: [], //筛选条件中选中的数据
      moreList: [], //表格复选多选中的数据
      recode_key: 'serviceOrderManagement',
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
    this.getConfigData()
    this.$EventBus.on('workOrderUpdate', this.addUpdata)
  },
  methods: {
    ...mapActions({
      setRecordData: 'recordData/setRecordData',
    }),
    // 关闭地图抽屉
    closeMapDrawer() {
      this.showMap = false
    },
    // 关闭其他 popover 框
    closeOtherPopover() {
      if (this.$refs['ZnScreenBtn']) {
        this.$refs['ZnScreenBtn'].closePopover()
      }
    },
    // 添加完成刷新
    addUpdata() {
      this.getViewsTabs()
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
    // 获取工单配置参数
    getConfigData() {

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
    // 退款
    refundClick() {
      this.$refs['refund'].show({
        id: this.moreList[0].id,
        amount: this.moreList[0].sale_price,
      })
    },
    // 分配订单
    orderDistribution() {
      this.$refs['addWorkOrder'].show()
    },
  },
  destroyed() {
    // 销毁刷新监听事件
    this.$EventBus.off('workOrderUpdate', this.addUpdata)
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
.project-container {
  height: $base-keep-alive-height;
}
.batch-button {
  color: $base-Brand1-6 !important;
}
</style>
