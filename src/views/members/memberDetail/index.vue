<template>
  <div class="detail-container" v-if="detailData">
    <div class="head flex-between mb-20">
      <div class="head-left flex-center">
        <img :src="detailData.member_info.member_img_url" class="logo" />
        <div class="head-text pl-16">
          <div class="flex-center mb-8">
            <span class="name">{{ detailData.member_person.contact_name || "--" }}</span>
            <el-button :class="'tag tag-' + detailData.member_info.join_status">{{
              statusMap[detailData.member_info.join_status]
            }}</el-button>
          </div>
          <div class="flex mb-8">
            <span class="label">企业名称</span>
            <span class="value">{{ detailData.member_info.member_name || "--" }}</span>
          </div>
          <div class="flex mb-8">
            <span class="label">企业职务</span>
            <span class="value">{{ detailData.member_person.contact_position }}</span>
          </div>
          <div class="flex">
            <span class="label">联系电话</span>
            <span class="value">{{ detailData.member_person.contact_phone }}</span>
          </div>
        </div>
      </div>
      <div class="head-right">
        <div
          class="flex-end"
          v-permissions="{ permission: ['members:memberList:examine'] }"
        >
          <el-button
            type="primary"
            class="btn-type"
            @click="updateStatus(3)"
            v-if="[0, 3, 4].includes(detailData.member_info.join_status)"
            >入会审核</el-button
          >
          <el-button
            type="primary"
            class="btn-type btn-type-line"
            @click="examineDrawer = true"
            v-if="detailData.member_info.join_status === 1"
            >审核不通过</el-button
          >
          <el-button
            type="primary"
            class="btn-type"
            @click="updateStatus(1)"
            v-if="detailData.member_info.join_status === 1"
            >审核通过</el-button
          >
          <el-button
            type="primary"
            class="btn-type btn-type-line"
            @click="updateStatus(4)"
            v-if="detailData.member_info.join_status === 2"
            >退会</el-button
          >
        </div>
        <div class="flex-end" style="margin-top: 34px">
          <div
            class="status-item pay-voucher"
            v-if="detailData.member_order.pay_img_urls.length > 0"
          >
            支付凭证<span>{{ detailData.member_order.pay_img_urls.length || 0 }}</span>
            <div class="pay-voucher-image">
              <el-image
                :src="detailData.member_order.pay_img_urls[0]"
                :preview-src-list="detailData.member_order.pay_img_urls"
              ></el-image>
            </div>
          </div>
          <div class="status-item ml-16">
            会员积分<span>{{ detailData.member_statistics.total_point || 0 }}</span>
          </div>
          <div class="status-item ml-16">
            参与活动<span>{{ detailData.member_statistics.total_activity || 0 }}</span>
          </div>
          <div class="status-item ml-16">购买商品<span>0</span></div>
        </div>
      </div>
    </div>
    <div class="body">
      <!-- 会员信息 -->
      <div class="content mb-20">
        <div class="flex-center-between mb-8">
          <span class="content-title">会员信息</span>
          <el-button
            class="content-edit"
            type="text"
            @click="editInfo('member')"
            v-if="false"
            v-permissions="{ permission: ['members:memberList:edit'] }"
            >编辑</el-button
          >
        </div>
        <div class="content-info">
          <el-row>
            <el-col :span="8" class="flex-center">
              <div class="label">会员等级</div>
              <div class="value">{{ detailData.member_level.member_level_name }}</div>
            </el-col>
            <el-col :span="8" class="flex-center">
              <div class="label">会员有效期</div>
              <div class="value">
                {{ detailData.member_info.start_time }}-{{
                  detailData.member_info.end_time
                }}
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8" class="flex-center">
              <div class="label">入会时间</div>
              <div class="value">{{ detailData.member_info.join_time }}</div>
            </el-col>
            <el-col :span="8" class="flex-center">
              <div class="label">下期缴费时间</div>
              <div class="value">{{ detailData.member_info.end_time }}</div>
            </el-col>
          </el-row>
        </div>
      </div>
      <!-- 联系人信息 -->
      <div class="content mb-20">
        <div class="flex-center-between mb-8">
          <span class="content-title">联系人信息</span>
          <el-button
            class="content-edit"
            type="text"
            @click="editInfo('contacts')"
            v-permissions="{ permission: ['members:memberList:edit'] }"
            >编辑</el-button
          >
        </div>
        <div class="content-info">
          <el-row>
            <el-col :span="8" class="flex-center">
              <div class="label">联系人姓名</div>
              <div class="value">{{ detailData.member_person.contact_name || "--" }}</div>
            </el-col>
            <el-col :span="8" class="flex-center">
              <div class="label">学历</div>
              <div class="value">
                {{
                  detailData.member_person.degree
                    ? detailData.member_person.degree.label
                    : "--"
                }}
              </div>
            </el-col>
            <!-- <el-col :span="8" class="flex-center">
              <div class="label">会员籍贯</div>
              <div class="value">福建省泉州市</div>
            </el-col> -->
          </el-row>
          <el-row>
            <el-col :span="8" class="flex-center">
              <div class="label">联系电话</div>
              <div class="value">{{ detailData.member_person.contact_phone }}</div>
            </el-col>
            <el-col :span="8" class="flex-center">
              <div class="label">出生年月</div>
              <div class="value">{{ detailData.member_person.birth_day || "--" }}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8" class="flex-center">
              <div class="label">企业职务</div>
              <div class="value">{{ detailData.member_person.contact_position }}</div>
            </el-col>
            <el-col :span="8" class="flex-center">
              <div class="label">民族</div>
              <div class="value">
                {{
                  detailData.member_person.nationality
                    ? detailData.member_person.nationality.label
                    : "--"
                }}
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8" class="flex-center">
              <div class="label">政治面貌</div>
              <div class="value">
                {{
                  detailData.member_person.political_outlook
                    ? detailData.member_person.political_outlook.label
                    : "--"
                }}
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <!-- 企业信息 -->
      <div class="content mb-20">
        <div class="flex-center-between mb-8">
          <span class="content-title">企业信息</span>
          <el-button
            class="content-edit"
            type="text"
            @click="editInfo('enterprise')"
            v-permissions="{ permission: ['members:memberList:edit'] }"
            >编辑</el-button
          >
        </div>
        <div class="content-info">
          <el-row>
            <el-col :span="8" class="flex-center">
              <div class="label">企业名称</div>
              <div class="value">{{ detailData.member_info.member_name || "--" }}</div>
            </el-col>
            <el-col :span="8" class="flex-center">
              <div class="label">企业logo</div>
              <div class="value" v-if="!detailData.member_info.member_img_url">--</div>
              <div class="value logo" v-else>
                <img
                  :src="
                    detailData.member_info.member_img_url + '?imageView2/1/w/100/h/100'
                  "
                />
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8" class="flex-center">
              <div class="label">所属行业</div>
              <div class="value">
                {{
                  detailData.member_info.industry
                    ? detailData.member_info.industry.label
                    : "--"
                }}
              </div>
            </el-col>
            <el-col :span="8" class="flex-center">
              <div class="label">企业规模</div>
              <div class="value">
                {{
                  detailData.member_info.scale ? detailData.member_info.scale.label : "--"
                }}
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8" class="flex-center">
              <div class="label">成立时间</div>
              <div class="value">{{ detailData.member_info.found_time || "--" }}</div>
            </el-col>
            <el-col :span="8" class="flex-center">
              <div class="label">主营业务</div>
              <div class="value">{{ detailData.member_info.main_business || "--" }}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8" class="flex-center">
              <div class="label">企业性质</div>
              <div class="value">
                {{
                  detailData.member_info.nature
                    ? detailData.member_info.nature.label
                    : "--"
                }}
              </div>
            </el-col>
            <el-col :span="8" class="flex-center">
              <div class="label">注册资金</div>
              <div class="value">
                {{
                  detailData.member_info.reg_amount
                    ? detailData.member_info.reg_amount.label
                    : "--"
                }}
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8" class="flex-center">
              <div class="label">总资产</div>
              <div class="value">
                {{
                  detailData.member_info.stage ? detailData.member_info.stage.label : "--"
                }}
              </div>
            </el-col>
            <el-col :span="8" class="flex-center">
              <div class="label">上年产值</div>
              <div class="value" v-if="detailData.member_info.annual_turnover">
                {{ detailData.member_info.annual_turnover + "万元" }}
              </div>
              <div class="value" v-else>--</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8" class="flex-center">
              <div class="label">机构地址</div>
              <div class="value">
                {{
                  detailData.member_info.province
                    ? detailData.member_info.province.label
                    : ""
                }}
                {{ detailData.member_info.city ? detailData.member_info.city.label : "" }}
                {{ detailData.member_info.area ? detailData.member_info.area.label : "" }}
                {{ detailData.member_info.member_address || "--" }}
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <!-- 专委会 -->
      <div class="content content-club">
        <div class="flex-center-between mb-12">
          <span class="content-title">专委会</span>
          <el-button class="content-edit" type="text" v-if="false">更多</el-button>
        </div>
        <div class="content-club">
          <ul class="club-list flex" v-if="detailData.group_list.length > 0">
            <li
              class="club-item"
              v-for="(item, index) in detailData.group_list"
              :key="index"
            >
              <div class="club-info">
                <div class="club-head flex-center">
                  <div class="club-icon flex-column">
                    <img :src="item.img_url" class="img" />
                  </div>
                  <div class="club-text pl-12">
                    <div class="club-name">{{ item.name }}</div>
                    <p class="club-number">{{ item.member_count || 0 }}家企业</p>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <div class="club-empty flex-column" v-else>
            <img src="@/assets/images/empty-club.png" class="club-empty-img" />
            <div class="mt-8">暂无专委会</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 修改企业信息 -->
    <enterprise-info
      v-if="enterpriseDrawer"
      :drawer="enterpriseDrawer"
      :enterpriseForm="enterpriseForm"
      :regionData="regionData"
      :tagsOptions="configData.industry"
      :scaleOptions="configData.scale"
      :natureOptions="configData.nature"
      :amountOptions="configData.reg_amount"
      :stageOptions="configData.stage"
      @closeDrawer="closeDrawer"
      @editForm="editForm"
    ></enterprise-info>
    <!-- 修改联系人信息 -->
    <contacts-info
      v-if="contactsDrawer"
      :drawer="contactsDrawer"
      :contactForm="contactForm"
      :nationalityOptions="configData.nationality"
      :degreeOptions="configData.degree"
      :politicalOptions="configData.political_outlook"
      @closeDrawer="closeDrawer"
      @editForm="editForm"
    ></contacts-info>
    <!-- 审核拒绝弹框 -->
    <examine-info
      v-if="examineDrawer"
      :drawer="examineDrawer"
      @closeDrawer="closeDrawer"
      @submitForm="exmaineChange"
    ></examine-info>
  </div>
