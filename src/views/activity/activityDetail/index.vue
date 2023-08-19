<template>
  <div class="detail-container parent-container" v-if="detailData">
    <div class="top flex">
      <div class="top-left">
        <el-carousel trigger="click" height="230px">
          <el-carousel-item v-for="item in detailData.img_url" :key="item">
            <img :src="item" />
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="top-right pl-16">
        <div class="head flex-center-between mb-12">
          <div class="flex-center">
            <span class="head-title mr-12">{{ detailData.name || "--" }}</span>
            <div :class="'head-status status-' + detailData.activity_status" v-if="true">
              <zn-icon
                :iconName="'activity-detail-wait'"
                v-if="detailData.activity_status === 0"
              />
              <zn-icon
                :iconName="'activity-detail-sign'"
                v-if="detailData.activity_status === 1"
              />
              <zn-icon
                :iconName="'activity-detail-ing'"
                v-if="detailData.activity_status === 2"
              />
              <zn-icon
                :iconName="'activity-detail-end'"
                v-if="detailData.activity_status === 3"
              />
              <zn-icon
                :iconName="'activity-detail-cancel'"
                v-if="detailData.activity_status === 4"
              />
              {{ statusMap[detailData.activity_status] }}
            </div>
          </div>
          <div
            class="operate-btns"
            v-permissions="{ permission: ['activity:activityList:edit'] }"
          >
            <el-button class="btn-delete" @click="open" v-if="false">删除活动</el-button>
            <el-button class="btn-preview" v-if="false">预览详情</el-button>
            <el-button class="btn-approved" v-if="false">审核通过</el-button>
            <el-button class="btn-edit" @click="editDrawer = true">编辑活动</el-button>
          </div>
        </div>
        <div class="tags flex mb-20">
          <div class="tag" v-for="(tag, index) in detailData.tag_activity" :key="index">
            {{ tag }}
          </div>
        </div>
        <div class="info flex">
          <div class="info-item flex pt-6 pb-6">
            <span class="info-label">举办单位</span>
            <span class="info-value">{{ detailData.hold_name || "--" }}</span>
          </div>
          <div class="info-item flex pt-6 pb-6">
            <span class="info-label">活动地址</span>
            <span class="info-value">{{ detailData.address || "--" }}</span>
          </div>
          <div class="info-item flex pt-6 pb-6">
            <span class="info-label">活动开始时间</span>
            <span class="info-value">{{ detailData.act_start_time || "--" }}</span>
          </div>
          <div class="info-item flex pt-6 pb-6">
            <span class="info-label">活动结束时间</span>
            <span class="info-value">{{ detailData.act_end_time || "--" }}</span>
          </div>
          <div class="info-item flex pt-6 pb-6">
            <span class="info-label">报名开始时间</span>
            <span class="info-value">{{ detailData.sign_start_time || "--" }}</span>
          </div>
          <div class="info-item flex pt-6 pb-6">
            <span class="info-label">报名截止时间</span>
            <span class="info-value">{{ detailData.sign_end_time || "--" }}</span>
          </div>
          <div class="info-item flex pt-6 pb-6">
            <span class="info-label">开放对象</span>
            <span class="info-value">{{
              detailData.user_range ? detailData.user_range.label : "--"
            }}</span>
          </div>
          <div class="info-item flex pt-6 pb-6">
            <span class="info-label">所属栏位</span>
            <span class="info-value">{{
              detailData.activity_class ? detailData.activity_class.label : "--"
            }}</span>
          </div>
          <div class="info-price">
            <span v-if="detailData.sign_type && detailData.sign_type.value === 0"
              >免费</span
            >
            <span v-else>¥{{ detailData.sign_amount }}/人</span>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div class="table-head flex-center-between mb-4">
        <div class="table-head-text flex-center">
          <span class="number">报人人数</span>
          <span class="circle"></span>
          <span class="number mr-16">{{ detailData.person_count }}人</span>
          <span class="label mr-8">报名上限</span>
          <span>{{ detailData.person_max }}人</span>
        </div>
        <el-button class="btn-notice" v-if="false">一键通知</el-button>
      </div>
      <div class="table-body">
        <table-list :activityId="detailData.id"></table-list>
      </div>
    </div>
    <!-- 添加报名抽屉 -->
    <add-enrollment
      :drawer="enrollmentDrawer"
      @closeDrawer="closeDrawer"
    ></add-enrollment>
    <!-- 编辑活动抽屉 -->
    <edit-activity
      v-if="editDrawer"
      :drawer="editDrawer"
      :activityForm="activityForm"
      @closeDrawer="closeDrawer"
      @updateData="getDetailData"
    ></edit-activity>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { getDetail } from "@/api/activity";
