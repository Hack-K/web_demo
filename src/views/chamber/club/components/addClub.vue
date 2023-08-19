<template>
  <el-drawer
    :title="isEdit ? '编辑专委会' : '新建专委会'"
    :visible.sync="drawer"
    :direction="direction"
    :append-to-body="false"
    :modal-append-to-body="false"
    :close-on-press-escape="false"
    :wrapperClosable="false"
    :before-close="beforeClose"
    :size="680"
  >
    <div class="drawer-body height-100">
      <el-form
        class="club-form height-100"
        ref="clubForm"
        label-position="top"
        label-width="80px"
        :model="form"
        :rules="rules"
      >
        <el-form-item label="专委会名称" prop="name">
          <el-input placeholder="请填写专委会名称" v-model="form.name" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="专委会描述" prop="remark" class="form-editor">
          <wangEdit5
            class="custome-editor"
            :class="validFailRemark ? 'fail' : ''"
            ref="wangEdit"
            :htmlValue="form.remark"
            :styleTheme="2"
            @htmlUpdate="htmlUpdate"
          />
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
import { saveClub } from "@/api/chamber/club"
import wangEdit5 from '@/components/ZnWangEditor5'
export default {
  name: "AddClub",
  components: {
    wangEdit5,
  },
  props: {},
  data() {
    const validateDescript = (rule, value, callback) => {
      // 判断富文本编辑器输入是否为空或回车
      let getText = function (str) {
        return str
          .replace(/<[^<p>]+>/g, '') // 将所有<p>标签 replace ''
          .replace(/<[</p>$]+>/g, '') // 将所有</p>标签 replace ''
          .replace(/&nbsp;/gi, '') // 将所有 空格 replace ''
          .replace(/<[^<br/>]+>/g, '') // 将所有 换行符 replace ''
      }

      let isNullS = function (str) {
        if (str == '') return true
        var regu = '^[ ]+$'
        var re = new RegExp(regu)
        return re.test(str)
      }
      // 举例
      let text = getText(value)
      let result = isNullS(text)
      if (result) {
        this.validFailRemark = true
        return callback('请输入有效内容')
      } else {
        this.validFailRemark = false
        callback()
      }
    }
    return {
      position: '',     // 编辑位置标识
      isEdit: false,    // false:新增  true:编辑
      drawer: false,    // 是否打开抽屉
      direction: "rtl",
      form: {
        img_url: "", // 专委会头像
        name: "", // 专委会名称
        remark: ""
      },
      validFailRemark: false,     // 描述是否验证失败
      rules: {
        name: [{ required: true, trigger: "blur", message: "请输入专委会名称" }],
        remark: [
          {
            required: true,
            trigger: ['blur', 'change'],
            validator: validateDescript,
          },
        ],
      },
    };
  },
  created(){},
  methods: {
    /* 
     * 打开抽屉操作
     * data:回显数据
     * position:位置标识 存在则不复盖currentClub
    */
    // 打开抽屉   
    show(data, position){
      if(data){
        this.isEdit = true
        this.form = {...data}
      }
      if(position){
        this.position = position
      }
      this.drawer = true
    },
    // 关闭抽屉
    close(){
      this.position = ""
      this.drawer = false
    },
    // 富文本内容更新
    htmlUpdate(html) {
      this.form.remark = html;
      this.$refs["clubForm"].validateField("remark");
    },
    // 关闭抽屉前
    beforeClose(){
      this.$emit("closeDrawer");
    },
    // 取消操作
    cancel() {
      this.$refs["clubForm"].clearValidate();
      this.$emit("closeDrawer");
    },
    // 确定操作
    submit() {
      this.$refs["clubForm"].validate((valid, object) => {
        if (valid) {
          saveClub(this.form).then(res => {
            if(res.code === 200){
              // 创建成功刷新
              this.$emit("saveForm", !this.position ? res.data : null, this.isEdit)
            }
          })
        }
      });
    },
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.form-editor{
  height: calc(100% - 130px);
  ::v-deep .el-form-item__content{
    height: 100%;
  }
  
}
.custome-editor{
  height: 100%;
  border-radius: 4px;
  border: 1px solid #E5E6EB;
  overflow: hidden;
  &.fail{
    border: 1px solid #ff4d4f;
  }
}

</style>
