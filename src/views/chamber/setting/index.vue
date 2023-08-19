<template>
  <div class="setting-container parent-container">
    <div class="tabs flex FormList">
      <div class="tab mr-24" :class="currentTab === item.value ? 'active' : ''" v-for="item,index in tabs" :key="index" @click="tabChange(item)">
        {{ item.label }}
      </div>
    </div>
    <div
    v-if="currentTab === 1"
      :class="{ chamberform: true, edit_is_show: disabledvalue }"
     
    >
      <!-- 图片编辑 -->
      <div class="chamberpicturearea">
        <div :class="disabledvalue ?'picturearea':'pictureareanone'" @click="openCropping()">
          <div class="onepicture" v-if="this.form.logo_url">
            <img :src="this.form.logo_url" class="pictureshow" alt="" />
            <div v-if="this.form.logo_url" class="changepicture">更改图片</div>
          </div>
          <div class="twopicture" v-if="!this.form.logo_url">
            <img
              class="pictureshow"
              src="@/assets/images/chamber_images/Chambernone.png"
              alt=""
            />
          </div>
          <zn-picture-cropping
            ref="znPictureCropping"
            :cutWidth="200"
            :cutHeight="200"
            @uploadImg="uploadImg"
            @uploadCancel="uploadCancel"
          />
        </div>
        <!-- 右边部分 -->
        <div>
          <button class="editbtn" v-if="showedit" @click="editchamber()">
            编辑
          </button>
          <button class="cancelbtn" v-if="showcancel" @click="cancel()">
            取消
          </button>
          <button class="editbtn" v-if="showdeter" @click="submit()">
            确定
          </button>
        </div>
      </div>
      <el-form
        ref="Chamberform"
        :model="form"
        label-width="80px"
        :rules="rules"
        label-position="top"
        :disabled="disabledvalue"
        :class="disabledvalue ? '' : ''"
      >
        <!-- 表单输入框 -->
        <div class="chamberbigform">
          <div class="chamberTop">
            <el-form-item
              
              label="商会名称"
              class="onechamber"
              prop="name"
            >
              <el-input
                v-model="form.name"
                class="chamberinput"
                maxlength="15"
                placeholder="请填写企业名称"
              ></el-input>
            </el-form-item>
            
            <el-form-item label="商会等级" class="twochamber">
              <!-- 可编辑状态 -->
             
              <!-- v-if="!disabledvalue" -->

              <el-select 
                v-model="form.commerce_level"
                placeholder="请选择商会等级"
                style="width: 400px"
                clearable
              >
                <el-option
                  v-for="(item, index) in configData.commerce_level"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <!-- 不可编辑状态 -->
              
              <!-- <el-input
                class="chamberinput"
              
                v-model="detailData.commerce_level.label"
                v-else
                placeholder="请选择商会等级"
              ></el-input> -->
            </el-form-item>
          </div>
          <div class="chamberBottom">
            <!-- <el-form-item label="商会地址" class="onechamber" :prop="disabledvalue?'none':'address'">
              <el-input v-model="form.address" class="chamberinput" placeholder="请填写商会地址"></el-input>
            </el-form-item> -->
            
            <el-form-item label="所在地区" class="onechamber" prop="region">
              <div class="chamberinput">
                <el-cascader
                  :props="props"
                  v-model="region"
                  placeholder="请选择所在地区"
                  @change="handleChange"
                ></el-cascader>
              </div>
            </el-form-item>

            <el-form-item label="详细地址" class="twochamber" prop="address">
              <el-input
                v-model="form.address"
                class="chamberinput"
                placeholder="请填写详细地址"
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <el-form-item label="成立时间" class="onechamber">
          <el-col :span="11">
            <el-date-picker
              type="date"
              placeholder="请选择成立时间"
              v-model="form.found_time"
              format="yyyy/MM/dd"
              value-format="yyyy/MM/dd"
              style="width: 400px"
              class="chamberinput"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="组织描述" :class="disabledvalue?'cannotuse':'onechamber'" prop="description">
          <!-- <el-input
            type="textarea"
            v-model="form.description"
            resize="none"
            :autosize="{ minRows: 10, maxRows: 10 }"
            class="chamberdescribe"
            placeholder="请输入组织描述"
          ></el-input> -->
            
          <wangEdit5
            placeholder="请输入组织描述"
            class="custome-editor"
            :class="validFailRemark ? 'fail' : ''"
            ref="wangEdit"
            :htmlValue="form.description"
            :styleTheme="2"
            @htmlUpdate="htmlUpdate"
          />
        </el-form-item>
        <div class="contact">联系信息</div>
        <div class="chamberTop">
          <el-form-item label="联系人" class="onechamber" prop="contact_name">
            <el-input
              v-model="form.contact_name"
              class="chamberinput"
              maxlength="15"
              placeholder="请填写联系人"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="咨询电话"
            class="twochamber"
            prop="contact_phone"
          >
            <el-input
              v-model="form.contact_phone"
              class="chamberinput"
              placeholder="请填写咨询电话"
              oninput="value=value.replace(/[^0-9.]/g,'')"
              maxlength="11"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <ChamberList v-if="currentTab === 2" ref="chamberList" @openEditDrawer="openEditDrawer"></ChamberList>
    <!-- 编辑成员抽屉 -->
    <edit-chamber v-if="editDrawer" ref="editChamber" @parentUpdate="parentUpdate" @closeDrawer="editDrawer = false"></edit-chamber>
  </div>