import addEnrollment from "./components/addEnrollment";
import tableList from "./components/tableList";
import editActivity from "@/views/activity/activityList/components/addActivity";
export default {
  name: "ActivityDetail",
  components: {
    addEnrollment,
    tableList,
    editActivity,
  },
  data() {
    return {
      enrollmentDrawer: false, // 编辑报名抽屉
      editDrawer: false, // 编辑活动抽屉
      detailData: null, // 详情数据
      statusMap: {
        0: "未开始",
        1: "报名中",
        2: "进行中",
        3: "已结束",
        4: "已取消",
      },
      activityForm: {
        activity_type: "", // 活动类型
        name: "", // 活动名称
        hold_name: "", // 举办单位
        address: "", // 举报地址
        lng: "", // 活动地址经度
        lat: "", // 活动地址维度
        tag_activity: [], // 活动标签
        img_url: [], // 活动封面
        act_start_time: "", // 活动开始时间
        act_end_time: "", // 活动截止时间
        sign_start_time: "", // 报名开始时间
        sign_end_time: "", // 报名截止时间
        person_max: "", // 报名人数
        activity_class: "", // 所属栏目
        contact_phone: [], // 联系电话
        sign_type: "", // 收费设置
        sign_amount: "", // 收费金额
        description: "", // 活动描述
        user_range: "", // 用户范围
      },
    };
  },
  async created() {
    if (!this.$route.query.id) {
      this.$router.push({
        path: "/activity/activityList",
      });
      return;
    }
    await this.getDetailData();
    // this.getConfigData();
  },
  methods: {
    ...mapActions({
      setRecordData: "recordData/setRecordData",
    }),
    // 获取详情信息
    async getDetailData() {
      getDetail({
        id: this.$route.query.id,
      }).then((res) => {
        let {
          activity_class,
          activity_type,
          sign_type,
          user_range,
          province,
          city,
          area,
        } = res.data;
        let contact_phone = res.data.contact_phone.map((item) => {
          return { value: item };
        });
        this.detailData = res.data;
        // 设置回显数据
        this.activityForm = {
          ...res.data,
          contact_phone,
          sign_amount: res.data.sign_amount ? res.data.sign_amount : "",
          activity_class: activity_class ? activity_class.value : "",
          activity_type: activity_type ? activity_type.value : "",
          sign_type: sign_type ? sign_type.value : "",
          user_range: user_range ? user_range.value : "",
          province: province ? province.value : "",
          city: city ? city.value : "",
          area: area ? area.value : "",
        };
      });
    },
    // 打开报名抽屉
    open() {
      this.enrollmentDrawer = true;
    },
    // 关闭添加抽屉
    closeDrawer() {
      this.enrollmentDrawer = false;
      this.editDrawer = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.status-0 {
  color: $base-Brand1-6;
  background: $base-Brand1-1;
}
.status-1,
.status-2 {
  color: $base-Success-6;
  background: $base-Success-1;
}
.status-3,
.status-4 {
  color: $base-text-5;
  background: $base-fill-4;
}
.top {
  height: 255px;
  margin-bottom: 12px;
  border-bottom: 1px solid $base-line-2;
}
.top-left {
  width: 230px;
  img {
    width: 230px;
    height: 230px;
    border-radius: 8px;
  }
}
.top-right {
  width: calc(100% - 230px);
}
.head-title {
  font-size: 36px;
  font-weight: 500;
  line-height: 44px;
}
.head-status {
  line-height: 30px;
  padding: 0 6px;
  border-radius: 4px;
  .zn-icon {
    margin-right: 0;
  }
}
.operate-btns {
  .el-button {
    font-size: 14px;
    font-weight: 500;
    padding: 0 15px;
    line-height: 34px;
    border-radius: 4px;
    &:hover,
    &:focus {
      background: unset;
    }
  }
  .btn-delete,
  .btn-delete:hover,
  .btn-delete:focus {
    border-color: $base-Error-6;
    color: $base-Error-6;
  }
  .btn-preview,
  .btn-preview:hover,
  .btn-preview:focus {
    border-color: $base-Brand1-6;
    color: $base-Brand1-6;
  }
  .btn-approved,
  .btn-approved:hover,
  .btn-approved:focus {
    color: #fff;
    border-color: $base-Error-6;
    background: $base-Error-6;
  }
  .btn-edit,
  .btn-edit:hover,
  .btn-edit:focus {
    color: #fff;
    border-color: $base-Brand1-6;
    background: $base-Brand1-6;
  }
}
.tag {
  color: $base-text-4;
  font-size: 12px;
  line-height: 26px;
  padding: 0 6px;
  margin-right: 8px;
  border-radius: 4px;
  background: $base-fill-3;
}
.info {
  flex-wrap: wrap;
  line-height: 22px;
  position: relative;
  &-item:nth-child(2n + 1) {
    width: 328px;
  }
  &-item:nth-child(2n + 2) {
    width: calc(100% - 328px);
  }
  &-label {
    min-width: 100px;
    color: $base-text-3;
  }
  &-value {
    padding-right: 10px;
  }
  .info-price {
    line-height: 32px;
    position: absolute;
    right: 0;
    bottom: 0;
    font-size: 24px;
    font-weight: 500;
    color: $base-Error-6;
  }
}
.btn-notice {
  font-size: 14px;
  font-weight: 500;
  padding: 0 15px;
  line-height: 34px;
  border-radius: 4px;
  border-color: $base-Brand1-6;
  color: $base-Brand1-6;
}
.btn-notice:hover,
.btn-notice:focus {
  border-color: $base-Brand1-6;
  color: $base-Brand1-6;
}
.table-head-text {
  line-height: 36px;
  .number {
    font-size: 16px;
    font-weight: 500;
  }
  .circle {
    display: inline-block;
    width: 4px;
    height: 4px;
    margin-left: 4px;
    margin-right: 4px;
    border-radius: 100%;
    background: $base-text-5;
  }
  .label {
    color: $base-text-3;
  }
}
.bottom {
  overflow: hidden;
  height: calc(100% - 267px);
}
.table-body {
  padding-top: 8px;
  height: calc(100% - 40px);
}
</style>
