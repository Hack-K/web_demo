<template>
  <el-drawer
    title="审核不通过"
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
        class="examine-form"
        ref="examineForm"
        label-position="top"
        label-width="80px"
        :model="form"
        :rules="rules"
      >
        <el-form-item label="原因">
          <el-input
            v-model="form.audit_remark"
            type="textarea"
            :autosize="{ minRows: 10, maxRows: 10 }"
            maxlength="200"
            show-word-limit
          ></el-input>
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
  },
  data() {
    return {
      direction: "rtl",
      form: {
        member_id: "",      // 会员id
        audit_remark: "",    // 审核备注
        action: ""          // 状态
      },
      rules: {
        audit_remark: [{ required: true, trigger: "blur", message: "请输入原因" }],
      },
    };
  },
  created(){},
  methods: {
    // 关闭抽屉前
    beforeClose(){
      this.$emit("closeDrawer");
    },
    // 取消操作
    cancel() {
      this.$refs["examineForm"].clearValidate();
      this.$emit("closeDrawer");
    },
    // 确定操作
    submit() {
      this.$emit("submitForm", this.form.audit_remark)
    },
  },
};
</script>

<style lang="scss" scoped></style>
