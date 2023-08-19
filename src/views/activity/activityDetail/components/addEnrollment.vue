<template>
  <el-drawer
    title="新增报名"
    :visible.sync="drawer"
    :direction="direction"
    :modal-append-to-body="false"
    :close-on-press-escape="false"
    :wrapperClosable="false"
    :before-close="cancel"
    :size="680"
  >
    <el-form
      class="attendance-form"
      ref="addform"
      :model="form"
      :rules="rules"
      label-position="top"
    >
      <el-form-item label="报名人姓名" prop="name">
        <el-input placeholder="请填写报名人姓名" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="报名人电话" prop="name">
        <el-input placeholder="请填写报名人电话" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="退款原因">
        <el-input
          v-model="form.remark"
          type="textarea"
          placeholder="请填写备注"
          :maxlength="200"
          show-word-limit
        ></el-input>
      </el-form-item>
      <div class="drawer-footer">
        <el-button class="el-cancel" @click="cancel">取消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </div>
    </el-form>
  </el-drawer>
</template>

<script>
export default {
  name: "AddEnrollment",
  props: {
    drawer: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      direction: "rtl",
      form: {
        name: "",
        remark: ""
      },
      rules: {
        name: [{ required: true, message: "请输入报名人姓名", trigger: "blur" }],
      },
    };
  },
  methods: {
    // 取消
    cancel() {
      this.$emit("closeDrawer");
    },
    // 提交
    submit() {},
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-textarea__inner {
    min-height: 220px !important;
}
</style>
