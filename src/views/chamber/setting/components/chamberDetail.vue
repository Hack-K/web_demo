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
      
      :size="'680'"
    >
    
      <div class="uploadplace">
              <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img src="/src/assets/images/uoloadpicture.png" class="avatar">
               <div>上传图片</div>
              </el-upload>  
      </div>
        <div class="formdata">
        <!-- 大表单 -->
        <el-form :model="form" :rules="rules" class="chamberbigform" label-position="top">
        <el-form-item label="成员姓名"  :label-width="formLabelWidth" class="onechamber" prop="name">
          <el-input v-model="form.name" class="chamberinput" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth" class="onechamber">
          <el-radio v-model="radio" label="男"></el-radio>
          <el-radio v-model="radio" label="女"></el-radio>
        </el-form-item>
        
        <el-form-item label="出生日期" class="onechamber">
                <el-col :span="11">
                  <el-date-picker
                    type="date"
                    placeholder="请选择出生年月"
                    v-model="form.date1"
                    style="width:632px"
                    class="chamberinput"
                  ></el-date-picker>
                </el-col>
              </el-form-item>
        <el-form-item label="商会职务" :label-width="formLabelWidth" prop="duties" class="onechamber">
          <el-input v-model="form.duties" class="chamberinput" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系方式" :label-width="formLabelWidth" class="onechamber">
          <el-input v-model="form.connect" class="chamberinput" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="登陆手机号" :label-width="formLabelWidth" prop="phone" class="onechamber">
          <el-input v-model="form.phone" class="chamberinput" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="展示序号" :label-width="formLabelWidth" prop="number" class="onechamber">
          <el-input v-model="form.number" class="chamberinput" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="成员描述" :label-width="formLabelWidth" prop="desc" class="onechamber">
          <el-input type="textarea" v-model="form.desc" class="chamberinput" autocomplete="off" resize="none"
              :autosize="{ minRows: 10, maxRows: 10 }" placeholder="请输入成员描述"></el-input>
        </el-form-item>
      </el-form>
   
      </div>
            <div class="demo-drawer_footer">
              <el-button @click="cancelForm" class="cancel">取 消</el-button>
              <el-button type="primary" class="submitform" @click="submit" >确定</el-button>
            </div>
    </el-drawer>
    
  </template>
  
<script>
import {getChamberDetail,editChamber} from  '@/api/chamber'

export default {
    props: {
      drawer: {
        type: Boolean,
        default: () => false,
      },
    },
    data() { 
      return {
      table: false,
      dialog: false,
      loading: false,
      radio: '1',
      imageUrl: '',
      form: {
        name: '',
        region: '',
        date1: '',
        duties: '',
        connect:'',
        phone:'',
        number: '',
        desc: ''
      },
      rules:{
        name: [
            { required: true, message: '请输入成员姓名', trigger: 'blur' },
            
          ],
          phone: [
            { required: true, message: '请填手机号', trigger: 'blur' }
          ],
          duties: [
            { required: true, message: '请填写职务', trigger: 'blur' }
          ],
          number: [
            { required: true, message: '请填写序号', trigger: 'blur' }
          ],
          desc: [
            { required: true, message: '请填写组织描述', trigger: 'blur' }
          ],
      },
      formLabelWidth: '80px',
      timer: null,
      }
    },
    methods:{
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
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
    cancelForm(){
      this.$emit("closeDrawer");
    },
    beforeClose(){
      this.$emit("closeDrawer");
    },
     
    }
  }
  </script>

<style scoped>
::v-deep .addChamber{
    position: absolute;
    width: 100%;
    
}
.uploadplace{
  width: 680px;
  margin: auto;
  margin-bottom: 23px;
  
}
.avatar-uploader  {
    
    background: #F2F3F5;
    width: 80px;
    height: 107px;
    text-align: center;
    color: #C9CDD4;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
 
  .avatar {
    width: 40px;
    height: 40px;
    margin: auto;
    margin-top: 21px;
    margin-bottom: 13px;
  }
  
  .formdata{
    width: 680px;
    margin: auto;
  }
  .chamberbigform{
  margin: auto;
  font-size: 14px;
  color: #1D2129;
  line-height: 22px;
  
 
}
.onechamber{
  margin: auto;
  font-size: 14px;
  font-weight: normal;
  line-height: 22px;
}
.chamberinput{
  width: 632px;
}
.demo-drawer_footer{
  position: relative;
  left: 500px;
  padding-top: 10px;
  width: 680px;
  margin: auto;
}
.submitform{
  border-radius: 4px;
  font-size: 14px;
  font-weight: normal;
  line-height: 22px;
}
.cancel{
  border-radius: 4px;
  font-size: 14px;
  font-weight: normal;
  line-height: 22px;
}
  </style>