</template>

<script>
import { getCommonData, getRegion, login } from '@/api'
import { editChamberList,getChamberList } from '@/api/chamber'
import ChamberList from './components/chamberList.vue'
import editChamber from "./components/editChamber.vue"
import { mapActions, mapGetters } from 'vuex'
import wangEdit5 from '@/components/ZnWangEditor5'
export default {
  components: {
    ChamberList,
    editChamber,
    wangEdit5,
  },

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
    const validateRegion = (rule, value, callback) => {
      if (this.region.length < 3) callback(new Error('请选择省市区'))
      else callback()
    }
    return {
      validFailRemark: false,     // 描述是否验证失败
      editDrawer: false,    // 是否打开成员抽屉
      currentTab: 1,
      tabs: [
        { 
          label: "", 
          value: 1 
        },
        { 
          label: "", 
          value: 2 
        }
      ],
      formvalue:true,
      listvalue:false,
      disabledvalue: true,
      showcancel: false,
      showdeter: false,
      showedit: true,
      changepicture: true,
      clickform: false,
      configData: {},
      region: [], //地区信息
      submitLock: false, //重复提交
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
      detailData: null,   // 详情数据
      form: {
        name: '',
        
        address: '',
        found_time: '',
        delivery: false,
        type: [],
        commerce_level: "",
        description: '',
        contact_name: '',
        contact_phone: '',
        logo_url: '',
        province: '',
        city: '',
        area: '',
      },

      rules: {
        name: [{ required: true, message: '请输入商会名称', trigger: 'blur' }],
        region: [
          { required: true, trigger: 'change', validator: validateRegion },
        ],
        address: [
          { required: true, message: '请输入商会地址', trigger: 'blur' },
        ],
        date1: [
          {
            type: 'date',
            required: true,
            message: '请选择日期',
            trigger: 'change',
          },
        ],
        contact_phone: [
          { required: true, message: '请填写手机号', trigger: 'blur' },
          { message: '必须为数字', trigger: 'change' },
        ],
        type: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个',
            trigger: 'change',
          },
        ],
        contact_name: [
          { required: true, message: '请填写联系人', trigger: 'blur' },
        ],
        description: [
          { required: true, message: '请填写组织描述', trigger: 'blur' },
        ],
      },
    }
  },

  methods: {
    ...mapActions({
      setRecordData: 'recordData/setRecordData',
    }),
    // tab点击事件
    tabChange(item){
      
      this.currentTab = item.value
      this.setRecordData({ key: "ChamberListCheck", value:item.value })
  
    },
    // 获取配置信息
    async getConfigData() {
      getCommonData().then((res) => {
        if (res.code === 200) {
          this.configData = res.data
          if(res.data.current_club_type === 1){
            this.tabs[0].label = "商会信息"
            this.tabs[1].label = "商会班子"
          }else{
            this.tabs[0].label = "社区信息"
            this.tabs[1].label = "领导班子"
          }
        }
      })
      
    },
    provinceFn(id) {
      return getRegion({ parent_code: id }) //请求接口数据
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
    async fetchData(){
      getChamberList().then((res) => {
        if (res.code === 200) {
          this.detailData = res.data
          this.form = res.data 
          this.region=[parseInt(this.form.province.value),parseInt(this.form.city.value),parseInt(this.form.area.value)]
          // this.region=[].concat( parseInt(this.form.province.value),parseInt(this.form.city.value),parseInt(this.form.area.value))
          this.form.commerce_level=this.form.commerce_level.value
          this.form.city=this.form.city.value.toString()
          this.form.province=this.form.province.value.toString()
          this.form.area=this.form.area.value.toString()
          console.log("最开始的",this.region);
          
          console.log("观赏",this.detailData);
          
        }
      })
      
      
    },
    editchamber() {
      this.disabledvalue = false
      this.showedit = false
      this.showdeter = true
      this.showcancel = true
      console.log(this.disabledvalue)
    },
    cancel() {
      this.disabledvalue = true
      this.showedit = true
      this.showdeter = false
      this.showcancel = false
    },
    handleChange(val) {
      console.log("val",val)
  
      this.form.province = val[0]
      this.form.city = val[1]
      this.form.area = val[2]
    },
    //提交图片
    openCropping() {
      this.$refs['znPictureCropping'].openPopOver()
    },

    // 更新上传数据
    uploadImg(data) {
      console.log('122', data)
      this.$nextTick(() => {
        let modal = document.querySelector('body>.v-modal')
        let parentElement = document.querySelector('.member-container')
        parentElement.append(modal)
      })
      this.form.logo_url = data.url
      console.log('123', this.form.logo_url)
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
    submit() {
      
      this.$refs['Chamberform'].validate((valid, Object) => {
        if (valid) {
          if (this.submitLock) return
          this.submitLock = true
          console.log("提交时", this.form)
          // console.log('area',area);
          // return
          // let {province,city,area} = this.form
          
         
          editChamberList({ ...this.form,
            area:this.form.area.toString(),
            city:this.form.city.toString(),
            province:this.form.province.toString()})
            .then((res) => {
              this.$notify({
                title: '成功',
                message: '编辑成功！',
                type: 'success',
                duration: 1000,
              })
              if(res.code===200){
                this.fetchData()
              }
              this.submitLock = false
            })
            .catch((err) => {
              this.submitLock = false
            })
          console.log(this.form)
        }
      })
      this.disabledvalue = true
      this.showedit = true
      this.showdeter = false
      this.showcancel = false
      
    },
    // 打开抽屉
    openEditDrawer(id){
      this.editDrawer = true
      this.$nextTick(() => {
        this.$refs["editChamber"].show(id)
      })
    },
    // 刷新组件
    parentUpdate(){
      this.$refs["chamberList"].fetchData()
    },
   // 富文本内容更新
   htmlUpdate(html) {
      this.form.description = html;
      this.$refs["Chamberform"].validateField("description");
    },
  },
  created() {
    this.getConfigData()
    this.fetchData()
    let { record } = this.$store.state['recordData']
    this.currentTab= record['ChamberListCheck']? record['ChamberListCheck'].value:1
  },
  mounted(){

  }
}
</script>

<style lang="scss" scoped>
.tabs{
  padding: 0 24px;
  border-bottom: solid 1px #F2F3F5;
}
.tab{
  position: relative;
  padding-bottom: 17px;
  font-size: 16px;
  line-height: 22px;
  cursor: pointer;
  &::after{
    display: none;
    content: "";
    width: 36px;
    border-bottom: solid 3px  #005BD9;
    position: absolute;
    bottom: 0;
    left: 50%;
    margin-left: -18px;
  }
  &.active{
    color: #005BD9;
  }
  &.active::after{
    display: block;
  }
}

::v-deep .el-drawer__wrapper {
  position: absolute !important;
  width: 100%;
}
.allchamberinformation {
  border-bottom: solid 1px #999;
  padding-bottom: 17px;
}
.chamberinformation {
  font-size: 16px;
  font-weight: 500;
  line-height: 22px;
  margin: 12px;
  text-align: center;
  background: yellow;
}
.chamberform {
  width: 824px;
  margin: 0 auto;

  padding-top: 24px;
}
.chamberpicturearea {
  width: 816px;
  padding-top: 24px;
  padding-bottom: 24px;
  display: flex;
  justify-content: space-between;
}
.picturearea {
  display: flex;
  height: 80px;
  width: 80px;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  border-radius: 8px;
}
.pictureareanone{
  display: flex;
  height: 80px;
  width: 80px;
  justify-content: center;
  align-items: center;
  pointer-events: fill;
  border-radius: 8px;
}
.pictureshow {
  
  border-radius: 8px;
  height: 100%;
  width: 100%;
}
.onepicture {
  width: 80px;
  height: 80px;
  border: solid 1px #e5e6eb;
  border-radius: 8px;
}
.twopicture {
  width: 80px;
  height: 80px;
  padding: 12px;
  background: #f2f3f5;
  border: solid 1px #e5e6eb;
  border-radius: 8px;
}
.changepicture {
  background: rgba(230, 239, 251, 0.6);
  border-radius: 0 0 8px 8px;
  text-align: center;
  width: 78px;
  height: 20px;
  position: relative;
  bottom: 20px;
  z-index: 3;
  color: #005bd9;
}
.chamberpicture {
  height: 56px;
  width: 56px;
}
.avatar-uploader {
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 22px;
  text-align: center;
}
.avatar {
  width: 80px;
  height: 80px;
  display: block;
}
.editbtn {
  width: 68px;
  height: 36px;
  background: #005bd9;
  color: white;
  font-size: 14px;
  line-height: 22px;
  align-items: center;
  border-radius: 4px;
  border: none;
}
.cancelbtn {
  width: 68px;
  height: 36px;
  background: #f2f3f5;
  margin-right: 10px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: normal;
  line-height: 22px;
  align-items: center;
}
/* 大表单 */
.chamberbigform {
  display: flex;
  flex-direction: column;
}
/* 一个选项 */
.onechamber {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  font-size: 14px;
  font-weight: normal;
  line-height: 22px;
}

.twochamber {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  font-size: 14px;
  font-weight: normal;
  line-height: 22px;
  margin-left: 16px;
}
.cannotuse{
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  font-size: 14px;
  font-weight: normal;
  line-height: 22px;
  pointer-events: none;
}
.chamberTop {
  display: flex;
}
.chamberBottom {
  display: flex;
}
/* 输入框 */
.chamberinput {
  background: #f7f8fa;
  width: 400px;
}

/* 描述 */
.chamberdescribe {
  width: 816px;
  height: 236px;
}
.contact {
  font-size: 18px;
  font-weight: 500;
  color: #1d2129;
  margin-bottom: 16px;
}
.star {
  font-size: 16px;
  font-weight: normal;
  line-height: 24px;
  margin-right: 4px;
  color: #f53f3f;
}
.member-container {
  height: $base-keep-alive-height;
  height: calc(100% - 40px);
}

.batch-button {
  color: $base-Error-6 !important;
}
</style>
  <style lang="scss" scoped>
.edit_is_show .el-form-item__label:before {
  display: none;
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
.custome-editor ::v-deep  .w-e-bar-item:last-child {
  display: none !important;
}
</style>
