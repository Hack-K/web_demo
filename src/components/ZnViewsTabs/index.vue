<template>
  <div class="views-tabs flex-center">
    <div
      class="tab flex-center"
      v-for="(item, index) in options.slice(0, showTabNumber)"
      :key="index"
    >
      <!-- 非编辑页面 -->
      <div class="flex-center" v-if="index !== activeEditIndex">
        <div
          v-if="item.title.length <= 10"
          class="tab-item flex-center"
          :class="{ 'is-active': activeIndex == index }"
          @click="setTabsActive(item, index)"
        >
          <zn-icon :iconName="'icon-form'" v-if="item.type == 'table'" />
          <zn-icon :iconName="'icon-album'" v-if="item.type == 'gallery'" />
          <div class="views-tabs-title overflowOne">{{ item.title }}</div>
        </div>
        <el-tooltip
          class="item"
          effect="dark"
          :content="item.title"
          placement="bottom"
          v-else
        >
          <div
            class="tab-item flex-center"
            :class="{ 'is-active': activeIndex == index }"
            @click="setTabsActive(item, index)"
          >
            <zn-icon :iconName="'icon-form'" v-if="item.type == 'table'" />
            <zn-icon :iconName="'icon-album'" v-if="item.type == 'gallery'" />
            <div class="views-tabs-title overflowOne">{{ item.title }}</div>
          </div>
        </el-tooltip>

        <!-- 更多操作编辑/删除 -->
        <div v-if="item.is_default === 0">
          <el-popover
            popper-class="select-popover"
            placement="bottom-start"
            width="110"
            trigger="click"
          >
            <div class="pop-li">
              <el-button type="text" size="medium" @click="tabRename(item, index)">
                <zn-icon :iconName="'icon-edit'" />
                重命名
              </el-button>
            </div>
            <div class="pop-li">
              <el-button type="text" size="medium" @click="tabDelate(item)">
                <zn-icon :iconName="'icon-del'" />
                删除
              </el-button>
            </div>
            <div slot="reference" class="more-operate flex-column">
              <zn-icon :iconName="'icon-more'" />
            </div>
          </el-popover>
        </div>
      </div>
      <!-- 编辑页面 -->
      <div v-else>
        <el-input
          class="tab-input"
          ref="inputEdit"
          v-model="activeEditTab.title"
          @blur="inputBlur"
        ></el-input>
      </div>
    </div>
    <!-- 更多视图 -->
    <el-popover
      v-if="moreView.length > 0"
      ref="viewPopover"
      popper-class="view-popover"
      placement="bottom-start"
      width="280"
      trigger="click"
    >
      <div class="view-item" v-for="(item, index) in moreView" :key="index">
        <!-- 更多视图非编辑页 -->
        <div
          class="view-item-content flex-center"
          :class="{ active: activeIndex == index + showTabNumber }"
          v-if="index + showTabNumber !== activeEditIndex"
        >
          <div
            class="view-item-text flex-center"
            @click="setTabsActive(item, index + showTabNumber)"
          >
            <zn-icon :iconName="'icon-form'" />
            <div class="view-item-title overflowOne">{{ item.title }}</div>
          </div>
          <el-button
            v-if="item.is_default !== 1"
            type="text"
            size="medium"
            @click.stop="tabRename(item, index + showTabNumber)"
          >
            <zn-icon :iconName="'icon-edit'" />
          </el-button>
          <el-button
            v-if="item.is_default !== 1"
            type="text"
            size="medium"
            @click.stop="tabDelate(item)"
          >
            <zn-icon :iconName="'icon-del'" />
          </el-button>
        </div>
        <!-- 更多视图编辑页 -->
        <div v-else>
          <el-input
            class="tab-more-input"
            ref="inputEdit"
            v-model="activeEditTab.title"
            @blur="inputBlur"
          >
            <zn-icon slot="prefix" :iconName="'icon-form'" />
          </el-input>
        </div>
      </div>
      <div class="view-add-line ml-10"></div>
      <div class="view-add mt-16 mb-16 ml-10">
        <el-button class="view-add-btn" type="text" size="medium" @click="addTabView">
          <zn-icon :iconName="'icon-add'" />
          创建视图
        </el-button>
      </div>
      <div class="tab flex-center" slot="reference">
        <div class="flex-center">
          <div class="tab-item flex-center" :class="{ 'is-active': isActive }">
            <zn-icon :iconName="'icon-form'" />
            <div class="views-tabs-title mr-4">{{ moreView.length }}个视图</div>
            <zn-icon :iconName="'icon-down'" />
          </div>
        </div>
      </div>
    </el-popover>
    <el-button class="add-button flex-column" @click="addTabView" v-if="sourceList.includes(source) && false">
      <zn-icon :iconName="'icon-add'" />
    </el-button>
    <!-- 新建视图 -->
    <zn-add-views-tabs
      v-if="drawer"
      :drawer="drawer"
      :filterOptions="filterOptions"
      :mark="mark"
      :views_id="views_id"
      @close-drawer="closeDrawer"
      @submit-drawer="submitDrawer"
    ></zn-add-views-tabs>
  </div>
</template>

