<template>
   <!-- table部分 -->
   <div class="member-container"  >
      <!-- 新增成员功能 -->
      <zn-query-form>
        <zn-query-form-left-panel>
          <zn-views-tabs :options="viewsTabsOptions" @upTable="getHeader" />
        </zn-query-form-left-panel>
        <zn-query-form-right-panel>
          
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
            ref="addButton"
            type="primary"
            size="medium"
            @click="openDrawer()"
            v-permissions="{ permission: ['chamber:setting:add'] }"
          >
            <zn-icon :iconName="'icon-add'" />新增成员
          </el-button>
        </zn-query-form-right-panel>
      </zn-query-form>
      <!-- 相册视图页面 -->
      <div v-if="viewsType === 'gallery'" class="content-view album-view"></div>
      <!-- 表格视图页面 -->
      <div class="content-view table-view" v-else>
        <zn-filter-table
          v-if="viewsType == 'table'"
          ref="filterTable"
          :loading="listLoading"
          :class="total === 0 ? 'table-view-empty' : ''"
          :multiple="true"
          :tableData="tableList"
          :finallyColumns="finallyColumns"
          :hasDetail="false"
          :deatilsPath="deatilsPath"
          :maxHeight="'650'"
          @selectList="getSelect"
          @fetch-data="fetchData"
          @rowDetailClick="goDetail"
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
            v-permissions="{ permission: ['chamber:setting:del'] }"
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
      <!-- 添加商会信息 -->
      <add-chamber v-if="addDrawer" :drawer="addDrawer" @closeDrawer="closeDrawer"></add-chamber>
      <!-- 查看班子详情 -->
      <!-- <chamber-detail v-if="chamberDetail" :drawer="detailDrawer" @closeDrawer="closeDetailDrawer"></chamber-detail> -->
    </div>
</template>

<script>
import addChamber from "./addChamber.vue"
import chamberDetail from "./chamberDetail.vue"
import {getChamberClassList,delChamberList,} from '@/api/chamber'
import { getTableHeader, viewsTabs, filters } from '@/api/index'
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'ChamberList',
    components: {
    addChamber,
    chamberDetail
  },
    data(){
        return{
      mark: 'Manager', //特定标识,根据业务模块不同,传输的标识也不同,标识由后端定义(或者字典维护)
      viewsType: '', //当前页面显示视图类型
      total: 0,
      tableList: [],
      viewsTabsOptions: [], // viewsTabs数据
      managementOptions: {}, // 字段、卡片管理数据
      listLoading: false,
      ids:[],
      queryForm: {
        page: 1,
        listRows: 100,
        // keywords: '',
        views_id: '', //当前页面显示视图ID
      },
      deatilsPath: '', //表格当前行跳转路径
      columns: [], //筛选条件中的数据
      checkList: [], //筛选条件中选中的数据
      moreList: [], //表格复选多选中的数据
      recode_key: 'membersMemberList',
      addDrawer: false, // 新增班子抽屉,
      detailDrawer:false,//详情和编辑抽屉
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
    methods:{
          // table的逻辑···········
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
          this.queryForm.views_id = res.data[0].id // 更新当前页面显示视图ID
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
        views_id: obj ? obj.id : this.queryForm.views_id,
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
      this.setRecordData({ key: this.recode_key, ...this.queryForm })
      const {
        data: { list, total },
      } = await getChamberClassList(this.queryForm)
      this.tableList = list
      this.total = total
      this.listLoading = false
    },// 更新搜索字段,更新table数据
    upSearch(val) {
      // this.queryForm.keywords = val
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
    openDrawer(){
      this.addDrawer = true
    },
    // 关闭新建抽屉
    closeDrawer() {
      this.addDrawer = false
    },
    openDetailDrawer(){
      this.detailDrawer = true
    },
    closeDetailDrawer(){
      this.detailDrawer = false
    },
    // 删除用户信息
    deleteMember() {

      this.$confirm(`是否删除${this.moreList.length}条会员数据？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then((res) => {
        delChamberList({
          ids:this.moreList.map((item) =>parseInt(item.id))
        }).then((res) => {
          if (res.code === 200) {
            this.fetchData()
            
          }
        })
      })
    },
    // 跳转抽屉详情
    goDetail(id){
      this.$emit("openEditDrawer", id)
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
}
</script>

<style lang="scss" scoped>
::v-deep .el-drawer__wrapper{
    position: absolute !important;
    width: 100%;
  }
.allchamberinformation{
    border-bottom: solid 1px #999;
    padding-bottom: 17px;
}
.chamberinformation{
    font-size: 16px;
    font-weight: 500;
    line-height: 22px;
    margin: 12px;
    text-align: center;
    background: yellow;
}
.chamberform{
  width: 824px;
  margin: 0 auto;
    
padding-top: 24px;
 
}
.chamberpicturearea{
    width: 816px;
    padding-top: 24px;
    padding-bottom: 24px;
    display: flex;
    justify-content: space-between;
}
.picturearea{
    display: flex;
    flex-direction: column;
    padding-top: 12px;
    height:80px;
    width:80px;
    justify-content: center;
    align-items: center;
    border: solid 1px #E5E6EB;
    border-radius: 8px;
}
.changepicture{
  background: rgba(230, 239, 251, 0.6);
  text-align: center;
  left: 1px;
  top: 59px;
  width: 78px;
  height: 20px;
  color: #005BD9;
}
.chamberpicture{
   height:56px;
   width:56px;
}
.avatar-uploader  {
    
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    line-height: 22px;
    text-align: center;
  } 
  .avatar {
    width: 80px;
    height: 80px;
    display: block;
  }
.editbtn{
    width: 68px;
    height: 36px;
    background: #005BD9;
    color: white;
    font-size: 14px; 
    line-height: 22px;
    align-items: center;
    border-radius: 4px;
    border: none;
    
}
.cancelbtn{
  width: 68px;
  height: 36px;
  background: #F2F3F5;
  margin-right: 10px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: normal;
  line-height: 22px;
  align-items: center;
}
/* 大表单 */
.chamberbigform{
 display: flex;
 flex-direction: column;
 

}
/* 一个选项 */
.onechamber{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  font-size: 14px;
  font-weight: normal;
  line-height: 22px;
}

.twochamber{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  font-size: 14px;
  font-weight: normal;
  line-height: 22px;
  margin-left: 16px;
}
.chamberTop{
  display: flex;
}
.chamberBottom{
  display: flex;
}
/* 输入框 */
.chamberinput{
  background: #F7F8FA;
  width: 400px;
}

/* 描述 */
.chamberdescribe{
  width: 816px;
  height: 236px;
  
}
.contact{
  font-size: 18px;
  font-weight: 500;
  color: #1D2129;
  margin-bottom: 16px;
}
.star{
  font-size: 16px;
  font-weight: normal;
  line-height: 24px;
  margin-right: 4px;
  color: #F53F3F;
}
.member-container {
  height: $base-keep-alive-height;
}
.batch-button {
  color: $base-Error-6 !important;
}
</style>