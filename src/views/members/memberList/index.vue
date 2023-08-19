<template>
  <div class="member-container">
    <zn-query-form>
      <zn-query-form-left-panel>
        <zn-views-tabs :options="viewsTabsOptions" @upTable="getHeader" />
      </zn-query-form-left-panel>
      <zn-query-form-right-panel>
        <!-- 搜索 -->
        <!-- <zn-search-btn
          @up-Search="upSearch"
          @closeOtherPopover="closeOtherPopover"
        /> -->
        <!-- 筛选 -->
        <!-- <zn-screen-btn
          ref="ZnScreenBtn"
          :mark="mark"
          :views_id="queryForm.viewsId"
          :options="managementOptions"
          @upTable="fetchData"
        /> -->
        <!-- 字段管理 -->
        <zn-field-management-btn
          ref="ZnFieldManagementBtn"
          v-if="viewsType == 'table'"
          :mark="mark"
          :views_id="queryForm.viewsId"
          :options="managementOptions"
          @upTable="upTableData"
        />
        <!-- 卡片管理 -->
        <zn-card-management-btn
          ref="ZnCardManagementBtn"
          v-if="viewsType == 'gallery'"
          :mark="mark"
          :views_id="queryForm.viewsId"
          :options="managementOptions"
          @upCard="upCardData"
        />
        <el-button
          ref="addButton"
          type="primary"
          size="medium"
          @click="addMember"
          v-permissions="{ permission: ['members:memberList:add'] }"
        >
          <zn-icon :iconName="'icon-add'" />
          新增会员
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
        :hasDetail="false"
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
          class="batch-button"
          type="text"
          size="medium"
          icon="el-icon-delete"
          @click="deleteMember"
          v-permissions="{ permission: ['members:memberList:del'] }"
        >
          <span>删除</span>
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
    <!-- 添加会员信息 -->
    <add-member v-if="addDrawer" :drawer="addDrawer" @closeDrawer="closeDrawer"></add-member>
  </div>
</template>
  
<script>
import addMember from "./components/addMember"
import { getTableHeader, viewsTabs, filters } from '@/api/index'
import { mapActions, mapGetters } from 'vuex'
import { getMemberList, delMember } from "@/api/members"
export default {
  name: 'MemberList',
  components: {
    addMember
  },
  data() {
    return {
      mark: 'Member', //特定标识,根据业务模块不同,传输的标识也不同,标识由后端定义(或者字典维护)
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
        viewsId: '', //当前页面显示视图ID
      },
      deatilsPath: '/members/memberDetail', //表格当前行跳转路径
      columns: [], //筛选条件中的数据
      checkList: [], //筛选条件中选中的数据
      moreList: [], //表格复选多选中的数据
      recode_key: 'membersMemberList',
      addDrawer: false   // 新增会员抽屉
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
    // 关闭其他 popover 框
    closeOtherPopover() {
      if (this.$refs['ZnScreenBtn']) {
        this.$refs['ZnScreenBtn'].closePopover()
      }
    },
    // table顶栏左侧viewsTabs
    getViewsTabs() {
      viewsTabs({ mark: this.mark }).then((res) => {
        this.viewsTabsOptions = res.data
        if (res.code == 200 && res.data.length > 0) {
          this.queryForm.viewsId = res.data[0].id // 更新当前页面显示视图ID
          this.viewsType = res.data[0].type // 更新当前页面显示视图类型
          this.getFilters() //回显筛选
          this.getHeader()
          this.fetchData()
        }
      })
    },
    // table顶栏右侧字段管理、卡片管理
    async getHeader(obj) {
      getTableHeader({
        mark: this.mark,
        viewsId: obj ? obj.id : this.queryForm.viewsId,
      }).then((res) => {
        this.managementOptions = res.data //字段管理、卡片管理
        this.columns = res.data.fields //table列(未经卡片管理、字段管理筛选的数据)
        if (obj) {
          this.queryForm.viewsId = obj.id // 更新当前页面显示视图ID
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
      filters({ mark: this.mark, views_id: this.queryForm.viewsId }).then(
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
        data: { list, total },
      } = await getMemberList(this.queryForm)
      this.tableList = list
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

    addMember(){
      this.addDrawer = true
    },
    // 关闭新建抽屉
    closeDrawer(){
      this.addDrawer = false
    },
    // 删除用户信息
    deleteMember(){
      this.$confirm(`是否删除${this.moreList.length}条会员数据？`, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(res => {
        delMember({
          member_id: this.moreList.map((item) => item.id).join(',')
        }).then(res => {
          if(res.code === 200){
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
.member-container {
  height: $base-keep-alive-height;
}
.batch-button {
  color: $base-Error-6 !important;
}
</style>
  