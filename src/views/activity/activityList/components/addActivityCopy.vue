<template>
  <el-drawer
    :title="activityForm ? '编辑活动' : '新增活动'"
    :visible.sync="drawer"
    :direction="direction"
    custom-class="add-member-drawer"
    :append-to-body="false"
    :modal-append-to-body="false"
    :close-on-press-escape="false"
    :wrapperClosable="false"
    :before-close="cancel"
    :size="'100%'"
  >
    <div class="member-drawer" id="ceshi1">
      <div class="drawer-body" id="ceshi2" v-if="configData">
        <!-- 步进条 -->
        <step class="mb-20" :activeStep="activeStep"></step>
        <el-form
          class="enterprise-form"
          ref="activityForm"
          label-position="top"
          label-width="80px"
          :model="form"
          :rules="rules"
        >
          <!-- 活动信息  -->
          <el-row :gutter="16" v-if="activeStep === 1">
            <el-col class="form-title mb-20">选择活动类型</el-col>
            <card-options
              :optionsData="optionsData"
              :optionActive="form.activity_type"
              @optionChange="optionChange"
            ></card-options>
            <el-col class="form-title mb-20 mt-20">完善活动信息</el-col>
            <el-col>
              <el-form-item label="活动名称" prop="name">
                <el-input placeholder="请填写活动名称" v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="举办单位" prop="hold_name">
                <el-input placeholder="请填写举办单位" v-model="form.hold_name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <!-- @focus="openMap" -->
              <el-form-item label="活动地址" prop="address">
                <el-input placeholder="请填写活动地址" v-model="form.address"></el-input>
              </el-form-item>
            </el-col>
            <!-- 自定义标签 -->
            <el-col>
              <el-form-item label="标签">
                <el-tag
                  class="tag-item"
                  v-for="(tag, index) in form.tag_activity"
                  :key="tag + index"
                  closable
                  disable-transitions
                  @close="closeTag(index)"
                >{{ tag }}</el-tag>
                <el-popover
                  ref="popoverTag"
                  popper-class="popover-confirm"
                  v-if="form.tag_activity.length < 4"
                  placement="bottom-start"
                  :visible-arrow="false"
                >
                  <div class="popover-title mb-16">添加标签</div>
                  <el-input
                    ref="tagInput"
                    class="popover-input mb-24 pos-relative"
                    size="medium"
                    placeholder="请输入"
                    maxlength="4"
                    v-model.trim="tagText"
                  >
                    <span slot="suffix">{{ tagText.length }}/4</span>
                  </el-input>
                  <div class="popover-footer flex flex-end">
                    <el-button class="popover-cancel" @click="cancelTag">取消</el-button>
                    <el-button class="popover-submit" type="primary" @click="submitTag">确定</el-button>
                  </div>
                  <el-tag
                    class="tag-item"
                    :class="form.tag_activity.length === 0 ? 'tag-add pointer' : ''"
                    slot="reference"
                    @click="tagClick"
                  >
                    <zn-icon :iconName="'icon-plus'" />
                    <span class="ml-4" v-if="form.tag_activity.length === 0">添加标签</span>
                  </el-tag>
                </el-popover>
              </el-form-item>
            </el-col>
            <!-- 图片上传 -->
            <el-col class="form-title mb-8">封面设置</el-col>
            <el-col class="form-tip mb-20">建议上传尺寸：750*750px</el-col>
            <el-col>
              <el-form-item prop="img_url">
                <div class="form-upload flex">
                  <div class="item-img" v-for="(img, index) in form.img_url" :key="img">
                    <img :src="img" />
                    <div class="remove-img flex-column" @click="removeImg(index)">
                      <zn-icon :iconName="'icon-close'" />
                    </div>
                  </div>
                  <div
                    v-if="form.img_url.length < 5"
                    class="item-img item-add flex-column pointer"
                    @click="openCropping"
                  >
                    <zn-icon :iconName="'callcenter-add'" />
                  </div>
                </div>
              </el-form-item>
            </el-col>
            <el-col class="form-title mb-20">活动设置</el-col>
            <el-col :span="12">
              <el-form-item label="活动开始时间" prop="act_start_time">
                <el-date-picker
                  v-model="form.act_start_time"
                  type="datetime"
                  placeholder="请选择活动开始时间"
                  format="yyyy/MM/dd HH:mm:ss"
                  value-format="yyyy/MM/dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="活动结束时间" prop="act_end_time">
                <el-date-picker
                  v-model="form.act_end_time"
                  type="datetime"
                  placeholder="请选择活动结束时间"
                  format="yyyy/MM/dd HH:mm:ss"
                  value-format="yyyy/MM/dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="报名开始时间" prop="sign_start_time">
                <el-date-picker
                  v-model="form.sign_start_time"
                  type="datetime"
                  placeholder="请选择报名开始时间"
                  format="yyyy/MM/dd HH:mm:ss"
                  value-format="yyyy/MM/dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="报名截止时间" prop="sign_end_time">
                <el-date-picker
                  v-model="form.sign_end_time"
                  type="datetime"
                  placeholder="请选择报名截止时间"
                  format="yyyy/MM/dd HH:mm:ss"
                  value-format="yyyy/MM/dd HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="报名人数上限" prop="person_max">
                <el-input
                  placeholder="请填写报名人数上限"
                  v-model="form.person_max"
                  oninput="value=value.replace(/[^0-9]/g,'')"
                >
                  <span slot="suffix">人</span>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属栏目" prop="activity_class">
                <el-select v-model="form.activity_class" placeholder="请选择所属栏位" >
                  <div class="el-input">
                    <el-input
                      type="text"
                      class="el-input actinput"
                      
                      placeholder="查找或创建选项"
                      v-model="inputdata"
                      @input="upinputdata"
                    ></el-input>
                  </div>
                  <div>
                  <button v-show="!istrue&&inputdata&&labelinformation.length>=1"  class="createoption" @click="createoption(inputdata)">创建选项  <span class="justfor">{{ inputdata }}</span>  </button>
                  
                  </div>
                  
                  <el-option
                  
                    v-for="(item, index) in labelinformation"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  >
                    <div id="selectoption">
                      <span>{{ item.label }}</span>
                      <i class="el-icon-delete"  @click="removeOption(item.value)" id="sctb"></i>
                    </div>
                  </el-option>

                  <div slot="empty" ><el-input
                      type="text"
                      class="el-input"
                      placeholder="查找或创建选项"
                      v-model="inputdata"
                      @input="upinputdata"
                    ></el-input></div>
                  <!-- <div slot="empty" ><button v-show="labelinformation.length===0"  class="createoption" @click="createoption()">创建选项 </button></div> -->
                </el-select>
              </el-form-item>
            </el-col>
            <el-col class="form-title mb-16">咨询电话</el-col>
            <el-col :span="12">
              <el-form-item prop="contact_phone">
                <div class="add-items pt-4" v-if="form.contact_phone.length > 0">
                  <div
                    class="add-item mb-16"
                    v-for="(item, index) in form.contact_phone"
                    :key="index"
                  >
                    <el-input
                      type="text"
                      v-model="item.value"
                      placeholder="请填写电话号码"
                      maxlength="11"
                      oninput="value=value.replace(/[^0-9]/g,'')"
                    ></el-input>
                    <el-button class="del-button" icon="el-icon-delete" @click="delPhone(index)"></el-button>
                  </div>
                </div>
                <el-button
                  class="add-button"
                  size="medium"
                  icon="el-icon-plus"
                  @click="addPhone"
                >添加咨询电话</el-button>
              </el-form-item>
            </el-col>
            <el-col class="form-title mb-16">收费设置</el-col>
            <el-col :span="12">
              <el-form-item class="form-radio">
                <el-radio-group v-model="form.sign_type">
                  <el-radio
                    :label="item.value"
                    v-for="item in configData.sign_type"
                    :key="item.value"
                  >{{ item.label }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col>
              <el-col :span="12" style="padding-left: 0; padding-right: 0">
                <el-form-item>
                  <el-input
                    placeholder="请填写金额"
                    v-model="form.sign_amount"
                    :disabled="form.sign_type === 0"
                    oninput="value=value.replace(/[^0-9.]/g,'')"
                  >
                    <span slot="suffix">元/人</span>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-col>
            <el-col class="form-title mb-16">参与模式</el-col>
            <el-col>
              <el-form-item class="form-checkbox">
                <el-checkbox-group v-model="user_range">
                  <el-checkbox :label="1">仅限会员参加</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 活动详情表单 -->
          <div class="detail-form flex" v-else>
            <div class="detail-left">
              <div class="form-title mb-24">活动介绍</div>
              <div class="detail-editor">
                <el-form-item prop="description">
                  <wang-edit5
                    ref="wangEdit"
                    :htmlValue="form.description"
                    @htmlUpdate="htmlUpdate"
                  />
                </el-form-item>
              </div>
            </div>
            <div class="detail-right">
              <div class="form-title mb-24">活动详情预览</div>
              <div class="mobile">
                <div class="mobile-head">
                  <img :src="require('@/assets/images/activity_images/mobile-head.png')" />
                </div>
                <div class="mobile-body">
                  <div class="mobile-title mb-16">商品详情</div>
                  <div class="mobile-description" v-html="form.description"></div>
                </div>
                <div class="mobile-tabbar">
                  <img :src="require('@/assets/images/activity_images/mobile-tabbar.png')" />
                </div>
              </div>
            </div>
          </div>
        </el-form>
      </div>
    </div>
    <div class="drawer-footer">
      <div class="drawer-footer-body">
        <el-button @click="cancel" class="el-cancel">取消</el-button>
        <el-button
          class="el-continue"
          type="primary"
          plain
          @click="nextStep"
          v-if="activeStep === 1"
        >下一步</el-button>
        <el-button type="primary" @click="submit" v-if="activeStep === 2">确定</el-button>
      </div>
    </div>
    <!-- 裁剪商品 -->
    <zn-picture-cropping
      ref="znPictureCropping"
      :cutWidth="500"
      :cutHeight="500"
      @uploadImg="uploadImg"
      @uploadCancel="uploadCancel"
    />
  </el-drawer>
</template>

<script>

import { getCommonData } from '@/api'
import { saveActivity, postActivity,getActivity ,delActivity} from '@/api/activity'
import step from './step'
import cardOptions from './cardOptions'
import wangEdit5 from '@/components/ZnWangEditor5'
import push from '../../../../../public/static/js/push'
export default {
  props: {
    drawer: {
      type: Boolean,
      default: () => false,
    },
    locationData: {
      type: Object,
      default: () => null,
    },
    activityForm: {
      type: Object,
      default: () => null,
    },
  },
  components: {
    step,
    cardOptions,
    wangEdit5,
  },
  data() {
    const validateContact = (rule, value, callback) => {
      let valid = this.form.contact_phone.filter((item) =>
        item.value.trim()
      ).length
      if (valid) {
        callback()
      } else {
        callback('请输入联系电话')
      }
    }

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
        return callback('请输入有效内容')
      } else {
        callback()
      }
    }
    return {
      direction: 'rtl',
      activeStep: 1, // 步进条
      configData: null, // 全局配置
      optionsData: [], // 活动类型数据
      submitLock: false, // 防重复提交锁
      user_range: [],
      newOption: '',
      inputdata: '',
      istrue: false,
      dropDownValue: '',
      valueMeta: '',
      tagText: '',
      edata: '',
      labelinformation: [
         
        ],
      contact_phone: [], // 联系人回显电话
      form: {
        activity_type: '', // 活动类型
        name: '', // 活动名称
        hold_name: '', // 举办单位
        address: '', // 举报地址
        lng: '', // 活动地址经度
        lat: '', // 活动地址维度
        tag_activity: [], // 活动标签
        img_url: [], // 活动封面
        act_start_time: '', // 活动开始时间
        act_end_time: '', // 活动截止时间
        sign_start_time: '', // 报名开始时间
        sign_end_time: '', // 报名截止时间
        person_max: '', // 报名人数
        activity_class: '', // 所属栏目
        
        labelinformationAll: [
          // { value: 1, label: '文娱活动' },
          // { value: 2, label: '商业活动' },
          // { value: 3, label: '专委活动' },
        ],
        
        contact_phone: [], // 联系电话
        sign_type: '', // 收费设置
        sign_amount: '', // 收费金额
        description: '', // 活动描述
        user_range: '', // 用户范围
      },
      rules: {
        name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        hold_name: [
          { required: true, message: '请输入举办单位', trigger: 'blur' },
        ],
        address: [
          { required: true, message: '请输入举办地址', trigger: 'blur' },
        ],
        tag_activity: [
          {
            type: 'array',
            required: true,
            message: '请添加活动标签',
            trigger: 'change',
          },
        ],
        img_url: [
          {
            type: 'array',
            required: true,
            message: '请添加封面图片',
            trigger: 'change',
          },
        ],
        act_start_time: [
          { required: true, message: '请选择活动开始时间', trigger: 'change' },
        ],
        act_end_time: [
          { required: true, message: '请选择活动结束时间', trigger: 'change' },
        ],
        sign_start_time: [
          { required: true, message: '请选择报名开始时间', trigger: 'change' },
        ],
        sign_end_time: [
          { required: true, message: '请选择报名结束时间', trigger: 'change' },
        ],
        person_max: [
          { required: true, message: '请输入报名人数', trigger: 'blur' },
        ],
        activity_class: [
          { required: true, message: '请选择所属栏目', trigger: 'change' },
        ],
        contact_phone: [
          { required: true, trigger: 'blur', validator: validateContact },
        ],
        description: [
          {
            required: true,
            trigger: ['blur', 'change'],
            validator: validateDescript,
          },
        ],
      },
    }
  },
  async created() {
    if (this.activityForm) {
      this.form = { ...this.activityForm }
    }
    await this.getConfigData()
    this.getActivityData()
  },
  
  methods: {
    getActivityData(){
      
       getActivity().then((res=> {
        console.log(res);
        this.labelinformation=res.data
       }))    
      
    },
    upinputdata(e) {
      console.log(e)
      for (let i = 0; i < this.labelinformation.length; i++) {
        let label = this.labelinformation[i]['label']
        if (label === e) {
          this.istrue = true
          return;
        } else {
          this.istrue = false
        }
      }
      this.edata=e
      // let ise = (element) => element === e;
      // this.form.edata=e
      // let index = this.labelinformation.findIndex(ise) ;
      // if( index === -1 ){
      //    this.istrue =true
      // }else{
      //   this.istrue =false
      // }
      // console.log(this.istrue);
    },
    createoption(inputdata) {
      
      console.log(inputdata);
        postActivity({
          label:inputdata ,
          
        }).then(res => {
          if(res.code!=200){
            return
          }
          this.getActivityData()
          this.inputdata=''
        })

        // this.labelinformation.push({ value: index, label: this.form.edata })
                      
      console.log(this.labelinformation);
      
    },
    //绑定
    dropDownSearch() {
      var _this = this
      _this.valueMeta = []
      _this.labelinformation = _this.labelinformationAll.filter(
        _this.filterSearch
      )
    },
    filterSearch(item) {
      return item.includes(this.dropDownValue)
    },
    // 获取配置信息
    async getConfigData() {
      getCommonData().then((res) => {
        if (res.code === 200) {
          this.configData = res.data
          this.form.activity_type = res.data.activity_type[0].value
          this.form.sign_type = res.data.sign_type[0].value
          this.optionsData = res.data.activity_type.map((item, index) => {
            return {
              ...item,
              icon: require(`@/assets/images/activity_images/type-${
                index + 1
              }.png`),
            }
          })
        }
      })
    },
    // 选择类型监听
    optionChange(item) {
      this.form.activity_type = item.value
    },
    // 打开地图
    openMap() {
      this.$emit('openMapDrawer')
    },
    // 点击添加
    
    tagClick() {
      setTimeout(() => {
        this.$refs['tagInput'].focus()
      }, 100)
    },
    // 删除标签
    closeTag(index) {
      this.form.tag_activity.splice(index, 1)
    },
    // 取消添加
    cancelTag() {
      this.$refs['popoverTag'].doClose()
      this.tagText = ''
    },
    // 取消操作
    submitTag() {
      if (!this.tagText.trim()) return
      this.form.tag_activity.push(this.tagText)
      this.$refs['popoverTag'].doClose()
      this.tagText = ''
    },
    // 打开裁剪框
    openCropping() {
      this.$refs['znPictureCropping'].openPopOver()
    },
    // 更新上传数据
    uploadImg(data) {
      this.$nextTick(() => {
        let modal = document.querySelector('body>.v-modal')
        let parentElement = document.querySelector('.activity-container')
        parentElement.append(modal)
      })
      this.form.img_url.push(data.url)
      this.$refs['activityForm'].validateField('img_url')
    },
    // 取消裁剪
    uploadCancel() {
      this.$nextTick(() => {
        let modal = document.querySelector('body>.v-modal')
        let parentElement = document.querySelector('.activity-container')
        parentElement.append(modal)
      })
    },
    // 删除图片
    removeImg(index) {
      this.form.img_url.splice(index, 1)
    },
    // 富文本内容更新
    htmlUpdate(html) {
      this.form.description = html;
      this.$refs["activityForm"].validateField("description");
    },
    // 删除电话
    delPhone(index) {
      this.form.contact_phone.splice(index, 1)
    },
    // 添加电话
    addPhone() {
      this.form.contact_phone.push({
        value: '',
      })
    },
    //删除活动
    removeOption(val) {
  
      delActivity({
        value: val
      }).then(res =>{
        this.getActivityData()
      })
    },
    // 取消操作
    cancel() {
      if (this.activeStep === 2) {
        this.activeStep = 1
      } else {
        this.$emit('closeDrawer')
      }
      this.$refs['activityForm'].clearValidate()
    },
    // 下一步操作
    nextStep() {
      this.$refs['activityForm'].validate((valid, object) => {
        if (valid) {
          this.activeStep = 2
        }
      })
    },
    onFocusHandler() {
      console.log('666')
    },
    // 确定操作
    submit() {
      this.$refs['wangEdit'].onBlur()
      this.$refs['activityForm'].validate((valid, object) => {
        if (valid) {
          if (this.submitLock) return
          this.submitLock = true
          saveActivity({
            ...this.form,
            user_range: this.user_range.length > 0 ? 1 : 0,
            contact_phone: this.form.contact_phone.map((item) =>
              item.value.trim()
            ),
          })
            .then((res) => {
              if (res.code === 200) {
                this.$notify({
                  title: '成功',
                  message: `${this.activityForm ? '修改' : '创建'}成功！`,
                  type: 'success',
                  duration: 1000,
                })
                this.$emit('updateData')
                this.$emit('closeDrawer')
                this.submitLock = false
              }
            })
            .catch((err) => {
              this.submitLock = false
            })
        }
      })
    },
  },
  watch: {
    locationData(newVal, oldVal) {
      if (newVal) {
        this.form.address = newVal.address
        this.form.lat = newVal.location.lat
        this.form.lng = newVal.location.lng
      }
    },
  },
}
</script>
<style>
.actinput{
  font-size: 14px;
  font-weight: normal;
  line-height: 22px;
}
.justfor{
  font-size: 14px;
  font-weight: normal;
  line-height: 22px;
  color: #1D2129;
  text-align: center;
}
#sctb {
  display: none;
}
#selectoption{
  display: flex;
  align-items: center;
  justify-content: space-between;
}
#selectoption:hover #sctb {
  display: inline-block;
  /* justify-content: space-between;
  align-items: center; */
}
.el-input__suffix {
  line-height: 36px;
  right: 10px;
}
.el-input__validateIcon {
  display: none;
}
.createoption {
  width: 100%;
  height: 32px;
  border-radius: 4px;
  margin: 4px;
  color: #86909c;
  text-align: left;

  border: none;
  background: #f2f3f5;
}
</style>
<style lang="scss" scoped>
.drawer-body {
  width: 816px;
  margin: auto;
  .zn-icon {
    margin-right: 0;
  }
  .el-empty {
    display: flex;
    height: 20px;
  }
  .form-title {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
  }
  .form-tip {
    color: $base-text-3;
    font-size: 12px;
    line-height: 20px;
  }
  .form-checkbox {
    .el-checkbox-group {
      line-height: 22px;
    }
    ::v-deep .el-checkbox__label {
      font-weight: normal;
    }
  }
  .detail-left {
    width: calc(100% - 375px);
    padding-right: 30px;
    .detail-editor {
      height: calc(100% - 48px);
      ::v-deep .el-form-item {
        height: 100%;
        margin-bottom: 0;
        .el-form-item__content,
        .rich-text-editor {
          height: 100%;
        }
        .editor-content {
          height: calc(100% - 56px);
        }
      }
    }
  }
  .detail-right {
    width: 375px;
  }
  .mobile {
    border: 4px solid #1d2129;
    border-radius: 16px;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    &-title {
      font-size: 20px;
      font-weight: 500;
      line-height: 25px;
    }
    &-body {
      min-height: calc(812px - 86px - 87px - 8px);
      padding: 16px 24px;
    }
    &-description{
      ::v-deep p{
        margin: 8px 0;
      }
    }
  }
}
/* 上传样式 */
.form-upload {
  .item-img {
    position: relative;
    width: 152px;
    height: 152px;
    border-radius: 8px;
    margin-right: 10px;
    margin-bottom: 10px;
    background: $base-fill-2;
    border: 1px solid $base-fill-2;
    img {
      border-radius: 8px;
      width: 100%;
      height: 100%;
    }
    .remove-img {
      position: absolute;
      width: 22px;
      height: 22px;
      border-radius: 100%;
      top: -11px;
      right: -11px;
      background: $base-Error-1;
      color: $base-Error-6;
      .zn-icon {
        font-weight: bold;
      }
    }
  }

  .item-add {
    color: $base-line-3;
    .zn-icon {
      width: 36px;
      height: 36px;
    }
  }
}
/*  标签样式  */
::v-deep .tag-item {
  border: none;
  border-radius: 4px;
  background: $base-fill-3;
  color: $base-text-4;
  padding: 0 8px;
  line-height: 26px;
  margin-left: 0 !important;
  margin-right: 8px;
  .el-icon-close {
    transition: all ease 0.2s;
    transform: scale(1);
    color: $base-fill-5;
    display: none;
    margin-left: -4px;
    &:hover {
      background-color: unset;
      color: unset;
    }
  }
  &:hover .el-icon-close {
    display: inline-block;
  }
  &.tag-add {
    color: $base-Brand1-6;
    background: none;
    padding: 0;
    font-size: 14px;
  }
}
/* 添加电话 */
.add-item {
  position: relative;
}


.del-button {
  position: absolute;
  top: 50%;
  right: -27px;
  border: none;
  padding: 10px 5px;
  color: $base-Error-6;
  transform: translateY(-50%);
  &:hover,
  &:focus {
    color: $base-Error-6;
    background-color: transparent;
  }
}
.add-button {
  width: 100%;
  color: $base-Brand1-6;
  border-radius: 4px;
  border: 1px solid #e5e6eb;
}
.drawer-footer-body {
  width: 816px;
  margin: auto;
  .el-continue {
    width: 83px !important;
  }
}
</style>
