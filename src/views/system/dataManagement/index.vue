<template>
  <div class="role-container">
    <el-row :gutter="16" class="role-row">
      <el-col :span="6" class="role-col-left">
        <el-card class="card-wrap">
          <div slot="header" class="flex-center flex-between">
            <span>数据组</span>
          </div>
          <div class="role-tree-views" v-if="dataList.length > 0">
            <el-col
              :class="{ 'role-li': true, 'role-li-active': index === isActive }"
              :span="24"
              v-for="(item, index) in dataList"
              :key="index"
            >
              <el-col
                :span="22"
                class="overflowOne"
                :class="index === isActive ? 'is-active' : ''"
                @click.native="handlerNode(item.id, index)"
              >
                <zn-icon :iconName="'icon-ment_code'" class="mr-10" />
                <span>{{ item.name }}</span>
              </el-col>

              <el-col :span="2" class="more-pop">
                <el-popover
                  popper-class="role-tree-popover select-popover"
                  placement="left-start"
                  trigger="click"
                  :visible-arrow="false"
                  ref="roleTreePopover"
                >
                  <div class="pop-li pl-5">
                    <el-popover
                      width="348"
                      popper-class="role-edit-popover"
                      trigger="click"
                      :visible-arrow="false"
                      ref="roleEditPopover"
                    >
                      <el-form
                        ref="someoneForm"
                        :model="someoneForm"
                        label-position="top"
                        label-width="100px"
                      >
                        <el-form-item label="修改数据组名称">
                          <el-input v-model.trim="someoneForm.name"></el-input>
                        </el-form-item>
                      </el-form>
                      <div style="text-align: right; margin: 0">
                        <el-button
                          class="borderRa-4"
                          size="mini"
                          type="text"
                          @click="cancelEditLeft(index)"
                        >
                          取消
                        </el-button>
                        <el-button
                          class="borderRa-4"
                          type="primary"
                          size="mini"
                          @click="handlerEdit(item.id, index)"
                        >
                          确定
                        </el-button>
                      </div>
                      <el-button
                        type="text"
                        size="medium"
                        slot="reference"
                        v-permissions="{
                          permission: ['system:dataManagement:edit'],
                        }"
                      >
                        <zn-icon :iconName="'icon-edit'" class="mr-10" />
                        <span>编辑名称</span>
                      </el-button>
                    </el-popover>
                  </div>
                  <div
                    class="pop-li pl-5"
                    v-permissions="{
                      permission: ['system:dataManagement:remove'],
                    }"
                  >
                    <el-button
                      type="text"
                      size="medium"
                      @click="handlerDel(item, index)"
                    >
                      <zn-icon :iconName="'icon-del'" class="mr-10" />
                      <span>删除数据组</span>
                    </el-button>
                  </div>
                  <zn-icon :iconName="'icon-more'" slot="reference" />
                </el-popover>
              </el-col>
            </el-col>
          </div>
          <div class="role-tree-views" v-else>
            <zn-default-page
              :defaultPageImgUrl="
                require('@/assets/images/default_page/pic-2.png')
              "
              :defaultPageTips="'暂无数据组'"
            />
          </div>
          <el-col :span="24" class="role-footer">
            <el-button
              type="primary"
              @click="openRoleAdd"
              v-permissions="{ permission: ['system:dataManagement:add'] }"
            >
              <zn-icon :iconName="'icon-add'" class="mr-6" />
              <span>新增数据组</span>
            </el-button>
          </el-col>
        </el-card>
      </el-col>
      <el-col :span="18" class="role-col-right">
        <el-button
          type="text"
          class="el-more pos-absolute"
          @click="switchEdit"
          v-if="
            currentTab == 'dataInformation' &&
            !dataInformationEdit &&
            dataList.length > 0
          "
          v-permissions="{ permission: ['system:dataManagement:edit'] }"
        >
          <zn-icon :iconName="'icon-edit'" class="mr-6" />
          <span>编辑</span>
        </el-button>
        <el-tabs
          type="border-card"
          v-model="currentTab"
          class="tab-wrap"
          @tab-click="tabClick"
        >
          <!-- 数据组信息 -->
          <el-tab-pane label="数据组信息" name="dataInformation">
            <!-- 数据组信息详情 -->
            <data-information-details
              v-if="!infoEmpty"
              ref="DataInformationDetails"
              :switchEdit="dataInformationEdit"
              :deatils="deatilsData"
              :treeData="treeData"
              :referenceData="referenceData"
              @fetch-data="fetchDataDeatils"
              @set-switch="setSwitch"
            />
            <!-- 暂无数据组信息 -->
            <el-empty
              v-else
              description="暂无数据组信息"
              :image-size="250"
              :image="require('@/assets/images/default_page/pic-3.png')"
            ></el-empty>
          </el-tab-pane>

          <!-- 关联成员 -->
          <el-tab-pane label="关联成员" name="AssociatedMember">
            <div class="height-100">
              <zn-query-form class="ml-16 mr-16">
                <zn-query-form-left-panel class="form-left">
                  <zn-views-tabs
                    :options="viewsTabsOptions"
                    @upTable="getHeader"
                  />
                </zn-query-form-left-panel>
                <zn-query-form-right-panel class="form-right">
                  <!-- 搜索 -->
                  <zn-search-btn @up-Search="upSearch" />
                  <!-- 筛选 -->
                  <zn-screen-btn
                    ref="ZnScreenBtn"
                    :mark="mark"
                    :views_id="queryForm.views_id"
                    :options="managementOptions"
                    @upTable="upTable"
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
                    v-permissions="{
                      permission: ['system:dataManagement:relationAdd'],
                    }"
                    @click="showMemeberDrawer"
                  >
                    <zn-icon :iconName="'icon-add'" />
                    <span>关联成员</span>
                  </el-button>
                </zn-query-form-right-panel>
              </zn-query-form>
              <!-- 相册试图页面 -->
              <div
                v-if="viewsType === 'gallery'"
                class="content-view album-view"
                v-infinite-scroll="loadMore"
              >
                <zn-filter-album
                  ref="filterAlbum"
                  :albumData="tableList"
                  :finallyColumns="finallyColumns"
                  :showLabel="showLabel"
                  :indexColumn="indexColumn"
                />
              </div>
              <!-- 表格试图页面 -->
              <div class="content-view table-view" v-else>
                <zn-filter-table
                  v-if="viewsType == 'table'"
                  ref="filterTable"
                  :class="total === 0 ? 'table-view-empty' : ''"
                  :multiple="true"
                  :tableData="tableList"
                  :finallyColumns="finallyColumns"
                  @selectList="getSelect"
                  @fetch-data="fetchData"
                  :defaultPageImgUrl="
                    require('@/assets/images/default_page/pic-3.png')
                  "
                  :defaultPageTips="'暂无关联成员'"
                >
                  <el-button
                    type="text"
                    size="medium"
                    @click="removeMembers"
                    v-permissions="{
                      permission: ['system:dataManagement:relationDel'],
                    }"
                  >
                    <zn-icon :iconName="'icon-del'" />
                    <span>移除成员</span>
                  </el-button>
                </zn-filter-table>
                <zn-pagination
                  v-show="total > 0"
                  :page.sync="queryForm.page"
                  :limit.sync="queryForm.listRows"
                  @pagination="fetchData"
                  :total="total"
                  class="table-pagination"
                />
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <!-- 新增数据组抽屉 -->
    <edit
      ref="edit"
      @fetch-data="getdataList"
      :referenceData="referenceData"
      :modalToBody="false"
    />
    <!-- 关联成员 -->
    <DataMember ref="dataMember" @fetch-data="fetchData" :modalToBody="false" />
  </div>