</template>

<script>
import { getCommonData } from "@/api";
import { getDetail, editMember, updateMember } from "@/api/members";
import enterpriseInfo from "./components/enterpriseInfo";
import contactsInfo from "./components/contactsInfo";
import examineInfo from "./components/examineInfo";
export default {
  components: {
    enterpriseInfo,
    contactsInfo,
    examineInfo,
  },
  data() {
    return {
      configData: null, // 全局配置
      detailData: null, // 会员详情
      enterpriseDrawer: false, // 是否显示企业信息
      contactsDrawer: false, // 是否显示联系人信息
      examineDrawer: false, // 是否显示拒绝抽屉
      contactForm: null, // 回显联系人信息
      enterpriseForm: null, // 回显企业信息
      regionData: [], // 回显省市区
      statusMap: {
        0: "未加入",
        1: "申请中",
        2: "已入会",
        3: "审核拒绝",
        4: "已退会",
      },
    };
  },
  created() {
    if (!this.$route.query.id) {
      this.$router.push({
        path: "/members/memberList",
      });
      return;
    }
    this.getDetailData();
    this.getConfigData();
  },
  methods: {
    // 获取公用配置
    getConfigData() {
      getCommonData().then((res) => {
        if (res.code === 200) {
          this.configData = res.data;
        }
      });
    },
    // 获取用户信息
    getDetailData() {
      getDetail({
        id: this.$route.query.id,
      }).then((res) => {
        let { member_person, member_info } = res.data;
        this.detailData = res.data;
        // 设置回显数据
        this.contactForm = {
          ...member_person,
          nationality: member_person.nationality ? member_person.nationality.value : "",
          degree: member_person.degree ? member_person.degree.value : "",
          political_outlook: member_person.political_outlook
            ? member_person.political_outlook.value
            : "",
        };
        this.enterpriseForm = {
          ...member_info,
          scale: member_info.scale ? member_info.scale.value : "",
          nature: member_info.nature ? member_info.nature.value : "",
          reg_amount: member_info.reg_amount ? member_info.reg_amount.value : "",
          stage: member_info.stage ? member_info.stage.value : "",
          province: member_info.province ? member_info.province.value : "",
          city: member_info.city ? member_info.city.value : "",
          area: member_info.area ? member_info.area.value : "",
          industry: member_info.industry ? member_info.industry.value : "",
        };
        if (member_info.province && member_info.city && member_info.area) {
          this.regionData = [
            parseInt(member_info.province.value),
            parseInt(member_info.city.value),
            parseInt(member_info.area.value),
          ];
        }
      });
    },
    // 审核不通过
    exmaineChange(remark) {
      updateMember({
        member_id: this.detailData.member_info.member_id,
        audit_remark: remark,
        action: 2,
      }).then((res) => {
        if (res.code === 200) {
          this.updateData();
          this.examineDrawer = false;
        }
      });
    },
    // 更新状态
    updateStatus(type) {
      this.$confirm(`确定改变会员状态？？`, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then((res) => {
        updateMember({
          member_id: this.detailData.member_info.member_id,
          action: type,
        }).then((res) => {
          if (res.code === 200) {
            this.updateData();
          }
        });
      });
    },
    // 编辑用户信息
    editInfo(type) {
      if (type === "enterprise") {
        this.enterpriseDrawer = true;
      } else if (type === "contacts") {
        this.contactsDrawer = true;
      } else {
        return false;
      }
    },
    // 关闭抽屉信息
    closeDrawer() {
      this.examineDrawer = false;
      this.enterpriseDrawer = false;
      this.contactsDrawer = false;
    },
    // 提交联系信息数据
    editForm(data, type) {
      let typeMap = {
        all: 0,
        contact: 2,
        enterprise: 1,
        member: 3,
      };
      editMember({
        member_id: this.detailData.member_info.member_id,
        save_range_type: typeMap[type],
        ...data,
      }).then((res) => {
        if (res.code === 200) {
          this.updateData();
        }
      });
    },
    // 刷新数据
    updateData() {
      this.enterpriseDrawer = false;
      this.contactsDrawer = false;
      this.$notify({
        title: "成功",
        message: "修改成功！",
        type: "success",
        duration: 1000,
      });
      this.getDetailData();
    },
  },
  computed: {
    // 行业标签
    tag_industry() {
      let tags = this.detailData.member_info.tag_industry;
      return tags.length > 0 ? tags.join(",") : "--";
    },
  },
};
</script>
<style>
.el-image-viewer__img {
  max-width: 80% !important;
}
</style>
<style lang="scss" scoped>
.detail-container {
  line-height: 22px;
  margin-right: -24px;
  padding-right: 24px;
}
.head {
  padding-bottom: 24px;
  border-bottom: 1px solid #f2f3f5;
  .logo {
    width: 120px;
    height: 120px;
    border-radius: 8px;
  }
  .name {
    font-size: 20px;
    font-weight: 500;
    margin-right: 4px;
  }
  .tag {
    border: none;
    border-radius: 4px;
    line-height: 24px;
    padding: 0 6px;
    color: $base-text-5;
    background: $base-fill-4;
  }
  .tag-0 {
    color: $base-Warning-6;
    background: $base-Warning-1;
  }
  .tag-1 {
    color: $base-Brand1-1;
    background: $base-Brand1-6;
  }
  .tag-2 {
    color: $base-Success-6;
    background: $base-Success-1;
  }
  .tag-3 {
    color: $base-Error-6;
    background: $base-Error-1;
  }
  .label {
    min-width: 72px;
    color: $base-text-3;
  }
  .btn-type {
    min-width: 60px;
    padding: 0 12px;
    font-size: 14px;
    line-height: 30px;
    border-radius: 4px;
  }

  .btn-type {
    color: #fff;
    background: $base-Brand1-6;
    border: 1px solid $base-Brand1-6;
  }
  .btn-type-line {
    background: #fff;
    color: $base-Brand1-6;
    border: 1px solid $base-Brand1-6;
    &:hover,
    &:focus {
      background: none;
    }
  }
  .status-item {
    border-radius: 8px;
    line-height: 48px;
    padding: 0 24px;
    background: $base-fill-2;
    span {
      margin-left: 14px;
      font-family: D-DIN;
      font-size: 20px;
      font-weight: bold;
    }
  }
  .pay-voucher {
    position: relative;
    cursor: pointer;
    overflow: hidden;
    &-image {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      opacity: 0;
    }
  }
}
.content {
  padding-bottom: 12px;
  border-bottom: 1px solid #f2f3f5;
  &-title {
    font-weight: 500;
  }
  &-edit {
    border: 0;
    padding: 0;
    line-height: 24px;
    color: $base-Brand1-6;
  }
  .el-col {
    padding-top: 8px;
    padding-bottom: 8px;
  }
  .label {
    width: 98px;
    color: $base-text-3;
    flex-shrink: 0;
  }
  .logo {
    margin-top: -7px;
    margin-bottom: -7px;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: 1px solid #e5e6eb;
    overflow: hidden;
  }
}
.content-club {
  border-bottom: none;
  .club-list {
    margin-left: -8px;
    margin-right: -8px;
  }
  .club-item {
    width: 25%;
    padding: 8px;
  }
  .club-info {
    padding: 24px;
    border-radius: 12px;
    background: $base-fill-2;
    .club-icon {
      width: 52px;
      height: 52px;
      border-radius: 8px;
      background: linear-gradient(135deg, #6e55ff -22%, #003cff 100%);
      .img {
        width: 30px;
        height: 30px;
      }
    }
    .club-name {
      line-height: 24px;
      font-weight: 500;
      font-size: 16px;
    }
    .club-number {
      margin-top: 8px;
      color: $base-text-4;
    }
  }
  .club-empty {
    padding: 40px 0;
  }
  .club-empty-img {
    width: 120px;
    height: 120px;
  }
}
</style>
