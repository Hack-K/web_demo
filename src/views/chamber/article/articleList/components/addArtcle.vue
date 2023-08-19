<template>
  <el-drawer
    :title="form['id'] ? '编辑文章' : '新增文章'"
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
    <div class="drawer-body" ref="drawer-content">
      <el-form
        class="enterprise-form"
        ref="form"
        label-position="left"
        label-width="80px"
        :model="form"
        :rules="rules"
        :disabled="!is_handle"
      >
        <el-row :gutter="100">
          <el-col :span="24" ref="title">
            <el-form-item label="标题" prop="title" v-if="true">
              <el-input
                maxlength="30"
                show-word-limit
                placeholder="请输入文章标题（2～30个字）"
                v-model="form.title"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24" ref="rich_text">
            <el-form-item label="文章内容" v-if="true" prop="rich_text">
              <RichText
                :disable="is_handle"
                :htmlValue="form['content']"
                ref="RichText"
                @htmlUpdate="htmlUpdate"
              ></RichText>
            </el-form-item>
          </el-col>
          <el-col :span="24" ref="category">
            <el-form-item label="分类" prop="category">
              <!-- :defaultSelectValue="{ label: '节日活动', value: 12 }" -->
              <ZnSelectOptionsCreate
                v-if="is_handle"
                ref="ZnSelectOptionsCreate"
                @searchOptionsChange="searchOptionsChange"
                @selectOptionsClick="selectOptionsClick"
                @createOptionsChange="createOptionsChange"
                @delOptionsChange="delOptionsChange"
                :options="category_list"
                :defaultSelectValue="form.type"
                :allowCreate="is_category_create"
              />
              <el-input
                v-else
                maxlength="30"
                show-word-limit
                placeholder="请输入文章标题（2～30个字）"
                v-model="form.type.label"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" ref="img_url">
            <el-form-item label="展示封面" prop="img_url">
              <div
                class="upload"
                @click="uploadFile"
                v-loading="uploadLoading"
                v-if="uploadFileList.length === 0"
              >
                <i class="el-icon-plus"></i>
              </div>

              <div class="upload-image-file" v-else>
                <img
                  @click="uploadFile"
                  :src="uploadFileList[0]"
                  class="upload upload-image"
                  v-loading="uploadLoading"
                />
                <div
                  @click="uploadFile"
                  v-if="is_handle"
                  class="upload-image-tips"
                >
                  更换图片
                </div>
                <div class="preview-tips" @click="openPreview">预览</div>
              </div>

              <div class="upload-tips">
                优质的封面有利于吸引用户，格式支持JPEG、PNG
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="发布渠道" prop="is_publish">
              <el-checkbox :value="true" disabled>小程序</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="drawer-footer">
        <div class="drawer-footer-body">
          <el-button @click="cancel" class="el-cancel">取消</el-button>
          <el-button
            type="primary"
            class="btn-type btn-type-line"
            @click="saveDraft"
            v-if="is_handle"
          >
            保存为草稿
          </el-button>
          <el-button
            @click="previewPhoneDrawer"
            type="primary"
            class="btn-type btn-type-line"
          >
            预览
          </el-button>
          <el-button type="primary" v-if="is_handle" @click="commit">
            发布
          </el-button>
        </div>
      </div>
    </div>
    <!-- 预览图片 -->
    <OpenPreviewImage
      v-if="previewImage"
      @closePreviewImage="closePreviewImage"
      :show="previewImage"
      :form="form"
    />
    <!-- 预览手机端 -->
    <OpenPreviewPhone
      :form="form"
      :drawer="previewPhone"
      @closePreviewPhone="closePreviewPhone"
      v-if="previewPhone"
    />
    <!-- 裁剪商品 -->
    <zn-picture-cropping
      ref="znPictureCropping"
      :cutWidth="200"
      :cutHeight="200"
      @uploadImg="uploadImg"
      @uploadCancel="uploadCancel"
    />
  </el-drawer>
</template>

