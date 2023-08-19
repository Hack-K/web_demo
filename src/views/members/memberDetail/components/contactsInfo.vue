<template>
  <el-drawer
    title="修改联系人信息"
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
        ref="contactsForm"
        label-position="top"
        label-width="80px"
        :model="form"
        :rules="rules"
      >
        <el-form-item label="联系人" prop="contact_name" ref="contact_name">
          <el-input placeholder="请填写联系人" v-model="form.contact_name"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="contact_phone" ref="contact_phone">
          <el-input placeholder="请填写联系电话" v-model="form.contact_phone" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="企业职务">
          <el-input placeholder="请填写企业职务" v-model="form.contact_position"></el-input>
        </el-form-item>
        <el-form-item label="出生年月">
          <el-date-picker
            v-model="form.birth_day"
            type="date"
            placeholder="选择出生年月"
            format="yyyy/MM/dd"
            value-format="yyyy/MM/dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="民族">
          <el-select v-model="form.nationality" placeholder="请选择民族">
            <el-option
              v-for="(item, index) in nationalityOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学历">
          <el-select v-model="form.degree" placeholder="请选择学历">
            <el-option
              v-for="(item, index) in degreeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="政治面貌">
          <el-select v-model="form.political_outlook" placeholder="请选择政治面貌">
            <el-option
              v-for="(item, index) in politicalOptions"
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
  </el-drawer>
</template>

<script>
export default {
  props: {
    /* 是否显示抽屉 */
    drawer: {
      type: Boolean,
      default: () => false,
    },
    /* 表单回显数据 */
    contactForm: {
      type: Object,
      default: () => null
    },
    /* 民族选项 */
    nationalityOptions: {
      type: Array,
      default: () => [],
    },
    /* 学历选项 */
    degreeOptions: {
      type: Array,
      default: () => [],
    },
    /* 政治面貌选项 */
    politicalOptions: {
      type: Array,
      default: () => [],
    }
  },
  data() {
    return {
      direction: "rtl",
      form: {
        contact_name: "", // 联系人姓名
        contact_phone: "",   // 联系人电话
        birth_day: "",    // 出生年月
        contact_position: "",   // 企业职务 
        nationality: "",    // 民族
        degree: "",       // 学历
        political_outlook: "",    // 政治面貌
      },
      rules: {
        contact_name: [{ required: true, trigger: "blur", message: "请输入联系人姓名" }],
        contact_phone: [{ required: true, trigger: "blur", message: "请输入联系电话" }],
        contact_position: [
          { required: true, trigger: "blur", message: "请输入企业职务" },
        ],
      },
    };
  },
  created(){
    // 回显数据
    if(this.contactForm){
      this.form = {...this.contactForm}
    }
  },
  methods: {
    // 关闭抽屉前
    beforeClose(){
      this.$emit("closeDrawer");
    },
    // 取消操作
    cancel() {
      this.$refs["contactsForm"].clearValidate();
      this.$emit("closeDrawer");
    },
    // 确定操作
    submit() {
      this.$refs["contactsForm"].validate((valid, object) => {
        if (valid) {
          this.$emit("editForm", this.form, "contact")
        }else{
          this.$scrollView(object, this)
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
