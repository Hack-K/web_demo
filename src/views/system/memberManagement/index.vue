<template>
  <div class="user-management-container">
    <zn-query-form>
      <zn-query-form-left-panel>
        <zn-views-tabs 
          :source="'memberManagement'"
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
          type="primary"
          size="medium"
          @click="openAdd"
          v-permissions="{ permission: ['system:memberManagement:add'] }"
        >
          <zn-icon :iconName="'callcenter-add'" />
          添加成员
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
        :defaultPageImgUrl="require('@/assets/images/default_page/pic-2.png')"
        :defaultPageTips="'暂无成员'"
      >
        <el-button type="text" size="medium" @click="resetPassWord">
          <zn-icon :iconName="'icon-reset'" />
          <span>重置密码</span>
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
    <!-- 添加成员 -->
    <edit ref="edit" @fetch-data="fetchData" :modalToBody="false" />
  </div>
</template>

<script>
import Edit from './components/memberManagementEdit'
import { getList, resetPwd } from '@/api/system/memberManagement'
import { viewsTabs, getTableHeader, filters } from '@/api/index'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'memberManagement',
  components: {
    Edit,
  },
  data() {
    return {
      mark: 'AdminUser', //特定标识,根据业务模块不同,传输的标识也不同,标识由后端定义(或者字典维护)
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
      deatilsPath: '/system/memberManagement/components/memberDeatils', //表格当前行跳转路径
      columns: [], //筛选条件中的数据
      checkList: [], //筛选条件中选中的数据
      moreList: [], //表格复选多选中的数据
      recode_key: 'systemMemberManagement',
    }
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
  watch: {},
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
    // 关闭其他 popover 框
    closeOtherPopover() {
      if (this.$refs['ZnScreenBtn']) {
        this.$refs['ZnScreenBtn'].closePopover()
      }
    },
    // table顶栏左侧viewsTabs
    getViewsTabs(data) {
      viewsTabs({ mark: this.mark }).then((res) => {
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
      getTableHeader({
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
    // 打开添加成员抽屉
    openAdd() {
      this.$refs['edit'].showEdit()
    },
    // 重置密码
    resetPassWord() {
      this.$confirm('是否确认重置？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then((_) => {
        resetPwd({ ids: this.moreList.map((v) => v.id) }).then((res) => {
          if (res.code == 200) {
            this.$notify({
              title: '成功',
              message: '重置成功！',
              type: 'success',
              duration: 1000
            })
            this.fetchData()
          }
        })
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.user-management-container {
  height: $base-keep-alive-height;
}
::v-deep.pop-li {
  .el-button {
    color: black !important;
  }
  &:hover {
    background-color: $base-color-public;
    .el-button {
      color: $base-main-tone !important;
    }
  }
}
</style>