<script>
import RichText from '@/components/ZnWangEditorCommon/index'
import ZnSelectOptionsCreate from '@/components/ZnSelectOptionsCreate/ZnSelectOptionsCreate'
import {
  getCategoryList,
  delCategory,
  saveCategory,
  saveArticle,
} from '@/api/article'
import OpenPreviewImage from './OpenPreviewImage.vue'
import OpenPreviewPhone from './OpenPreviewPhone.vue'

export default {
  components: {
    RichText,
    ZnSelectOptionsCreate,
    OpenPreviewImage,
    OpenPreviewPhone,
  },
  props: {
    drawer: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    let validateCategory = (rule, value, callback) => {
      let type = this.form['type']
      if (!type['value']) {
        return callback(new Error('请选择分类'))
      } else {
        callback()
      }
    }
    let validateRichText = (rule, value, callback) => {
      // let rich_text = this.rich_text
      let { content, text } = this.$refs['RichText'].getEditTextlength()
      if (content == '<p><br></p>' && text.length == 0) {
        return callback(new Error('正文内容不能为空'))
      } else {
        callback()
      }
    }
    let validteImgUrl = (rule, value, callback) => {
      let e = this.form['img_url']
      if (!e) {
        return callback(new Error('请上传封面'))
      } else {
        callback()
      }
    }
    return {
      is_handle: true,
      direction: 'rtl',
      search_text: '',
      form: {
        title: '',
        type: {},
        content: '',
        img_url: '',
        is_publish: 0,
      },
      rich_text: '',
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'change' },
          {
            min: 2,
            max: 30,
            message: '标题长度在2到30个字符',
            trigger: 'blur',
          },
        ],
        category: [
          { validator: validateCategory, required: true, trigger: 'change' },
        ],
        rich_text: [
          { validator: validateRichText, required: true, trigger: 'blur' },
        ],
        img_url: [
          { validator: validteImgUrl, required: true, trigger: 'blur' },
        ],
        is_publish: [
          { required: true, message: '请选择渠道', trigger: 'blur' },
        ],
      },
      category_list: [],
      is_category_create: true,
      uploadLoading: false,
      uploadFileList: [],
      previewImage: false,
      previewPhone: false,
    }
  },
  methods: {
    open(form = {}) {
      // 编辑
      if (form['id']) {
        this.$nextTick(() => {
          this.form = form
          let { is_publish } = form
          if (is_publish['value'] === 1) {
            this.is_handle = false
          }
          // 设置发布状态
          this.form['type'] = form['type'] ? form['type'] : {}
          this.form['is_publish'] = form['is_publish']['value']
          //回显封面图片
          this.uploadFileList = form['img_url'] ? [form['img_url']] : []
        })
        // this.$refs['RichText'].htmlValue = form['content']
      } else {
        //创建
        this.is_handle = true
      }
    },
    cancel() {
      this.$emit('closeDrawer')
    },
    customInputChange(e) {},
    customeChange(e) {},
    async getActivityList() {
      let { data } = await getCategoryList()
      this.category_list = data
    },
    searchOptionsChange(e) {
      let is_create = this.category_list.filter((item) => {
        return item['label'] === e
      })
      this.is_category_create = !is_create.length
    },
    selectOptionsClick(e) {
      this.form['type'] = e
    },
    async delOptionsChange({ value, label }) {
      let is_delete = await delCategory({ value })
      await this.getActivityList()
      this.searchOptionsChange(label)
    },
    async createOptionsChange(label) {
      let { data } = await saveCategory({ label, id: 0 })
      this.form['type'] = { label, value: data }
      await this.getActivityList()
      this.searchOptionsChange(label)
      this.$refs['ZnSelectOptionsCreate'].clearSearch()
    },
    uploadFile() {
      if (this.is_handle === true) {
        this.$refs['znPictureCropping'].openPopOver()
      }
    },
    openPreview() {
      this.previewImage = true
      // this.$emit('openPreviewImageDrawer', { ...this.form })
    },
    closePreviewImage() {
      this.previewImage = false
      this.setOpenHtml()
    },
    htmlUpdate({ content, text }) {
      this.form['content'] = content
      this.rich_text = text
      this.$refs.form.validateField('rich_text', (errorMsg) => {})
    },
    // 取消裁剪
    uploadCancel() {
      this.setOpenHtml()
    },
    // 更新上传数据
    uploadImg(data) {
      this.setOpenHtml()
      this.uploadFileList = [data['url']]
      this.form['img_url'] = data['url']
      this.$refs.form.validateField('img_url', (errorMsg) => {})
    },
    setOpenHtml() {
      this.$nextTick(() => {
        let modal = document.querySelector('.v-modal')
        let parentElement = document.querySelector('.parent-container')
        parentElement.append(modal)
      })
    },
    closePreviewPhone() {
      this.setOpenHtml()
      this.previewPhone = false
    },
    commit() {
      // console.log(this.$refs['category'].$el.offsetTop)
      let el = document.querySelector('.el-drawer__body')
      this.$refs['form'].validate((valid, array) => {
        for (const key in array) {
          el.scrollTop = this.$refs[key].$el.offsetTop
          return
        }
        if (!valid) return
        let params = this.form
        params['type'] = this.form['type']['value']
        params['is_publish'] = 1
        params['publish_channel'] = 1
        saveArticle({ ...params }).then((res) => {
          this.$notify({
            title: '成功',
            message: '新增文章成功',
            type: 'success',
            duration: 1000,
          })
          this.cancel()
        })
      })
    },
    saveDraft() {
      let { title, type, content, img_url } = this.form
      if (
        title === '' &&
        type['value'] === undefined &&
        content === '' &&
        img_url === ''
      ) {
        console.log('请完善文章内容')
        this.$notify({
          title: '失败',
          message: '请完善文章内容',
          type: 'error',
          duration: 1000,
        })
        return
      } else {
        let params = this.form
        params['type'] = type ? type['value'] : {}
        params['is_publish'] = 0
        saveArticle({ ...params }).then((res) => {
          this.$notify({
            title: '成功',
            message: '保存草稿成功',
            type: 'success',
            duration: 1000,
          })
          this.cancel()
        })
      }
    },
    previewPhoneDrawer(e) {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.previewPhone = true
        }
      })
    },
    resetFrom() {
      this.$nextTick(() => {
        console.log(this.$refs)
        this.form['type'] = {}
        this.form['content'] = ''
        this.$refs['form'].resetFields()
        this.uploadFileList = []
      })
    },
  },
  mounted() {
    this.$nextTick(async () => {
      await this.getActivityList()
    })
  },
}
</script>

