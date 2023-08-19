<template>
  <el-drawer
    title="新建视图"
    :visible.sync="drawer"
    direction="rtl"
    custom-class="drawer"
    :modal-append-to-body="false"
    :close-on-press-escape="false"
    :wrapperClosable="false"
    :before-close="cancel"
    :size="647"
  >
    <el-form ref="addViewForm" label-position="top" :model="addViewForm" :rules="rules">
      <el-form-item label="视图名称" prop="title">
        <el-input
          size="medium"
          placeholder="请输入视图名称"
          maxlength="50"
          v-model="addViewForm.title"
        ></el-input>
      </el-form-item>
      <filter-conditions
        class="mt-20"
        :options="filterOptions"
        :mark="mark"
        :views_id="views_id"
        @upTable="filterUpdate"
      ></filter-conditions>
    </el-form>
    <div class="drawer-footer">
      <el-button class="el-cancel" @click="cancel">取消</el-button>
      <el-button type="primary" @click="submit">提交</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { newAddView } from "@/api/index"
import FilterConditions from "./FilterConditions.vue";
export default {
  components: { FilterConditions },
  name: "ZnAddViewsTabs",
  props: {
    // 打开/关闭抽屉
    drawer: {
      type: Boolean,
      default: () => false,
    },
    filterOptions: {
      type: Object, // 筛选条件数据-新建视图使用
      default: () => {},
    },
    views_id: {
      type: Number, // 视图ID-新建视图使用
      default: () => "",
    },
    mark: {
      type: String, // mark特定标识-新建视图使用
      default: () => "",
    },
  },
  data() {
    return {
      addViewForm: {
        title: "",
        mark: this.mark,
        filters: []
      },
      rules: {
        title: [{ required: true, message: "请输入视图名称", trigger: "blur" }],
      },
    };
  },
  created() {},
  methods: {
    // 更新筛选条件
    filterUpdate(filters){
      this.addViewForm.filters = filters
    },
    // 取消操作
    cancel() {
      this.$emit("close-drawer");
    },
    // 提交操作
    submit() {
      this.$refs["addViewForm"].validate((valid, object) => {
        if (valid) {
          newAddView(this.addViewForm).then(res => {
            if(res.code === 200){
              this.$emit('submit-drawer', {
                views_id: res.data.views_id,
                type: res.data.type || 'table'
              })
              this.$notify({
                title: '成功',
                message: '视图创建成功！',
                type: 'success',
                duration: 1000
              });
            }
          })
        }
      })  
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