<script>
import { newEditView, newDelView } from "@/api/index";
export default {
  name: "ZnViewsTabs",
  props: {
    source:{
      type: String,
      default: () => ""
    },
    options: {
      type: Array, // viewsTabs数据
      default: () => [],
    },
    filterOptions: {
      type: Object, // 筛选条件数据-新建视图使用
      default: () => {},
    },
    views_id: {
      type: [Number, String], // 视图ID-新建视图使用
      default: () => "",
    },
    mark: {
      type: String, // mark特定标识-新建视图使用
      default: () => "",
    },
  },
  components: {},
  data() {
    return {
      sourceList: ["customer", "callRecord", "myPlan", "myTask", "workOrder", "nursingProject", "nursingRecord", "billManagement","productManagement","orderManagement", "payManagement", "memberManagement"],
      drawer: false, // 打开/关闭新增视图
      showTabNumber: 4, // 默认显示tab数量
      activeIndex: 0, // 当前选中视图 index
      activeMoreIndex: "", // 更多列表选中视图 index
      activeEditIndex: "", // 当前编辑视图 index
      activeEditTab: null, // 当前编辑视图 data数据
    };
  },
  watch: {
    views_id(newVal) {
      if (!newVal) return;
      this.activeIndex = this.options.findIndex((item) => item.id === this.views_id) || 0;
    },
  },
  created() {},
  mounted() {},
  methods: {
    //  当前选中的名称
    setTabsActive(item, index) {
      this.activeIndex = index;
      this.$emit("upTable", item);
      if (this.$refs.viewPopover) {
        this.$refs.viewPopover.doClose();
      }
    },
    // 添加试图
    addTabView() {
      if(this.viewNumber >= this.$store.state.user.viewNumber){
        this.$notify({
          title: '提示',
          message: `新建试图已达上限，升级为高级版解锁更多试图`,
          type: 'warning',
          duration: 2000
        });
        return false
      }
      if (this.$refs.viewPopover) {
        this.$refs.viewPopover.doClose();
      }
      this.drawer = true;
    },
    // 重命名
    tabRename(tab, index) {
      this.activeEditIndex = index;
      this.activeEditTab = tab;
      this.$nextTick(() => {
        this.$refs.inputEdit[0].focus();
      });
    },
    // 删除
    tabDelate(tab) {
      this.activeEditTab = tab;
      this.$confirm("确定删除当前视图？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then((res) => {
        newDelView({
          views_id: tab.id,
        }).then((res) => {
          if (res.code === 200) {
            this.$emit("allUpdate");
            this.$notify({
              title: "成功",
              message: "删除操作成功！",
              type: "success",
              duration: 1000,
            });
          }
        });
      });
    },
    // 编辑完成
    inputBlur() {
      newEditView({
        title: this.activeEditTab.title,
        views_id: this.activeEditTab.id,
      }).then((res) => {
        if (res.code === 200) {
          this.activeEditIndex = "";
          this.activeEditTab = null;
        }
      });
    },
    // 关闭新建视图
    closeDrawer() {
      this.drawer = false;
    },
    // 完成新建视图
    submitDrawer(data) {
      this.drawer = false;
      this.$emit("allUpdate", data);
    },
  },
  computed: {
    // 更多视图是否选中
    isActive() {
      if (this.activeIndex && this.activeIndex >= this.showTabNumber) {
        return true;
      } else {
        return false;
      }
    },
    // 更多视图列表
    moreView() {
      if (this.options.length > this.showTabNumber) {
        return this.options.filter((item, index) => index >= this.showTabNumber);
      } else {
        return [];
      }
    },
    // 非默认视图数量
    viewNumber(){
      return this.options.filter(item => item.is_default === 0).length || 0
    }
  },
};
</script>

<style lang="scss" scoped>
.views-tabs {
  .tab {
    position: relative;
    height: 36px;
    line-height: 36px;
    margin-right: 5px;
    padding-left: 5px;

    &::after {
      position: absolute;
      content: "";
      width: 1px;
      height: 18px;
      top: 9px;
      right: -5px;
      background-color: $base-line-1;
    }
  }
  .views-tabs-title {
    max-width: 140px;
  }
  .views-tabs-title::after {
    display: none;
    position: absolute;
    content: "";
    width: 64%;
    height: 2px;
    left: 50%;
    bottom: -10px;
    transform: translateX(-44%);
    border-radius: 5px 5px 0 0;
    background-color: $base-main-tone;
  }
  /* 选中样式 */
  .is-active {
    color: $base-main-tone;
    .views-tabs-title {
      font-weight: 500;
    }
    .views-tabs-title::after {
      display: block;
    }
  }
  .tab-item {
    position: relative;
    cursor: pointer;
    margin-right: 14px;
  }
  .more-operate {
    width: 16px;
    height: 16px;
    border-radius: 2px;
    color: $base-text-3;
    &:hover,
    &:focus {
      background: $base-fill-3;
    }
    .zn-icon {
      width: 12px;
      height: 12px;
      margin-right: 0;
    }
  }

  /* 视图编辑框 */
  .tab-input {
    ::v-deep .el-input__inner {
      width: 92px;
      height: 22px;
      line-height: 22px;
      padding: 0 4px;
      font-size: 12px;
      border: 1px solid $base-Brand1-6;
    }
  }

  .add-button {
    display: flex !important;
    width: 20px;
    height: 20px;
    padding: 0;
    background: $base-fill-3;
    border: none;
    .zn-icon {
      width: 14px;
      height: 14px;
      margin-right: 0;
    }
  }
}
</style>
<style lang="scss">
/* 更多视图编辑框 */
.tab-more-input {
  .el-input__prefix {
    width: 16px;
    height: 16px;
    top: 50%;
    left: 9px;
    margin-top: -8px;
    color: $base-text-5;
    .zn-icon {
      vertical-align: 0;
    }
  }
  .el-input__inner {
    height: 38px;
    line-height: 38px;
    font-size: 14px;
    border-radius: 4px;
    padding-left: 29px;
    border: 1px solid $base-Brand1-6;
  }
}
</style>