<style lang="scss" scoped>
.drawer-body {
  width: 816px;
  margin: auto;
  .drawer-footer-body {
    width: 816px;
    margin: auto;
    .el-continue {
      width: 83px !important;
    }
  }
  .custome-input {
    .el-input__inner {
      border: none;
      padding: 7px 12px;
    }
  }
  .upload {
    width: 158px;
    height: 120px;
    background: #f7f8fa;
    box-sizing: border-box;
    border: 1px dashed #e5e6eb;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    .el-icon-plus {
      font-size: 40px;
      color: #d8d8d8;
    }
  }
  .upload-tips {
    color: #86909c;
    font-size: 12px;
  }
  .upload:hover {
    border: 1px dashed #005bd9;
    color: #005bd9;
  }
  .upload:hover .el-icon-plus {
    font-size: 40px;
  }
  .upload-image {
    border: 1px solid transparent;
  }
  .upload-image:hover {
    border: 1px solid transparent;
  }
  .upload-image-tips {
    line-height: 24px;
    height: 24px;
    width: 158px;
    backdrop-filter: blur(10px);
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;
    position: relative;
    top: -24px;
    backdrop-filter: blur(10px);
    font-size: 12px;
    color: #005bd9;
    text-align: center;
    cursor: pointer;
  }
  .upload-image-file {
    position: relative;
  }
  .preview-tips {
    color: #005bd9;
    font-size: 12px;
    position: absolute;
    left: 180px;
    bottom: 20px;
    cursor: pointer;
  }
  .btn-type-line {
    border: 1px solid #005bd9 !important;
    background: #ffffff !important;
    background: none !important;
    color: #005bd9 !important;
  }
}
</style>
