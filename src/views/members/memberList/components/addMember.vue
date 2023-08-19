<template>
  <el-drawer
    :title="title"
    :visible.sync="drawer"
    :direction="direction"
    custom-class="add-member-drawer"
    :append-to-body="false"
    :modal-append-to-body="false"
    :close-on-press-escape="false"
    :wrapperClosable="false"
    :size="'100%'"
    :before-close="beforeClose"
  >
    <div class="member-drawer">
      <div class="drawer-body" v-if="loading">
        <!-- 步进条 -->
        <step :activeStep="activeStep"></step>
        <!-- 表单内容 -->
        <el-form
          class="enterprise-form"
          ref="memberForm"
          label-position="top"
          label-width="80px"
          :model="form"
          :rules="rules"
        >
          <!-- 企业信息表单 -->
          <el-row :gutter="16" class="enterprise-form" v-if="activeStep === 1">
            <el-col class="form-title mt-20 mb-16">完善企业信息</el-col>
            <el-col>
              <el-form-item label="企业LOGO">
                <div class="upload-button flex-column" @click="openCropping">
                  <img
                    :src="form.member_img_url + '?imageView2/1/w/80/h/80'"
                    v-if="form.member_img_url"
                  />
                  <img
                    src="@/assets/images/form-logo.png"
                    class="upload-default"
                    v-else
                  />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="企业名称" prop="member_name" ref="member_name">
                <el-input
                  placeholder="请填写企业名称"
                  v-model="form.member_name"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属行业">
                <el-select
                  v-model="form.industry"
                  placeholder="请选择所属行业"
                >
                  <el-option
                    v-for="(item, index) in configData.industry"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="企业规模">
                <el-select v-model="form.scale" placeholder="请选择企业规模">
                  <el-option
                    v-for="(item, index) in configData.scale"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="主营业务">
                <el-input
                  placeholder="请填写主营业务"
                  v-model="form.main_business"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="企业性质">
                <el-select v-model="form.nature" placeholder="请选择企业性质">
                  <el-option
                    v-for="(item, index) in configData.nature"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="注册资金">
                <el-select v-model="form.reg_amount" placeholder="请选择注册资金">
                  <el-option
                    v-for="(item, index) in configData.reg_amount"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="选择地区">
                <el-cascader
                  :props="props"
                  v-model="region"
                  placeholder="请选择省市区"
                  size="medium"
                  @change="handleChange"
                ></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="详细地址">
                <el-input
                  placeholder="请填写详细地址"
                  v-model="form.member_address"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="成立时间">
                <el-date-picker
                  v-model="form.found_time"
                  type="date"
                  placeholder="请选择成立时间"
                  format="yyyy/MM/dd"
                  value-format="yyyy/MM/dd"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="总资产">
                <el-select v-model="form.stage" placeholder="请选择总资产">
                  <el-option
                    v-for="(item, index) in configData.stage"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="上年产值">
                <el-input
                  placeholder="请填写上年产值"
                  oninput="value=value.replace(/[^0-9.]/g,'')"
                  v-model="form.annual_turnover"
                >
                  <span slot="suffix">万</span>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col class="form-title mt-20 mb-16">单位简介</el-col>
            <el-col>
              <el-form-item label="单位简介">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 6 }"
                  :maxlength="300"
                  show-word-limit
                  placeholder="请输入单位简介"
                  v-model="form.member_description"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 联系人信息表单 -->
          <el-row :gutter="16" class="contacts-form" v-if="activeStep === 2">
            <el-col class="form-title mt-20 mb-16">完善企业信息</el-col>
            <el-col :span="12">
              <el-form-item label="联系人" prop="contact_name" ref="contact_name" key="contact_name">
                <el-input
                  placeholder="请填写联系人"
                  v-model="form.contact_name"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话" prop="contact_phone" ref="contact_phone">
                <el-input
                  placeholder="请填写联系电话"
                  v-model="form.contact_phone"
                  maxlength="11"
                  oninput="value=value.replace(/[^0-9.]/g,'')"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="企业职务">
                <el-input
                  placeholder="请填写企业职务"
                  v-model="form.contact_position"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="出生年月">
                <el-date-picker
                  v-model="form.birth_day"
                  type="date"
                  placeholder="请选择出生年月"
                  format="yyyy/MM/dd"
                  value-format="yyyy/MM/dd"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="民族">
                <el-select v-model="form.nationality" placeholder="请选择民族">
                  <el-option
                    v-for="(item, index) in configData.nationality"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="学历">
                <el-select v-model="form.degree" placeholder="请选择学历">
                  <el-option
                    v-for="(item, index) in configData.degree"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="政治面貌">
                <el-select v-model="form.political_outlook" placeholder="请选择政治面貌">
                  <el-option
                    v-for="(item, index) in configData.political_outlook"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 会员信息表单 -->
          <el-row :gutter="16" class="member-from" v-if="activeStep === 3">
            <el-col class="form-title mt-20 mb-16">选择会员等级</el-col>
            <card-option
              :optionsData="optionsData"
              :optionActive="form.member_level_id"
              @optionChange="optionChange"
            ></card-option>
            <el-col class="form-title mt-20 mb-16">会员有效期</el-col>
            <el-col :span="12">
              <el-form-item class="form-radio">
                <el-radio-group v-model="form.level_time_range">
                  <el-radio
                    v-for="(item, index) in configData.level_time_range"
                    :label="item.value"
                    :key="index"
                    >{{ item.label }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col style="padding-right: 50%">
              <el-form-item>
                <el-input
                  placeholder="请填写指定天数"
                  v-model="form.cycle_num"
                  oninput="value=value.replace(/[^0-9]/g,'')"
                  :disabled="form.level_time_range !== 'manual'"
                >
                  <span slot="suffix">天</span>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="drawer-footer">
      <div class="drawer-footer-body">
        <el-button @click="cancel" class="el-cancel">取消</el-button>
        <el-button
          v-if="activeStep < 3"
          class="el-continue"
          type="primary"
          plain
          @click="nextStep"
        >
          下一步
        </el-button>
        <el-button type="primary" @click="submit" v-if="activeStep === 3">确定</el-button>
      </div>
    </div>
    <!-- 裁剪商品 -->
    <zn-picture-cropping
      ref="znPictureCropping"
      :cutWidth="200"
      :cutHeight="200"
      @uploadImg="uploadImg"
      @uploadCancel="uploadCancel"
    />
  </el-drawer>
</template>

<script>
import { getCommonData, getRegion } from "@/api";
import { addMember, getLevelList } from "@/api/members";
import step from "./step";
import cardOption from "./cardOptions";
export default {
  props: {
    drawer: {
      type: Boolean,
      default: () => false,
    },
  },
  components: {
    step,
    cardOption,
  },
  data() {
    const validateRegion = (rule, value, callback) => {
      if (this.region.length < 3) callback(new Error("请选择省市区"));
      else callback();
    };
    return {
      title: "新增会员",
      direction: "rtl",
      loading: false, // 是否加载完成
      submitLock: false, // 放重复提交
      configData: null, // 全局配置
      activeStep: 1,
      region:[],
      optionsData: [], // 会员等级选项
      props: {
        value: 'value',
        label: 'label',
        lazy: true,
        lazyLoad: (node, resolve) => {
          const { level } = node // node 节点数据
          const nodes = [] // 动态节点
          let id = level == 0 ? '0' : node.value // 0 代表第一次请求
          this.provinceFn(id)
            .then((res) => {
              res.data.map((item) => {
                let area = {
                  value: item.value,
                  label: item.label,
                  leaf: node.level >= 2, //数据层级
                }
                nodes.push(area)
              })
              resolve(nodes) // 回调
            })
            .catch((error) => {
              console.log(error)
            })
        },
      },
      form: {
        member_img_url: "", // 企业logo
        member_name: "", // 企业名称
        industry: "", // 行业标签
        scale: "", // 企业规模
        found_time: "", // 成立时间
        main_business: "", // 主营业务
        nature: "", // 企业性质
        province: "", // 省
        city: "", // 市
        area: "", // 区
        member_address: "", // 详细地址
        reg_amount: "", // 注册资金
        stage: "", // 总资产
        annual_turnover: "", // 上年产值
        member_description: "", // 企业简介
        contact_name: "", // 联系人姓名
        contact_phone: "", // 联系人电话
        contact_position: "", // 联系人职位
        birth_day: "", // 出生日期
        nationality: "", // 民族
        degree: "", // 学历
        political_outlook: "", // 政治面貌
        member_level_id: "", // 会员等级
        level_time_range: "manual", // 会员等级有效期
        cycle_num: "", // 会员有效周期数量
        group_ids: "", // 专委会id
      },
      rules: {
        member_name: [{ required: true, trigger: "blur", message: "请输入姓名" }],
        contact_name: [{ required: true, trigger: "blur", message: "请输入联系人姓名" }],
        contact_phone: [{ required: true, trigger: "blur", message: "请输入联系电话" }],
        // member_img_url: [{ required: true, trigger: "blur", message: "请上传企业logo" }],
        // main_business: [{ required: true, trigger: "blur", message: "请输入主营业务" }],
        // industry: [{ required: true, trigger: "change", message: "请选择所属行业" }],
        // found_time: [{ required: true, trigger: "change", message: "请选择成立时间" }],
        // scale: [{ required: true, trigger: "change", message: "请选择企业规模" }],
        // nature: [{ required: true, trigger: "change", message: "请选择企业性质" }],
        // reg_amount: [{ required: true, trigger: "change", message: "请选择注册资金" }],
        // region:  [{ required: true, trigger: "change", validator: validateRegion }],
        // member_address: [{ required: true, trigger: "blur", message: "请输入详细地址" }],
        // member_description: [
        //   { required: true, trigger: "blur", message: "请输入企业简介" },
        // ],
        // contact_position: [
        //   { required: true, trigger: "blur", message: "请输入企业职务" },
        // ],
      },
    };
  },
  async created() {
    await this.getConfigData();
    await this.getLevelData();
  },
  methods: {
    // 获取配置信息
    async getConfigData() {
      getCommonData().then((res) => {
        if (res.code === 200) {
          this.configData = res.data;
        }
      });
    },
    // 获取会员等级
    async getLevelData() {
      getLevelList().then((res) => {
        if (res.code === 200) {
          this.form.member_level_id = res.data[0].id;
          this.form.cycle_num = res.data[0].cycle_num;
          this.optionsData = res.data.map((item) => {
            return {
              label: item.name,
              value: item.id,
              price: `¥${item.join_amount}/年`,
              icon: item.url,
              cycle_num: item.cycle_num,
            };
          });
        }
        this.loading = true;
      });
    },
    // 获取省市区街道
    provinceFn(id) {
      return getRegion({ parent_code: id })//请求接口数据
    },
    // 省市区联动监听
    handleChange(){
      if(this.region.length < 3) return
      this.form.province = this.region[0]
      this.form.city = this.region[1]
      this.form.area = this.region[2]
    },
    // 打开裁剪框
    openCropping() {
      this.$refs["znPictureCropping"].openPopOver();
    },
    // 取消裁剪
    uploadCancel() {
      this.$nextTick(() => {
        let modal = document.querySelector("body>.v-modal");
        let parentElement = document.querySelector(".member-container");
        parentElement.append(modal);
      });
    },
    // 更新上传数据
    uploadImg(data) {
      this.$nextTick(() => {
        let modal = document.querySelector("body>.v-modal");
        let parentElement = document.querySelector(".member-container");
        parentElement.append(modal);
      });
      this.form.member_img_url = data.url;
      this.$refs["memberForm"].validateField('member_img_url');
    },
    // 选项点击监听
    optionChange(item) {
      this.form.member_level_id = item.value;
      this.form.level_time_range = "manual";
      this.form.cycle_num = item.cycle_num;
    },
    // 取消操作
    cancel() {
      if (this.activeStep === 1) {
        this.$emit("closeDrawer");
      } else {
        this.activeStep = this.activeStep - 1;
      }
      this.$refs["memberForm"].clearValidate();
    },
    // 关闭抽屉前
    beforeClose(){
      this.$emit("closeDrawer");
    },
    // 下一步操作
    nextStep() {
      switch (this.activeStep) {
        case 1:
          this.$refs["memberForm"].validate((valid, object) => {
            if (valid) {
              this.activeStep = 2;
            }else{
              this.$scrollView(object, this)
            }
          });
          break;
        case 2:
          this.$refs["memberForm"].validate((valid, object) => {
            if (valid) {
              this.activeStep = 3;
            }else{
              this.$scrollView(object, this)
            }
          });
          break;
      }
    },
    // 确定操作
    submit() {
      this.$refs["memberForm"].validate((valid, object) => {
        if (valid) {
          if (this.submitLock) return;
          this.submitLock = true;
          addMember(this.form)
            .then((res) => {
              this.$notify({
                title: "成功",
                message: "创建成功！",
                type: "success",
                duration: 1000,
              });
              this.$emit("closeDrawer");
              this.submitLock = false;
              this.$parent.fetchData();
            })
            .catch((err) => {
              this.submitLock = false;
            });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.drawer-body {
  width: 816px;
  margin: auto;
}
.drawer-footer-body {
  width: 816px;
  margin: auto;
  .el-continue {
    width: 83px !important;
  }
}
.form-title {
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
}
.upload-button {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  background: $base-fill-3;
  cursor: pointer;
}
.upload-default {
  width: 40px;
  height: 40px;
}
</style>
