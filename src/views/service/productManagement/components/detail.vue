<template>
  <div class="detail-container pos-relative" :class="isEdit ? '' : 'show'">
    <div class="detail-head">
      <div class="width-1004 flex-center-between">
        <span class="title">商品详情</span>
        <div v-permissions="{ permission: ['service:productManagement:edit'] }">
          <el-button
            v-if="!isEdit"
            type="text"
            class="el-edit"
            @click="detailEdit"
          >
            <zn-icon :iconName="'icon-edit'" class="mr-6" />
            <span>编辑</span>
          </el-button>
        </div>
      </div>
    </div>
    <div class="detail-body">
      <div class="detail-content pt-24">
        <el-form
          class="el-form"
          ref="createForm"
          label-position="top"
          :model="form"
          :rules="rules"
        >
          <div class="form-title mb-12">商品类型</div>
          <div class="form-category flex mb-24 pos-relative">
            <div class="category-item">上门服务</div>
          </div>
          <div class="form-title mb-12">基本信息</div>
          <el-form-item
            label="商品名称"
            class="form-item-unit"
            prop="product_name"
          >
            <el-input
              v-model="form.product_name"
              placeholder="请输入商品名称"
              maxlength="20"
            >
              <template slot="append" v-if="isEdit">
                {{ form.product_name.length }}/20
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="商品类目" prop="cat_id">
            <el-select v-model="form.cat_id" placeholder="请选择商品类目">
              <el-option
                v-for="(item, index) in categoryOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- 图片上传 -->
          <el-form-item label="服务主图" v-if="isEdit">
            <div class="form-upload">
              <div class="form-upload-imgs flex mb-12">
                <div
                  class="item-img mr-10 pos-relative"
                  v-for="(img, index) in imgList"
                  :key="img"
                >
                  <img :src="img" />
                  <div
                    class="remove-img pos-absolute flex-column"
                    @click="removeImg(index)"
                  >
                    <zn-icon :iconName="'icon-close'" />
                  </div>
                </div>
                <div
                  v-if="imgList.length < 5"
                  class="item-img item-add flex-column pointer"
                  @click="openFileWindows"
                >
                  <zn-icon class="mb-8" :iconName="'callcenter-add'" />
                  <span>上传图片</span>
                </div>
              </div>
              <div class="form-upload-tip">建议尺寸800*800，最多上传5张</div>
            </div>
          </el-form-item>
          <input
            style="display: none"
            ref="uploadFile"
            type="file"
            multiple="multiple"
            accept=".bmp,.jpg,.png,.tif,.gif,.pcx,.tga,.exif,.fpx,.svg,.psd,.cdr,.pcd,.dxf,.ufo,.eps,.ai,.raw,.WMF,.webp,.avif,.apng"
            name="file"
            @change="uploadChange"
          />
          <!-- 图片展示页面 -->
          <div
            class="detail-banners mb-24"
            v-if="!isEdit && imgList.length > 0"
          >
            <div class="title mb-10">服务主图</div>
            <ul class="flex">
              <li class="mr-16" v-for="(img, index) in imgList" :key="index">
                <img :src="img + '?imageView2/1/w/100/h/100'" />
              </li>
            </ul>
          </div>
          <div class="form-title mb-12">价格设置</div>
          <div class="form-price flex">
            <el-form-item
              class="form-price-input form-item-unit"
              label="服务价格"
              prop="sale_price"
            >
              <el-input
                v-model="form.sale_price"
                placeholder="请输入服务价格"
                oninput="value=value.replace(/[^0-9|\.]/g,'')"
              >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item class="form-price-number">
              <el-input
                v-model="form.service_frequency"
                placeholder="请输入服务时间"
                oninput="value=value.replace(/[^0-9]/g,'')"
              >
                <template slot="append">
                  <el-dropdown @command="changeUnit">
                    <span class="el-dropdown-link pointer">
                      {{ form.product_unit }}
                      <zn-icon :iconName="'icon-down'" v-if="isEdit" />
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        v-for="(item, index) in unitOptions"
                        :key="index"
                        :command="item"
                      >
                        {{ item }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </el-input>
            </el-form-item>
          </div>
          <el-form-item label="服务划线价" class="form-item-unit">
            <el-input
              v-model="form.market_price"
              placeholder="请输入划线价"
              oninput="value=value.replace(/[^0-9|\.]/g,'')"
            >
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <div class="form-title mb-12">服务描述</div>
          <el-form-item label="服务详情" prop="product_content">
            <wang-edit5
              ref="wangEdit"
              :readOnly="!isEdit"
              :htmlValue="form.product_content"
              @htmlUpdate="htmlUpdate"
            />
          </el-form-item>
          <!-- 标签编辑页面 -->
          <el-form-item label="标签" v-if="isEdit">
            <el-tag
              class="tag-item"
              v-for="(tag, index) in form.tag"
              :key="tag + index"
              closable
              disable-transitions
              @close="closeTag(index)"
            >
              {{ tag }}
            </el-tag>
            <el-popover
              ref="popoverTag"
              popper-class="popover-confirm"
              v-if="form.tag && form.tag.length < 4"
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
                <template slot="append">{{ tagText.length }}/4</template>
              </el-input>
              <div class="popover-footer flex flex-end">
                <el-button class="popover-cancel" @click="cancelTag">
                  取消
                </el-button>
                <el-button
                  class="popover-submit"
                  type="primary"
                  @click="submitTag"
                >
                  确定
                </el-button>
              </div>
              <el-tag class="tag-item" slot="reference" @click="tagClick">
                <zn-icon :iconName="'icon-plus'" />
              </el-tag>
            </el-popover>
          </el-form-item>
          <!-- 标签展示页面 -->
          <el-form-item label="标签" v-else>
            <el-tag
              class="tag-item"
              v-for="(tag, index) in form.tag"
              :key="tag + index"
              disable-transitions
              @close="closeTag(index)"
            >
              {{ tag }}
            </el-tag>
          </el-form-item>
          <div class="form-title mb-12">售卖设置</div>
          <el-form-item label="服务范围" prop="region">
            <el-cascader
              v-model="form.region"
              :options="areaOptions"
              :props="propSetting"
              clearable
              collapse-tags
            ></el-cascader>
          </el-form-item>
          <el-form-item label="上架设置" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :label="1">立即上架</el-radio>
              <el-radio :label="2">暂不上架</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="detail-block" v-if="isEdit"></div>
        </el-form>
      </div>
    </div>
    <div class="detail-footer pos-absolute pt-10 pb-10" v-if="isEdit">
      <div class="width-1004 flex-end">
        <el-button class="el-cancel" @click="cancel">取消</el-button>
        <el-button type="primary" @click="publish">发布</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import {
    getToken,
    getConfig,
    editProduct,
    getDetail,
  } from '@/api/service/product'
  import wangEdit5 from '@/components/ZnWangEditor5'
  const region = require('./region.json')
  export default {
    name: 'Detail',
    components: { wangEdit5 },
    data() {
      const validateTags = (rule, value, callback) => {
        if (value.length > 0) {
          callback()
        } else {
          callback(new Error('请添加标签'))
        }
      }
      const validateDescript = (rule, value, callback) => {
        // 判断富文本编辑器输入是否为空或回车
        let getText = function (str) {
          return str
            .replace(/<[^<p>]+>/g, "") // 将所有<p>标签 replace ''
            .replace(/<[</p>$]+>/g, "") // 将所有</p>标签 replace ''
            .replace(/&nbsp;/gi, "") // 将所有 空格 replace ''
            .replace(/<[^<br/>]+>/g, ""); // 将所有 换行符 replace ''
        };

        let isNullS = function (str) {
          if (str == "") return true;
          var regu = "^[ ]+$";
          var re = new RegExp(regu);
          return re.test(str);
        };
        // 举例
        let text = getText(value);
        let result = isNullS(text);
        if (result) {
          return callback("请输入服务详情");
        } else {
          callback();
        }
      }
      return {
        isEdit: false, // 编辑状态
        loading: false,
        baseUrl: '', // 域名
        basePath: '', // 文件路径
        qiniuToken: '', // 七牛 token
        detailId: '',
        detailData: '',
        imgList: [], // 主图列表
        unitOptions: [], // 单位列表
        categoryOptions: [], // 类目列表
        areaOptions: [], // 区域列表
        propSetting: {
          // 联级配置项
          multiple: true,
          label: 'name',
          value: 'code',
          children: 'child',
        },
        tagText: '',
        form: {
          id: '',
          type: 1,
          product_name: '',
          cat_id: '',
          product_img: '',
          sale_price: '',
          service_frequency: 1,
          product_unit: '',
          market_price: '',
          status: 1,
          product_content: '',
          region: '',
          tag: [],
        },
        rules: {
          product_name: [
            { required: true, message: '请输入商品名称', trigger: 'blur' },
          ],
          cat_id: [
            { required: true, message: '请选择商品类目', trigger: 'change' },
          ],
          sale_price: [
            { required: true, message: '请输入服务价格', trigger: 'blur' },
          ],
          product_content: [
            { required: true, trigger: 'blur', validator: validateDescript },
          ],
          region: [
            { required: true, message: '请选择服务范围', trigger: 'change' },
          ],
          status: [
            { required: true, message: '请设置上下架', trigger: 'change' },
          ],
        },
        menus: [
          // "head", // 标题
          'bold', // 粗体
          'fontSize', // 字号
          // "fontName", // 字体
          'italic', // 斜体
          'underline', // 下划线
          'strikeThrough', // 删除线
          'foreColor', // 文字颜色
          // "backColor", // 背景颜色
          // "link", // 插入链接
          // "list", // 列表
          'justify', // 对齐方式
          // "quote", // 引用
          // "emoticon", // 表情
          'image', // 插入图片
          // "table", // 表格
          // "video", // 插入视频
          // "code", // 插入代码
          // "undo", // 撤销
          // "redo", // 重复
          // "fullscreen", // 全屏
        ],
      }
    },
    created() {
      this.detailId = this.$route.query.id
      this.getDetail()
      this.getAllConfig()
      this.getQiniuConfig()
      this.areaOptions = region
    },
    methods: {
      // 获取商品详情
      getDetail() {
        getDetail({
          id: this.detailId,
        }).then((res) => {
          if (res.code === 200) {
            this.detailData = res.data
            this.imgList = res.data.product_img
            this.form = {
              id: res.data.id,
              type: res.data.type.value,
              product_name: res.data.product_name,
              cat_id: res.data.cat_id.value,
              sale_price: res.data.sale_price,
              service_frequency: res.data.service_frequency,
              product_unit: res.data.product_unit,
              market_price: res.data.market_price,
              status: res.data.status.value,
              product_content: res.data.product_content,
              tag: res.data.tag ? res.data.tag : [],
              region: res.data.region,
            }
          }
        })
      },
      // 获取商品配置
      getAllConfig() {
        getConfig().then((res) => {
          this.unitOptions = res.data.unit
          this.form.product_unit = res.data.unit[0]
          this.categoryOptions = res.data.cats
        })
      },
      // 富文本内容更新
      htmlUpdate(html) {
        this.form.product_content = html
        this.$refs['createForm'].validateField('product_content')
      },
      // 获取七牛参数
      getQiniuConfig() {
        getToken().then((res) => {
          if (res.code === 200) {
            this.qiniuToken = res.data.token
            this.baseUrl = res.data.domain
            this.basePath = '/' + res.data.base_path
          }
        })
      },
      // 详情编辑
      detailEdit() {
        this.isEdit = true
      },
      // 打开上传入口
      openFileWindows() {
        this.$refs['uploadFile'].click()
      },
      // 上传七牛云
      async uploadFileRequest(data) {
        // 发起一个post请求
        axios({
          method: 'post',
          url: 'https://up-z2.qiniup.com',
          headers: { 'Content-Type': 'multipart/form-data' },
          data,
        })
      },
      // 文件后缀
      extname(filename) {
        if (!filename || typeof filename != 'string') {
          return false
        }
        let fileNameArr = filename.split('.')
        return fileNameArr[fileNameArr.length - 1]
      },
      // 生成随机数 number生成随机数长度
      randomStr(number) {
        let result = ''
        let characters =
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        for (let i = 0; i < number; i++) {
          result += characters.charAt(
            Math.floor(Math.random() * characters.length)
          )
        }
        return result
      },
      //上传图片
      async uploadChange(e) {
        if (this.imgList.length + e.target.files.length > 5) {
          return false
        }
        this.loading = true
        let fileList = e.target.files
        for (let i = 0; i < fileList.length; i++) {
          let file_item = fileList[i]
          let key =
            this.basePath +
            this.randomStr(30) +
            '.' +
            this.extname(file_item['name'])
          let formData = new FormData()
          formData.append('token', this.qiniuToken)
          formData.append('file', file_item)
          formData.append('key', key)
          await this.uploadFileRequest(formData)
          setTimeout(() => {
            this.imgList.push(this.baseUrl + key)
            this.$refs['uploadFile'].value = ''
          }, 500)
        }
        this.loading = false
      },
      // 删除图片
      removeImg(index) {
        this.imgList.splice(index, 1)
      },
      // 选择单位
      changeUnit(command) {
        this.form.product_unit = command
      },
      // 点击添加
      tagClick(){
        setTimeout(() => {
          this.$refs['tagInput'].focus()
        },100)
      },
      // 删除标签
      closeTag(index) {
        this.form.tag.splice(index, 1)
      },
      // 取消添加
      cancelTag() {
        this.$refs['popoverTag'].doClose()
        this.tagText = ''
      },
      // 取消操作
      submitTag() {
        if (!this.tagText.trim()) return
        this.form.tag.push(this.tagText)
        this.$refs['popoverTag'].doClose()
        this.tagText = ''
      },
      // 取消操作
      cancel() {
        this.getDetail()
        this.$refs['createForm'].clearValidate()
        this.isEdit = false
      },
      // 发布操作
      async publish() {
        this.form.product_content = await this.$refs['wangEdit'].onBlur()
        this.$refs['createForm'].validate((valid) => {
          if (valid) {
            editProduct({
              ...this.form,
              product_img: this.imgList.join(','),
              tag: JSON.stringify(this.form.tag),
            }).then((res) => {
              if (res.code === 200) {
                this.$notify({
                  title: '修改成功',
                  message: '修改已保存',
                  type: 'success',
                  duration: 1000
                })
                this.isEdit = false
                this.getDetail()
              }
            })
          }
        })
      },
    },
  }
</script>
<style lang="scss">
  .popover-input {
    .el-input-group__append {
      width: unset;
      position: absolute;
      border: none;
      right: 10px;
      top: 0;
      bottom: 0;
      padding: 0;
      background: none;
      line-height: 36px;
      display: block;
      color: $base-text-2;
    }
  }
</style>
<style lang="scss" scoped>
  .width-1004 {
    width: 1004px;
    margin: 0 auto;
  }
  // 头部栏样式
  .detail-head {
    background: $base-fill-3;
    > div {
      height: 56px;
    }
    .title {
      font-size: 16px;
      font-weight: 500;
    }
    .el-edit {
      z-index: 2;
      top: 18px;
      right: 0;
      padding: 0 18px;
      padding-left: 0;
      line-height: 24px;
      cursor: pointer;
      color: $base-text-5;
      font-size: 14px;
      font-weight: 400;
      .zn-icon {
        vertical-align: -4px;
      }
    }
  }
  // 内容部分样式
  .detail-body {
    height: calc(100% - 56px);
    overflow-y: hidden;
    &:hover{
      overflow-y: overlay;
    }
  }
  .detail-content {
    width: 1004px;
    height: 100%;
    margin: 0 auto;
    .detail-banners {
      .title {
        line-height: 32px;
      }
      li {
        width: 100px;
        height: 100px;
        background: $base-fill-4;
        border-radius: 2px;
        overflow: hidden;
      }
    }
    .el-form {
      ::v-deep .el-form-item__label {
        position: relative;
        margin-bottom: 5px;
      }
      ::v-deep .form-item-unit {
        .el-input-group__append {
          width: unset;
          position: absolute;
          border: none;
          right: 10px;
          top: 0;
          bottom: 0;
          padding: 0;
          background: none;
          line-height: 40px;
          display: block;
          color: $base-text-3;
          font-size: 14px;
        }
      }
      ::v-deep .editor-content {
        height: 500px !important;
      }
      .form-title {
        line-height: 24px;
        font-size: 16px;
        font-weight: 500;
      }
      .form-category {
        .category-item {
          border: 1px solid $base-line-2;
          background: $base-fill-3;
          border-radius: 8px;
          text-align: center;
          min-width: 120px;
          line-height: 52px;
          cursor: pointer;
        }
      }
      .form-upload {
        .item-img {
          width: 100px;
          height: 100px;
          background: $base-fill-4;
          img {
            width: 100%;
            height: 100%;
          }
          .remove-img {
            width: 22px;
            height: 22px;
            border-radius: 100%;
            top: -11px;
            right: -11px;
            background: $base-Error-1;
            color: $base-Error-6;
            .zn-icon {
              font-weight: bold;
              margin-right: 0;
            }
          }
        }
        .item-add {
          background: $base-fill-4;
          border: 1px dashed $base-line-3;
          border-radius: 2px;
          color: $base-text-4;
          line-height: 22px;
          .zn-icon {
            margin-right: 0;
          }
        }
        &-tip {
          line-height: 20px;
          color: $base-text-3;
          font-size: 12px;
        }
      }
      ::v-deep .tag-item {
        border: none;
        border-radius: 4px;
        background: $base-fill-3;
        color: $base-text-4;
        padding: 0 8px;
        line-height: 26px;
        margin-left: 0 !important;
        margin-right: 8px;
        .zn-icon {
          margin-right: 0;
        }
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
      }
      .form-price {
        &-input {
          width: 75%;
        }
        &-number {
          width: 25%;
          padding-left: 10px;
          padding-top: 37px;
        }
        .zn-icon {
          margin-right: 0;
        }
        ::v-deep .el-input-group__append {
          padding-left: 10px;
          padding-right: 10px;
        }
      }
      ::v-deep .el-cascader,
      ::v-deep .el-select {
        width: 100%;
      }
      ::v-deep .el-radio__label {
        font-weight: 400;
      }
    }
    .detail-block {
      height: 60px;
    }
  }
  // 底部按钮样式
  .detail-footer {
    left: 0;
    bottom: 0;
    right: 0;
    background: #fff;
    border-top: 1px solid $base-line-2;
    z-index: 2;
    .el-button {
      min-width: 70px;
      line-height: 36px;
      font-size: 14px;
      font-weight: 500;
      padding: 0 16px;
      border: none;
      border-radius: 4px;
    }
    .el-cancel {
      background: $base-fill-3;
      color: $base-text-4;
    }
  }
  .show {
    ::v-deep .detail-content {
      pointer-events: none;
      .form-item-unit {
        .el-input-group__append {
          color: $base-text-5;
        }
      }
      .rich-text-editor {
        pointer-events: fill;
        border-color: $base-fill-2;
      }
      .editor-tool-bar {
        display: none;
      }
      .w-e-text-container {
        background-color: $base-fill-2;
      }
      .el-input__inner {
        background: $base-fill-2;
        border-color: $base-fill-2;
      }
      .el-input-group__append {
        background: $base-fill-2;
        border-color: $base-fill-2;
      }
      .el-input__suffix {
        display: none;
      }
    }
  }
</style>
