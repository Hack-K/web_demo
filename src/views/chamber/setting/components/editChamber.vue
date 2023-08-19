<template>
  <el-drawer :title="isEdit ? '编辑详情' : '查看详情'" :visible.sync="drawer" :direction="direction" :append-to-body="false"
    :modal-append-to-body="false" :close-on-press-escape="false" :wrapperClosable="false" :before-close="beforeClose"
    :size="680">
    <div class="drawer-body pl-8 pr-8" :class="isEdit ? '' : 'detail-page'" v-if="detailData">
      <el-form class="manager-form" ref="managerForm" label-position="top" label-width="80px" :model="form"
        :rules="rules">
        <el-form-item>
          <div class="info flex">
            <div class="upload-button flex-column" v-if="!isEdit">
              <div class="upload-img">
                <img v-if="detailData.avatar" :src="detailData.avatar + '?imageView2/1/w/160/h/214'" />
                <img v-else src="@/assets/images/chamber_images/empty-avatar.png"/>
              </div>
            </div>
            <div class="upload-button flex-column" @click="openCropping" v-else>
              <div class="upload-img" v-if="form.avatar">
                <img :src="form.avatar + '?imageView2/1/w/160/h/214'" />
                <div class="upload-img-text">更换图片</div>
              </div>
              <div class="flex-column" v-else>
                <img src="@/assets/images/form-logo.png" class="upload-default" />
                <div class="upload-default-text">上传图片</div>
              </div>
            </div>
            <div class="info-text pl-16">
              <div class="info-name">{{ detailData.real_name }}</div>
              <div class="info-position">商会职务：{{ detailData.position.label }}</div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="成员姓名" prop="real_name" ref="real_name">
          <el-input placeholder="请填写成员姓名" v-model="form.real_name"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-input placeholder="性别" v-model="detailData.sex.label" v-if="!isEdit"></el-input>
          <el-radio-group v-model="form.sex" v-else>
            <el-radio :label="item.value" v-for="item,index in configData.sex_lable" :key="index">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="出生日期">
          <el-date-picker v-model="form.birth_day" type="date" placeholder="选择日期" format="yyyy/MM/dd"
            value-format="yyyy/MM/dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="商会职务" prop="position" ref="position">
          <zn-custome-select 
            ref="customeSelect" 
            :optionWidth="640"
            :optionsList="optionsList" 
            :optionsValue="form.position" 
            placeholderText="请选择商会职务"
            @optionChange="optionChange" 
            @optionDelete="optionDelete" 
            @optionCreate="optionCreate">
          </zn-custome-select>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input placeholder="请填写联系方式" v-model="form.contact_phone" maxlength="11"
            oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="登陆手机号" prop="user_phone" ref="user_phone">
          <el-input placeholder="请填写登陆手机号" v-model="form.user_phone" maxlength="11"
            oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="展示序号" prop="sequence" ref="sequence">
          <el-input placeholder="请填写展示序号" v-model.number="form.sequence" maxlength="5" oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="成员描述" prop="description" ref="description">
          <el-input
            v-model="form.description"
            placeholder="请输入成员描述"
            type="textarea"
            :autosize="{ minRows: 10, maxRows: 10 }"
            maxlength="300"
          ></el-input>
          <!-- show-word-limit -->
        </el-form-item>
      </el-form>
    </div>
    <div class="drawer-footer" v-permissions="{ permission: ['chamber:setting:edit'] }">
      <el-button @click="cancel" class="el-cancel" v-if="isEdit">取消</el-button>
      <el-button type="primary" @click="submit" v-if="isEdit">确定</el-button>
      <el-button type="primary" @click="editDetailData" v-if="!isEdit">编辑</el-button>
    </div>
    <!-- 裁剪商品 -->
    <zn-picture-cropping ref="znPictureCropping" :cutWidth="240" :cutHeight="321" @uploadImg="uploadImg"
      @uploadCancel="uploadCancel" />
  </el-drawer>
</template>

