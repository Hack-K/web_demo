<template>
  <el-drawer
    title="修改企业信息"
    :visible.sync="drawer"
    :direction="direction"
    :append-to-body="false"
    :modal-append-to-body="false"
    :close-on-press-escape="false"
    :wrapperClosable="false"
    :before-close="beforeClose"
    :size="680"
  >
    <div class="drawer-body">
      <el-form
        class="enterprise-form"
        ref="enterpriseForm"
        label-position="top"
        label-width="80px"
        :model="form"
        :rules="rules"
      >
        <el-form-item label="企业LOGO">
          <div class="upload-button flex-column" @click="openCropping">
            <img
              :src="form.member_img_url + '?imageView2/1/w/80/h/80'"
              v-if="form.member_img_url"
            />
            <img src="@/assets/images/form-logo.png" class="upload-default" v-else />
          </div>
        </el-form-item>
        <el-form-item label="企业名称" prop="member_name" ref="member_name">
          <el-input placeholder="请填写企业名称" v-model="form.member_name"></el-input>
        </el-form-item>
        <el-form-item label="所属行业">
          <el-select
            v-model="form.industry"
            placeholder="请选择所属行业"
          >
            <el-option
              v-for="(item, index) in tagsOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业规模">
          <el-select v-model="form.scale" placeholder="请选择企业规模">
            <el-option
              v-for="(item, index) in scaleOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主营业务">
          <el-input placeholder="请填写主营业务" v-model="form.main_business"></el-input>
        </el-form-item>
        <el-form-item label="企业性质">
          <el-select v-model="form.nature" placeholder="请选择企业性质">
            <el-option
              v-for="(item, index) in natureOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="注册金额">
          <el-select v-model="form.reg_amount" placeholder="请选择注册金额">
            <el-option
              v-for="(item, index) in amountOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择地区">
                <el-cascader
                  :props="props"
                  v-model="region"
                  placeholder="请选择省市区"
                  size="medium"
                  @change="handleChange"
                ></el-cascader>
              </el-form-item>
        <el-form-item label="详细地址">
          <el-input placeholder="请填写详细地址" v-model="form.member_address"></el-input>
        </el-form-item>
        <el-form-item label="成立时间">
          <el-date-picker
            v-model="form.found_time"
            type="date"
            placeholder="选择日期"
            format="yyyy/MM/dd"
            value-format="yyyy/MM/dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="上年产值">
          <el-input
            placeholder="请填写上年产值"
            v-model="form.annual_turnover"
            oninput="value=value.replace(/[^0-9.]/g,'')"
          >
            <span slot="suffix">万</span>
          </el-input>
        </el-form-item>
        <el-form-item label="总资产">
          <el-select v-model="form.stage" placeholder="请选择总资产">
            <el-option
              v-for="(item, index) in stageOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="drawer-footer">
      <el-button @click="cancel" class="el-cancel">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
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
import { getRegion } from "@/api";
export default {
  props: {
    /* 是否显示抽屉 */
    drawer: {
      type: Boolean,
      default: () => false,
    },
    /* 企业信息回显数据 */
    enterpriseForm: {
      type: Object,
      default: () => null,
    },
    /* 省市区回显 */
    regionData: {
      type: Array,
      default: () => []
    },
    /* 所属行业选型 */
    tagsOptions: {
      type: Array,
      default: () => [],
    },
    /* 企业规模选项 */
    scaleOptions: {
      type: Array,
      default: () => [],
    },
    /* 企业性质选项 */
    natureOptions: {
      type: Array,
      default: () => [],
    },
    /* 注册资金选项 */
    amountOptions: {
      type: Array,
      default: () => [],
    },
    /* 总资产选项 */
    stageOptions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    const validateRegion = (rule, value, callback) => {
      if (this.region.length < 3) callback(new Error("请选择省市区"));
      else callback();
    };
    return {
      direction: "rtl",
      region:[],
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
        province: "", // 省
        city: "", // 市
        area: "", // 区
        member_address: "", // 企业地址
        nature: "", // 企业性质
        main_business: "", // 主营业务
        scale: "", // 企业规模
        found_time: "", // 创立时间
        member_description: "", // 企业简介
        reg_amount: "", // 注册金额
        industry: "", // 行业标签
        annual_turnover: "", // 上年产值
        stage: "", // 总资产
      },
      rules: {
        member_img_url: [{ required: true, trigger: "blur", message: "请上传企业logo" }],
        member_name: [{ required: true, message: "企业名称未填写", trigger: "blur" }],
        region:  [{ required: true, trigger: "change", validator: validateRegion }],
        member_address: [{ required: true, message: "详细地址未填写", trigger: "blur" }],
        industry: [{ required: true, trigger: "change", message: "请选择所属行业" }],
        nature: [{ required: true, message: "企业性质未填写", trigger: "blur" }],
        reg_amount: [{ required: true, trigger: "change", message: "请选择注册资金" }],
        found_time: [{ required: true, message: "成立时间未选择", trigger: "blur" }],
        main_business: [{ required: true, message: "主营业务未填写", trigger: "blur" }],
        scale: [{ required: true, message: "企业规模未填写", trigger: "blur" }],
      },
    };
  },
  created() {
    // 回显数据
    if (this.enterpriseForm) {
      this.form = { ...this.enterpriseForm };
    }
    this.region = this.regionData
  },
  methods: {
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
        let parentElement = document.querySelector(".detail-container");
        parentElement.append(modal);
      });
    },
    // 更新上传数据
    uploadImg(data) {
      this.$nextTick(() => {
        let modal = document.querySelector("body>.v-modal");
        let parentElement = document.querySelector(".detail-container");
        parentElement.append(modal);
      });
      this.form.member_img_url = data.url;
    },
    // 关闭抽屉前
    beforeClose(){
      this.$emit("closeDrawer");
    },
    // 取消操作
    cancel() {
      this.$refs["enterpriseForm"].clearValidate();
      this.$emit("closeDrawer");
    },
    // 确定操作
    submit() {
      this.$refs["enterpriseForm"].validate((valid, object) => {
        if (valid) {
          this.$emit("editForm", this.form, "enterprise");
        }else{
          this.$scrollView(object, this)
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
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