</template>
<script>
import Edit from './components/addDataManagement'
import DataMember from './components/dataMember.vue'
import { tplList } from '@/api/system/roleManagement'
import { details, dataUser } from '@/api/system/dataManagement'
import { getList, editData, doDelete, dataMember } from '@/api/system/data'
import { getTableHeader, viewsTabs, filters } from '@/api/index'
import { authTree } from '@/api/system/menuManagement'
import DataInformationDetails from './components/DataInformationDetails'

export default {
  name: 'RoleManagement',
  components: {
    Edit,
    DataMember,
    DataInformationDetails,
  },
  data() {
    return {
      mark: 'AdminUserData', //特定标识,根据业务模块不同,传输的标识也不同,标识由后端定义(或者字典维护)
      isActive: 0, //当前选中数据组
      hoverIndex: '', //鼠标hover数据组
      dataList: [], //数据组列
      deatilsData: {}, //数据组信息
      someoneForm: {
        //修改数据组Form
        name: '',
      },
      infoEmpty: true,
      visible: false,
      viewsType: '', //当前页面显示视图类型
      total: 0,
      tableList: [],
      viewsTabsOptions: [], // viewsTabs数据
      managementOptions: {}, // 字段、卡片管理数据
      listLoading: false,
      queryForm: {
        id: '',
        page: 1,
        listRows: 10,
        keywords: '',
        views_id: '', //当前页面显示视图ID
      },
      currentTab: 'dataInformation',
      dataInformationEdit: false, // 数据组信息编辑开关
      // deatilsPath: '/system/memberManagement/components/memberDeatils', //表格当前行跳转路径（6.28说没详情）
      columns: [], //筛选条件中的数据
      checkList: [], //筛选条件中选中的数据
      moreList: [], //表格复选多选中的数据
      treeData: [], //数据组信息权限树
      referenceData: [], //参考数据组数据
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
    this.getdataList()
    this.getTplList()
  },
  methods: {
    // 不是我不想分开页面,以组件的形式去写这个页面,是东西太多,设计的形式如果
    // 以组件的形式去开发的话,数据来回到处传输,很麻烦,出此下策
    // 左侧相关
    getdataList() {
      getList().then((res) => {
        if (res.code == 200) {
          this.dataList = res['data']
          if (this.dataList.length) {
            this.fetchDataDeatils(this.dataList[0].id)
            this.queryForm.id = this.dataList[0].id //初始值为左侧列表第一个数据组的id
          } else {
            this.infoEmpty = true
          }
        }
      })
    },
    // 当前选中数据组信息(初始默认第一个)
    fetchDataDeatils(id) {
      details({ id: id }).then((res) => {
        this.deatilsData = res.data
        this.infoEmpty = res.data ? false : true
        // this.getAuthTree()
      })
    },
    // 获取点击的数据组拥有的权限树(非编辑状态下)
    getAuthTree() {
      authTree().then((res) => {
        this.treeData = res.data
        // this.$refs.DataInformationDetails.$refs.tree.setCheckedKeys(
        //   this.deatilsData.auth
        // )
      })
    },
    // 获取参考模板树(编辑状态下)
    getTplList() {
      tplList().then((res) => {
        this.referenceData = res.data
      })
    },
    // 切换到编辑状态
    switchEdit() {
      this.dataInformationEdit = true
      // this.$refs.DataInformationDetails.$refs.tree.setCheckedKeys(
      //   this.referenceData[0].auth
      // )
    },
    // 点击节点
    handlerNode(id, index) {
      this.isActive = index
      this.queryForm.id = id
      this.fetchDataDeatils(id) //刷新详情
      this.fetchData() //刷新关联成员列表数据(仅列表)
    },
    // 打开新增抽屉
    openRoleAdd() {
      this.$refs.edit.show()
    },
    // 取消左侧编辑数据组名称
    cancelEditLeft(index) {
      this.$refs.roleEditPopover[index].doToggle() //主动关闭popover
      this.someoneForm.name = ''
    },
    // 编辑
    handlerEdit(id, index) {
      editData({ id: id, name: this.someoneForm.name }).then((res) => {
        if (res.code == 200) {
          this.$notify({
            title: '成功',
            message: '修改成功！',
            type: 'success',
            duration: 1000
          })
          this.someoneForm.name = ''
          this.$refs.roleEditPopover[index].doToggle() //主动关闭popover
          this.visible = false
          this.getdataList()
        }
      })
    },
    // 删除
    handlerDel(item) {
      this.$confirm('确认删除' + `${item.name}` + '数据组？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then((_) => {
        doDelete({ id: item.id }).then((res) => {
          if (res.code == 200) {
            this.$notify({
              title: '成功',
              message: '删除成功！',
              type: 'success',
              duration: 1000
            })
            this.getdataList()
            // 如果在关联成员列表则刷新数据
            if (this.currentTab == 'AssociatedMember') {
              this.getViewsTabs()
            }
            // 更新节点
            if (this.dataList.length >= 2) {
              console.log(this.dataList)
              this.isActive = index === 0 ? 1 : index
              this.queryForm.id = this.dataList[index === 0 ? 1 : index]['id']
              this.fetchDataDeatils(this.queryForm.id) //刷新详情
              this.fetchData() //刷新关联成员列表数据(仅列表)
            }
          }
        })
      })
    },

    // 右侧
    setSwitch(val) {
      this.dataInformationEdit = val
    },
    // tabs切换
    tabClick(tab, event) {
      this.currentTab = tab.name
      if (!this.currentTab == 'dataInformation') {
        this.dataInformationEdit = true
      }
      if (this.currentTab == 'AssociatedMember') {
        this.getViewsTabs()
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
      if (!this.queryForm.id) return
      this.listLoading = true
      const {
        data: { data, total },
      } = await dataUser(this.queryForm)
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
    // 更新条件字段，更新列表数据
    upTable() {
      this.tableList = []
      this.queryForm.page = 1
      this.loadMoreDisable = true
      if (this.viewsType === 'table') {
        this.fetchData()
      }
    },
    // 卡片管理子组件条件返回,更新表格视图
    upCardData(columns, checkList, showLabel) {
      this.columns = columns //所有表头
      this.checkList = checkList //对应表头
      this.showLabel = showLabel //卡片视图中是否显示label
    },

    // 移除成员
    removeMembers() {
      this.$confirm('是否确认移除？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then((_) => {
        dataMember({
          members: this.moreList.map((v) => v.id).join(','),
          op: 1,
          id: this.queryForm.id,
        }).then((res) => {
          if (res.code == 200) {
            this.$notify({
              title: '成功',
              message: '移除成员成功！',
              type: 'success',
              duration: 1000
            })
            this.fetchData()
          }
        })
      })
    },
    // 打开关联成员抽屉
    showMemeberDrawer() {
      let id = this.queryForm['id']
      let { name } = this.dataList.find((item) => {
        return item['id'] === id
      })
      this.$refs['dataMember'].show(id, name)
    },
  },
}
</script>
<style lang="scss">
.role-tree-popover {
  transform: translate(25px, 10px);
}

.role-edit-popover {
  transform: translateX(-100px);
}
</style>
<style lang="scss" scoped>
.role-container {
  height: $base-keep-alive-height;
  box-shadow: none;
  overflow: hidden;
  background: none !important;

  &:hover {
    box-shadow: none !important;
  }

  .role-row {
    height: 100%;

    // 左侧
    .role-col-left {
      height: 100%;
      position: relative;

      .card-wrap {
        height: 100%;
        border-radius: 8px;
        box-shadow: none;
        margin-bottom: 0 !important;
        border: 1px solid $base-line-2;
        padding: 0;

        ::v-deep .el-card__body {
          height: calc(100% - 56px);
          overflow-y: hidden;
          padding: 16px 0;
          &:hover{
            overflow-y: overlay;
          }
        }

        ::v-deep .zn-query-form {
          padding-top: 0;
        }

        ::v-deep .el-card__header {
          height: 56px;
          font-weight: 500;
          font-size: 16px;
          padding-right: 0;
          background: $base-fill-3;
          color: $base-text-5;
        }

        //   tree
        .role-tree-views {
          position: relative;
          overflow-y: hidden;
          height: calc(100% - 56px);
          padding: 0 16px;
          &:hover{
            overflow-y: overlay;
          }
          .role-li {
            height: 54px;
            line-height: 54px;
            padding: 0 10px;
            display: flex;
            justify-content: space-between;
            color: $base-text-5;
            cursor: pointer;

            // background: #e6effb;
            &:hover {
              background: $base-fill-2;
              border-radius: $base-border-radius-4;
            }

            .is-active {
              color: $base-main-tone;
            }

            .more-pop {
              display: none;
            }
          }

          .role-li-active {
            background: #e6effb;
            border-radius: 4px;
          }

          .role-li:hover {
            .more-pop {
              display: block;
            }
          }
        }

        .role-footer {
          width: 100%;
          text-align: center;

          .el-button {
            width: 80%;
            height: 40px;
            color: $base-text-4;
            background: $base-fill-3;
            border: none;
            border-radius: $base-border-radius-4;
            font-size: 14px;

            &:hover {
              background: $base-fill-4;
            }
          }
        }
      }

      .el-form-item__label {
        font-weight: 500;
      }
    }

    // 右侧
    .role-col-right {
      height: 100%;

      .el-more {
        z-index: 2;
        top: 18px;
        right: 16px;
        padding: 0 8px;
        line-height: 24px;
        cursor: pointer;
        color: $base-text-5;
        font-size: 14px;
        font-weight: 400;

        .zn-icon {
          vertical-align: -4px;
        }

        span {
          vertical-align: middle;
        }
      }

      .tab-wrap {
        height: 100%;
        border-radius: 8px;
        border: 1px solid $base-line-2;
        box-shadow: none;
        overflow: hidden;
        z-index: 1;

        .form-left {
          ::v-deep .left-panel {
            margin-left: 0;
          }
        }

        .form-right {
          ::v-deep .right-panel {
            margin-right: 0;
          }
        }

        // 自定义 tab 栏
        ::v-deep .el-tabs__header {
          padding: 15px 16px 0;
          background: $base-fill-3;
          border-bottom: 1px solid $base-fill-3;
        }

        ::v-deep.el-tabs__content {
          overflow-y: auto;
        }

        ::v-deep .el-tabs__item {
          min-width: 108px;
          text-align: center;
          height: 44px;
          line-height: 44px;
          font-size: 16px;
          margin-top: 0;
          font-weight: normal;
          border-radius: 4px 4px 0 0;

          &:hover {
            color: $base-text-5 !important;
          }

          &.is-active {
            border-right-color: #fff !important;
            border-left-color: #fff !important;
            color: $base-text-5 !important;
            font-weight: 500;
          }
        }

        ::v-deep .el-tabs__content {
          height: calc(100% - 59px);
          padding: 0;
        }

        ::v-deep .el-tab-pane {
          height: 100%;
          overflow-y: hidden;
          &:hover{
            overflow-y: overlay;
          }
          .el-empty {
            height: 100%;
            .el-empty__description p {
              font-size: 14px;
              color: $base-text-5;
            }
          }
        }

        .page-content-img {
          width: 250px;
        }
      }
    }
  }
}
</style>
