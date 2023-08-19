<template>
  <el-drawer
    :title="'新建成员'"
    :visible="drawer"
    custom-class="addChamber"
    :append-to-body="false"
    :modal-append-to-body="false"
    :before-close="beforeClose"
    :close-on-press-escape="true"
    :wrapperClosable="false"
    :size="680"
  >
    <div class="uploadplace">
      <div class="avatar-uploader" @click="openCropping()">
        <div v-if="this.form.avatar">
          <img :src="this.form.avatar" alt="" />
        </div>
        <div class="havepicture" v-else>
          <img src="@/assets/images/uoloadpicture.png" class="avatar" />
          上传图片
        </div>
      </div>
      <zn-picture-cropping
        ref="znPictureCropping"
        :cutWidth="240"
        :cutHeight="321"
        @uploadImg="uploadImg"
        @uploadCancel="uploadCancel"
      />
    </div>
    <div class="formdata">
      <!-- 大表单 -->
      <el-form
        :model="form"
        :rules="rules"
        class="chamberbigform"
        label-position="top"
        ref="Chamberform"
      >
        <el-form-item
          label="成员姓名"
          :label-width="formLabelWidth"
          class="onechamber"
          prop="real_name"
        >
          <el-input
            maxlength="11"
            v-model="form.real_name"
            class="chamberinput"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="性别"
          :label-width="formLabelWidth"
          class="onechamber"
        >
          <el-radio-group v-model="form.sex">
            <el-radio :label="0">未知</el-radio>
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="出生日期" class="onechamber">
          <el-date-picker
            type="date"
            placeholder="请选择出生年月"
            v-model="form.birth_day"
            value-format="yyyy/MM/dd"
            class="chamberinput"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          label="商会职务"
          :label-width="formLabelWidth"
          prop="position"
          class="onechamber"
        >
          <zn-custome-select
            ref="customeSelect"
            :optionsList="optionsList"
            :optionsValue="form.position"
            placeholderText="请选择商会职务"
            @optionChange="optionChange"
            @optionDelete="optionDelete"
            @optionCreate="optionCreate"
          ></zn-custome-select>
        </el-form-item>
        <el-form-item
          label="联系方式"
          :label-width="formLabelWidth"
          class="onechamber"
        >
          <el-input
            oninput="value=value.replace(/[^0-9.]/g,'')"
            maxlength="11"
            v-model="form.contact_phone"
            class="chamberinput"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="登录手机号"
          :label-width="formLabelWidth"
          prop="phone"
          class="onechamber"
        >
          <el-input
            oninput="value=value.replace(/[^0-9.]/g,'')"
            minlength="11"
            maxlength="11"
            v-model="form.phone"
            class="chamberinput"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="展示序号"
          :label-width="formLabelWidth"
          prop="sequence"
          class="onechamber"
        >
          <el-input
            oninput="value=value.replace(/[^0-9.]/g,'')"
            maxlength="5"
            v-model="form.sequence"
            class="chamberinput"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="成员描述"
          :label-width="formLabelWidth"
          prop="description"
          class="onechamber"
        >
          <el-input
            type="textarea"
            v-model="form.description"
            class="chamberinput"
            autocomplete="off"
            resize="none"
            :autosize="{ minRows: 10, maxRows: 10 }"
            placeholder="请输入成员描述"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="demo-drawer_footer" >
      <button @click="cancelForm" class="cancel">取消</button>
      <button @click="submit" class="submitform" >
        确定
      </button>
    </div>
  </el-drawer>
</template>
  