<script>
import { getCommonData } from "@/api";
import { getManager, editManager } from "@/api/chamber/setting"
import { getPosition, savePosition, delPosition } from "@/api/members"
export default {
  data() {
    const validateSequence = (rule, value, callback) => {
      if(value === '') callback('展示排序没有填写')
      if(parseInt(value) > 0){
        callback()
      }else{
        callback('排序必须大于0')
      }
    }
    const validatePhone = (rule, value, callback) => {
      if(value === '') callback('登陆手机号未填写')
      if(/^1[3456789]\d{9}$/.test(value)){
        callback()
      }else{
        callback('登陆手机号格式不正确')
      }
    }
    return {
      direction: "rtl",
      optionsList: [],    // 商会职务列表
      id: "",             //当前用户id
      drawer: false,        // 是否打开抽屉
      isEdit: false,         // 是否编辑状态
      configData: null,       // 全局变量
      detailData: null,     // 商会成员信息
      form: {
        avatar: "", // 企业logo
        real_name: "", // 成员姓名
        sex: 0,
        birth_day: "", // 出生日期
        position: "", // 商会职务
        contact_phone: "", // 联系方式
        user_phone: "", // 登陆手机号
        sequence: "", // 展示排序
        description: "", // 成员描述
      },
      rules: {
        avatar: [{ required: true, trigger: "blur", message: "请上传成员头像" }],
        real_name: [{ required: true, message: "成员姓名未填写", trigger: "blur" }],
        user_phone: [{ required: true,trigger: "blur", validator: validatePhone }],
        position: [{ required: true, trigger: "change", message: "请选择商会职务" }],
        birth_day: [{ required: true, message: "出生日期未选择", trigger: "blur" }],
        contact_phone: [{ required: true, message: "联系方式未填写", trigger: "blur" }],
        sequence: [{ required: true, trigger: "blur", validator: validateSequence }],
        description: [{ required: true, message: "成员描述未填写", trigger: "blur" }],
        
      },
    };
  },
  created() {
    this.getPositionData()
    this.getConfigData()
  },
  methods: {
    /* 选项变更 value:选项id */
    optionChange(value){
      this.form.position = value
    },
    /* 选项删除 id:选项id */
    optionDelete(id){
      this.delPositionData(id)
    },
    /* 选项创建 text:创建文本 */
    optionCreate(text){
      this.savePositionData(text)
    },
    /* 获取职位列表 */
    async getPositionData(){
      await getPosition({is_manager: 1}).then(async res => {
        if(res.code === 200){
          this.optionsList = res.data
        }
      })
    },
    /* 保存职位列表 */
    async savePositionData(text){
      await savePosition({
        label: text,
        is_manager: 1
      }).then(async res => {
        if(res.code === 200){
          await this.getPositionData()
          this.$refs["customeSelect"].$refs["customeInput"].focus()
          // 组件私有逻辑
          this.form.position = res.data
        }
      })
    },
    /* 删除职位列表 */
    async delPositionData(id){
      await delPosition({
        value: id
      }).then(async res => {
        if(res.code === 200){
          await this.getPositionData()
          this.$refs["customeSelect"].$refs["customeInput"].focus()
          // 组件私有逻辑
          if(id === this.form.position){
            this.form.position = ""
          }
        }
      })
    },
    // 打开抽屉
    show(id){
      this.id = id
      this.getDetailData()
      this.drawer = true
    },
    // 关闭抽屉前
    beforeClose() {
      this.drawer = false
      this.$emit("closeDrawer");
    },
    // 获取配置信息
    async getConfigData() {
      getCommonData().then((res) => {
        if (res.code === 200) {
          this.configData = res.data;
        }
      });
    },
    // 获取会员信息
    async getDetailData(){
      await getManager({id: this.id}).then(async res => {
        if(res.code === 200){
          this.detailData = res.data
          this.form = { ...res.data }
          this.form.sex = res.data.sex.value
          this.form.position = res.data.position ? res.data.position.value : '' 
        }
      })
    },
    // 编辑会员信息
    editDetailData(){
      this.isEdit = true
    },
    // 打开裁剪框
    openCropping() {
      this.$refs["znPictureCropping"].openPopOver();
    },
    // 取消裁剪
    uploadCancel() {
      this.$nextTick(() => {
        let modal = document.querySelector("body>.v-modal");
        let parentElement = document.querySelector(".parent-container");
        parentElement.append(modal);
      });
    },
    // 更新上传数据
    uploadImg(data) {
      this.$nextTick(() => {
        let modal = document.querySelector("body>.v-modal");
        let parentElement = document.querySelector(".parent-container");
        parentElement.append(modal);
      });
      this.form.avatar = data.url;
    },
    
    // 取消操作
    cancel() {
      // 设置回显
      this.form = { ...this.detailData }
      this.form.sex = this.detailData.sex.value
      this.form.position = this.detailData.position ? this.detailData.position.value : '' 
      this.isEdit = false
      this.$refs["managerForm"].clearValidate();
    },
    // 确定操作
    submit() {
      this.$refs["managerForm"].validate((valid, object) => {
        if (valid) {
          editManager(this.form).then(res => {
            if(res.code !== 200) return
            if(res.code === 200){
              this.$notify({
                title: "成功",
                message: "修改成功！",
                type: "success",
                duration: 1000,
              });
              this.isEdit = false
              this.getDetailData()
              this.$emit("parentUpdate")
            }
          }).catch(err => {
            // 职位不存在处理
            if(err.code === 331){
              this.getPositionData()
              this.form.position = ""
            }
          })
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
  height: 107px;
  border-radius: 6px;
  overflow: hidden;
  background: $base-fill-3;
  cursor: pointer;
  overflow: hidden;
}
.upload-img{
  width: 100%;
  height: 100%;
  position: relative;
  &-text{
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    color: $base-Brand1-6;
    line-height: 24px;
    text-align: center; 
    font-size: 12px;
    backdrop-filter: blur(10px);
    background: rgba(230, 239, 251, 0.6);
  }
}
.upload-default {
  width: 48px;
  height: 48px;
  &-text{
    color: $base-text-2;
    font-size: 12px;
    line-height: 17px;
  }
}
.info-name{
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  margin-bottom: 6px;
}
.info-position{
  line-height: 22px;
  color: $base-text-3;
}
::v-deep .el-textarea__inner{
  resize: none;
}
// 非编辑状态样式
.detail-page{
  pointer-events: none;
  ::v-deep .el-form-item__label{
    &::before{
      display: none;
    }
  }
  ::v-deep .el-input__suffix-inner{
    pointer-events: none;
  }
  ::v-deep .el-input__inner,
  ::v-deep .el-textarea__inner{
    background-color: $base-fill-2;
    border-color: $base-fill-2;
  }
}
</style>
