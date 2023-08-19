<template>
  <div class="person-container" v-loading="exportLoading">
    <!-- 表格试图页面 -->
    <div class="content-view table-view">
      <zn-filter-table
        v-if="viewsType == 'table'"
        ref="filterTable"
        :class="total === 0 ? 'table-view-empty' : ''"
        :multiple="false"
        :tableData="tableList"
        :finallyColumns="finallyColumns"
        :deatilsPath="deatilsPath"
        :maxHeight="'650'"
        @selectList="getSelect"
        @fetch-data="fetchData"
        :defaultPageImgUrl="require('@/assets/images/default_page/pic-currency.png')"
        :defaultPageTips="'暂无数据'"
      >
        <el-button
          type="text"
          size="medium"
          class="delete-btn"
          icon="el-icon-delete"
          @click="openAssignOperator"
        >
          <span>删除</span>
        </el-button>
        <el-button
          type="text"
          size="medium"
          class="notice-btn"
          icon="el-icon-chat-dot-round"
          @click="openAssignOperator"
        >
          <span>通知</span>
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
  </div>
</template>

<script>
import { getPersonList } from "@/api/activity";
import { viewsTabs, getTableHeader, filters } from "@/api/index";
import { mapActions } from "vuex";

export default {
  name: "allCustomer",
  props: {
    activityId: {
      type: [String, Number],
      default: () => "",
    },
  },
  data() {
    return {
      mark: "ActivityOrderSign", //特定标识,根据业务模块不同,传输的标识也不同,标识由后端定义(或者字典维护)
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
        id: ""
      },
      deatilsPath: "", //表格当前行跳转路径
      columns: [], //筛选条件中的数据
      checkList: [], //筛选条件中选中的数据
      moreList: [], //表格复选多选中的数据
      exportLoading: false,
      recode_key: "ActivityDetail",
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
    this.queryForm.id = this.activityId;
    let { record } = this.$store.state["recordData"];
    if (record[this.recode_key]) {
      this.queryForm = record[this.recode_key];
      this.queryForm.id = this.activityId;
      this.getViewsTabs();
    } else {
      this.getViewsTabs();
    }
  },
  methods: {
    ...mapActions({
      setRecordData: "recordData/setRecordData",
    }),
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
      return;
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
      } = await getPersonList(this.queryForm);
      this.tableList = list;
      this.total = total;
      this.listLoading = false;
    },
    // 获取多选选中的table数据(需求未出,功能暂留)
    getSelect(list) {
      this.moreList = list;
    },
    // 打开新建抽屉
    openAdd() {
      this.addDrawer = true;
    },
    // 关闭新建抽屉
    closeDrawer() {
      this.addDrawer = false;
    },
    // 分配客服
    openAssignOperator() {
      this.$refs["assignOperator"].show(this.moreList);
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .filter-table .el-table__row .el-table__cell:first-child .cell{
  padding-left: 10px!important;
}
.person-container,
.content-view {
  height: 100%;
}
/* 自定义样式 */
::v-deep .zn-blinds::before{
    content: '';
    position: absolute;
    left: 0;
    top: 12px;
    right: 0;
    bottom: 10px;
    border: 1px solid #E5E6EB;
    border-radius: 8px;
}
::v-deep .zn-blinds-left{
    font-size: 14px;
    font-weight: 500;
}
::v-deep .zn-blinds-right {
  .zn-icon {
    display: none;
  }
}
.delete-btn,
.delete-btn:hover,
.delete-btn:focus {
  color: $base-Error-6;
}
.notice-btn,
.notice-btn:hover,
.notice-btn:focus {
  color: $base-Brand1-6;
}
</style>