<script>
import { addChamberList, getChamberSequence } from '@/api/chamber'
import { getPosition, savePosition, delPosition } from '@/api/members'
import {deleteArticle} from '@/api/article'
export default {
  props: {
    drawer: {
      type: Boolean,
      default: () => false,
    },
  },
  
  data() {
    const validatePhone = (rule, value, callback) => {
      if(value === '') callback('登陆手机号未填写')
      if(/^1[3456789]\d{9}$/.test(value)){
        callback()
      }else{
        callback('登陆手机号格式不正确')
      }
    }
    return {
      table: false,
      dialog: false,
      loading: false,
      optionsList: [], // 商会职务列表
      radio: '1',
      imageUrl: '',
      submitLock: false, //重复提交
      sequenceobj: {},
      form: {
        real_name: '',
        birth_day: '',
        sex: 0,
        sequence: '', //序号
        contact_phone: '',
        phone: '',
        position: '',
        description: '',
        avatar: '',
      },
      formdata:'',
      rules: {
        real_name: [
          { required: true, message: '请输入成员姓名', trigger: 'blur' },
        ],
        phone: [{ required: true, message: '手机号格式不正确', trigger: 'blur',validator: validatePhone }],
        sequence: [{ required: true, message: '请填写序号', trigger: 'blur' }],
        position: [{ required: true, message: '请填写职务', trigger: 'blur' }],
        description: [
          { required: true, message: '请填写成员描述', trigger: 'blur' },
        ],
      },
      formLabelWidth: '80px',
      timer: null,
    }
  },
  mounted() {
    
  },
  async created() {
   
    this.getPositionData()
    // this.getConfigData()
    await this.getSequenceData()
    this.formdata=JSON.stringify(this.form)
  },
  methods: {
    async getSequenceData() {
    let { data } = await getChamberSequence()
     if(data < 99999) {
      this.form.sequence = data + 1
     }else{
      this.form.sequence=99999
     }
    
    console.log('什么东西', this.form)
    },
    /* 选项变更 value:选项id */
    optionChange(value) {
      this.form.position = value
    },
    /* 选项删除 id:选项id */
    optionDelete(id) {
      this.delPositionData(id)
    },
    /* 选项创建 text:创建文本 */
    optionCreate(text) {
      this.savePositionData(text)
    },
    /* 获取职位列表 */
    async getPositionData() {
      await getPosition({ is_manager: 1 }).then(async (res) => {
        if (res.code === 200) {
          this.optionsList = res.data
        }
      })
    },
    /* 保存职位列表 */
    async savePositionData(text) {
      await savePosition({
        label: text,
        is_manager: 1,
      }).then(async (res) => {
        if (res.code === 200) {
          await this.getPositionData()
          this.$refs['customeSelect'].$refs['customeInput'].focus()
          // 组件私有逻辑
          this.form.position = res.data
        }
      })
    },
    /* 删除职位列表 */
    async delPositionData(id) {
      await delPosition({
        value: id,
      }).then(async (res) => {
        if (res.code === 200) {
          await this.getPositionData()
          this.$refs['customeSelect'].$refs['customeInput'].focus()
          // 组件私有逻辑
          if (id === this.form.position) {
            this.form.position = ''
          }
        }
      })
    },
    openCropping() {
      this.$refs['znPictureCropping'].openPopOver()
    },
    // 更新上传数据
    uploadImg(data) {
      this.$nextTick(() => {
        let modal = document.querySelector('body>.v-modal')
        let parentElement = document.querySelector('.member-container')
        parentElement.append(modal)
      })
      this.form.avatar = data.url
      console.log('111', this.form.avatar)
      this.$refs['Chamberform'].validateField('logo_url')
    },
    // 取消裁剪
    uploadCancel() {
      this.$nextTick(() => {
        let modal = document.querySelector('body>.v-modal')
        let parentElement = document.querySelector('.member-container')
        parentElement.append(modal)
      })
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    submit() {
      console.log('提交数据')
      this.$refs['Chamberform'].validate((valid, object) => {
        if (valid) {
          if (this.submitLock) return
          this.submitLock = true
          addChamberList({
            ...this.form,
            sequence: parseInt(this.form.sequence),
            position: parseInt(this.form.position),
          })
            .then((res) => {
              this.$notify({
                title: '成功',
                message: '创建成功！',
                type: 'success',
                duration: 1000,
              })
              this.$emit('closeDrawer')
              this.submitLock = false
              this.$parent.fetchData()
            })
            .catch((err) => {
              this.submitLock = false
            })
        }
      })
    },
    cancelForm() {
      // this.$emit('closeDrawer')
      if(this.form){
      this.$confirm('确认取消新增成员', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then( (_) => {
          console
          this.$emit('closeDrawer')
          this.getSequenceData()
        })
        .catch(()=>{
          this.$emit('closeDrawer')
        })
          
        }
    },
    beforeClose() {
      
     
      let form=JSON.stringify(this.form)
      console.log('无变化',form);
      console.log(this.formdata);
      
      if(form==this.formdata){
      this.$emit('closeDrawer')
      console.log("直接关闭");
      }else{
        this.$confirm('确认取消新增成员', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then( (_) => {
          this.$emit('closeDrawer')
          this.getSequenceData()
        })
        .catch(err => {
          this.$correctModal('parent-container')
        })
      }
    },
  },
}
</script>

<style scoped>
::v-deep .addChamber {
  position: absolute;
  
}
.uploadplace {
  margin-bottom: 23px;
}
.avatar-uploader {
  background: #f2f3f5;
  width: 80px;
  height: 107px;
  text-align: center;
  color: #c9cdd4;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar {
  width: 40px;
  height: 40px;
  margin: auto;
  margin-top: 21px;
  margin-bottom: 13px;
}

.chamberbigform {
  font-size: 14px;
  color: #1d2129;
  line-height: 22px;
}
.onechamber {
  font-size: 14px;
  font-weight: normal;
  line-height: 22px;
}

.demo-drawer_footer {
  position: relative;
  left: 495px;
  width: 150px;
  padding-top: 10px;
  
}
.submitform {
  margin-left: 10px;
  border: none;
  background: #005BD9;
  color: white;
  width: 68px;
  height: 36px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: normal;
  line-height: 22px;
}
.cancel {
  
  border: none;
  background: #F2F3F5;
  width: 68px;
  height: 36px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: normal;
  line-height: 22px;
}
</style>