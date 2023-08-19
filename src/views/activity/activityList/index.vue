<template>
  <div class="activity-container parent-container" v-loading="exportLoading">
    <zn-query-form>
      <zn-query-form-left-panel>
        <zn-views-tabs
          :source="'customer'"
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
        <!-- <zn-search-btn @up-Search="upSearch" @closeOtherPopover="closeOtherPopover" /> -->
        <!-- 筛选 -->
        <!-- <zn-screen-btn
          ref="ZnScreenBtn"
          :mark="mark"
          :views_id="queryForm.views_id"
          :options="managementOptions"
          @upTable="fetchData"
        /> -->
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
          ref="addButton"
          type="primary"
          size="medium"
          @click="openAdd"
          v-permissions="{ permission: ['activity:activityList:add'] }"
        >
          <zn-icon :iconName="'icon-add'" />
          新增活动
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
        :defaultPageImgUrl="require('@/assets/images/default_page/pic-currency.png')"
        :defaultPageTips="'暂无数据'"
      >
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
    <!-- 添加活动 -->
    <add-activity
      v-if="addDrawer"
      :drawer="addDrawer"
      :locationData="locationData"
      @closeDrawer="closeDrawer"
      @openMapDrawer="openMapDrawer"
      @updateData="fetchData"
    ></add-activity>
    <!-- 选择地图 -->
    <choose-map
      v-if="mapDrawer"
      ref="chooseMapRef"
      :drawer="mapDrawer"
      @getMarkerLocation="getMarkerLocation"
      @closeMapDrawer="closeMapDrawer"
    ></choose-map>
  </div>
</template>

<script>
import { getList } from "@/api/activity"
import { viewsTabs, getTableHeader, filters } from "@/api/index";
import { mapActions } from "vuex";
import addActivity from "./components/addActivity";
import chooseMap from "./components/chooseMap";

export default {
  name: "allCustomer",
  components: {
    addActivity,
    chooseMap,
  },
  data() {
    return {
      addDrawer: false,  // 添加活动抽屉
      mapDrawer: false,  // 选择地图抽屉
      locationData: null, // 地图回显数据
      mark: "Activity", //特定标识,根据业务模块不同,传输的标识也不同,标识由后端定义(或者字典维护)
      viewsType: "", //当前页面显示视图类型
      total: 0,
      tableList: [],
      viewsTabsOptions: [], // viewsTabs数据
      managementOptions: {}, // 字段、卡片管理数据
      listLoading: false,
      queryForm: {
        page: 1,
        listRows: 100,
        keywords: "",
        views_id: "", //当前页面显示视图ID,
      },
      deatilsPath: "/activity/activityDetail", //表格当前行跳转路径
      columns: [], //筛选条件中的数据
      checkList: [], //筛选条件中选中的数据
      moreList: [], //表格复选多选中的数据
      exportLoading: false,
      recode_key: "ActivityList",
    };
  },
  computed: {
    finallyColumns() {
      if (this.checkList.length > 0) {
        return this.columns.filter((item) => this.checkList.includes(item.label));
      }
    },
  },
  watch: {},
  created() {
    let { record } = this.$store.state["recordData"];
    if (record[this.recode_key]) {
      this.queryForm = record[this.recode_key];
      this.getViewsTabs();
    } else {
      this.getViewsTabs();
    }
  },
  methods: {
    ...mapActions({
      setRecordData: "recordData/setRecordData",
    }),
    // 关闭其他 popover 框
    closeOtherPopover() {
      if (this.$refs["ZnScreenBtn"]) {
        this.$refs["ZnScreenBtn"].closePopover();
      }
    },
    // table顶栏左侧viewsTabs
    getViewsTabs(data) {
      viewsTabs({ mark: this.mark }).then((res) => {
        this.viewsTabsOptions = res.data;
        if (res.code == 200 && res.data.length > 0) {
          if (data) {
            this.queryForm.views_id = data.views_id;
            this.viewsType = data.type;
            this.getHeader({
              id: data.views_id,
              type: data.type,
            });
          } else {
            this.queryForm.views_id = res.data[0].id; // 更新当前页面显示视图ID
            this.viewsType = res.data[0].type; // 更新当前页面显示视图类型
            this.getFilters(); //回显筛选
            this.getHeader();
            this.fetchData();
          }
        }
      });
    },
    // table顶栏右侧字段管理、卡片管理
    async getHeader(obj) {
      getTableHeader({
        mark: this.mark,
        views_id: obj ? obj.id : this.queryForm.views_id,
      }).then((res) => {
        this.managementOptions = res.data; //字段管理、卡片管理
        this.columns = res.data.fields; //table列(未经卡片管理、字段管理筛选的数据)
        if (obj) {
          this.queryForm.views_id = obj.id; // 更新当前页面显示视图ID
          this.viewsType = obj.type; // 更新当前页面显示视图类型
          this.getFilters(); //回显筛选
          this.fetchData(); // 刷新列表
        }
        this.managementOptions.fields.map((item) => {
          if (item.isShow == true) {
            this.checkList.push(item.label);
          }
        });
      });
    },
    // 获取已保存的筛选规则
    getFilters() {
      return
      filters({
        mark: this.mark,
        views_id: this.queryForm.views_id,
      }).then((res) => {
        if (this.$refs.ZnScreenBtn) {
          this.$refs.ZnScreenBtn.form.filters = res.data.filters;
        }
      });
    },
    // 请求table数据
    async fetchData() {
      this.listLoading = true;
      this.setRecordData({ key: this.recode_key, ...this.queryForm });
      const {
        data: { list, total },
      } = await getList(this.queryForm);
      this.tableList = list;
      this.total = total;
      this.listLoading = false;
    },
    // 更新搜索字段,更新table数据
    upSearch(val) {
      this.queryForm.keywords = val;
      this.fetchData();
    },
    // 获取多选选中的table数据(需求未出,功能暂留)
    getSelect(list) {
      this.moreList = list;
    },
    // 卡片管理子组件条件返回,更新表格视图
    upTableData(columns, checkList) {
      this.columns = columns; //所有表头
      this.checkList = checkList; //对应表头
    },
    // 卡片管理子组件条件返回,更新表格视图
    upCardData(columns, checkList, showLabel) {
      this.columns = columns; //所有表头
      this.checkList = checkList; //对应表头
      this.showLabel = showLabel; //卡片视图中是否显示label
    },
    // 打开新建抽屉
    openAdd() {
      this.addDrawer = true;
    },
    // 关闭新建抽屉
    closeDrawer() {
      this.addDrawer = false;
    },
    // 打开地图操作
    openMapDrawer() {
      this.mapDrawer = true;
      setTimeout(() => {
        if (this.locationData) {
          this.$refs["chooseMapRef"].show(this.locationData);
        } else {
          this.$refs["chooseMapRef"].show();
        }
      }, 300);
    },
    // 选择地图-回显获取坐标数据
    getMarkerLocation(data) {
      this.locationData = JSON.parse(JSON.stringify(data));
    },
    // 关闭地图操作
    closeMapDrawer() {
      this.mapDrawer = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.allCustomer-container {
  height: $base-keep-alive-height;
}
.el-button {
  border: none;
  margin-bottom: 0;
}
</style>
