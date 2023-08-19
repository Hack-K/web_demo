<template>
  <el-drawer
    title="添加商品"
    :visible.sync="drawer"
    :direction="direction"
    custom-class="add-product-drawer"
    :append-to-body="false"
    :modal-append-to-body="false"
    :close-on-press-escape="false"
    :wrapperClosable="false"
    :before-close="beforeClose"
    :size="1052"
  >
    <el-form
      v-if="drawer"
      class="el-form"
      ref="createForm"
      label-position="top"
      :model="form"
      :rules="rules"
    >
      <div class="form-title mb-12">商品类型</div>
      <div class="form-category flex pb-16 mb-16 pos-relative">
        <div class="category-item">上门服务</div>
      </div>
      <div class="form-title mb-12">基本信息</div>
      <el-form-item label="商品名称" class="form-item-unit" prop="product_name">
        <el-input
          v-model="form.product_name"
          placeholder="请输入商品名称"
          maxlength="20"
        >
          <template slot="append">{{ form.product_name.length }}/20</template>
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
      <el-form-item label="服务主图" class="el-imgs-upload">
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
              @click="openCropping"
            >
              <zn-icon class="mb-8" :iconName="'callcenter-add'" />
              <span>上传图片</span>
            </div>
          </div>
          <div class="form-upload-tip">建议尺寸800*800，最多上传5张</div>
        </div>
      </el-form-item>
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
                  <zn-icon :iconName="'icon-down'" />
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
      <el-form-item label="服务详情" prop="product_content" v-if="drawer">
        <wang-edit5
          ref="wangEdit"
          :htmlValue="form.product_content"
          @htmlUpdate="htmlUpdate"
        />
      </el-form-item>
      <el-form-item label="标签">
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
          v-if="form.tag.length < 4"
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
            <el-button class="popover-submit" type="primary" @click="submitTag">
              确定
            </el-button>
          </div>
          <el-tag
            class="tag-item"
            :class="form.tag.length === 0 ? 'tag-add pointer' : ''"
            slot="reference"
            @click="tagClick"
          >
            <zn-icon :iconName="'icon-plus'" />
            <span class="ml-4" v-if="form.tag.length === 0">添加标签</span>
          </el-tag>
        </el-popover>
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
    </el-form>
    <div class="drawer-footer">
      <el-button class="el-cancel" @click="cancel">取消</el-button>
      <el-button
        class="el-continue"
        @click="submit('continue')"
        :loading="isLoading"
      >
        确定并继续添加
      </el-button>
      <el-button type="primary" @click="submit('submit')" :loading="isLoading">
        确定
      </el-button>
    </div>
    <!-- 裁剪商品 -->
    <zn-picture-cropping
      ref="znPictureCropping"
      :cutWidth="350"
      :cutHeight="350"
      @uploadImg="uploadImg"
      @uploadCancel="uploadCancel"
    />
  </el-drawer>
</template>

<script>
import { addProduct, getConfig } from '@/api/service/product'
import wangEdit5 from '@/components/ZnWangEditor5'
const region = require('./region.json')
export default {
  name: 'AddProduct',
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
      title: '待添加护理计划',
      direction: 'rtl',
      drawer: false,
      loading: false,
      isLoading: false,
      baseUrl: '', // 域名
      basePath: '', // 文件路径
      qiniuToken: '', // 七牛 token
      imgList: [], // 主图列表
      unitOptions: [],
      categoryOptions: [],
      areaOptions: [],
      propSetting: {
        multiple: true,
        label: 'name',
        value: 'code',
        children: 'child',
      },
      tagText: '',
      form: {
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
          {
            required: true,
            trigger: ['blur', 'change'],
            validator: validateDescript,
          },
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
    this.getAllConfig()
  },
  methods: {
    // 打开抽屉
    show() {
      this.drawer = true
      this.areaOptions = region
    },
    // 关闭抽屉
    beforeClose() {
      this.drawer = false
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
    // 打开裁剪框
    openCropping() {
      this.$refs['znPictureCropping'].openPopOver()
    },
    // 更新上传数据
    uploadImg(data) {
      this.$nextTick(() => {
        let modal = document.querySelector('body>.v-modal')
        let parentElement = document.querySelector('.product-container')
        parentElement.append(modal)
      })
      this.imgList.push(data.url)
    },
    // 取消裁剪
    uploadCancel() {
      this.$nextTick(() => {
        let modal = document.querySelector('body>.v-modal')
        let parentElement = document.querySelector('.product-container')
        parentElement.append(modal)
      })
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
    tagClick() {
      setTimeout(() => {
        this.$refs['tagInput'].focus()
      }, 100)
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
    cancel(type) {
      if (type !== 'continue') {
        this.drawer = false
      }
      this.imgList = []
      this.form = {
        type: 1,
        product_name: '',
        cat_id: '',
        product_img: '',
        sale_price: '',
        service_frequency: 1,
        product_unit: this.unitOptions[0],
        market_price: '',
        status: 1,
        product_content: '',
        region: '',
        tag: [],
      }
      this.$refs['createForm'].clearValidate()
    },
    // 保存操作
    async submit(type) {
      if (this.isLoading) return
      this.form.product_content = await this.$refs['wangEdit'].onBlur()
      this.$refs['createForm'].validate((valid) => {
        if (valid) {
          this.isLoading = true
          addProduct({
            ...this.form,
            product_img: this.imgList.join(','),
            tag: JSON.stringify(this.form.tag),
          })
            .then((res) => {
              if (res.code === 200) {
                this.$notify({
                  title: '添加成功',
                  message: '商品已添加',
                  type: 'success',
                  duration: 1000,
                })
                this.$parent.fetchData()
                this.cancel(type)
                setTimeout(() => {
                  this.$refs['createForm'].clearValidate()
                  this.$refs['wangEdit'].editor.setHtml('')
                }, 100)
                this.isLoading = false
              } else {
                this.isLoading = false
              }
            })
            .catch((err) => {
              this.isLoading = false
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
::v-deep .create-drawer {
  .el-drawer__body {
    padding: 24px 24px 84px;
  }
}
.el-form {
  ::v-deep .el-form-item__label {
    position: relative;
    margin-bottom: 5px;
  }
  ::v-deep .el-imgs-upload {
    .el-form-item__label::after {
      content: '建议尺寸800*800';
      position: absolute;
      width: 200px;
      left: 100%;
      top: 7px;
      line-height: 20px;
      font-size: 12px;
      color: $base-text-3;
      padding-left: 8px;
    }
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
    &::after {
      content: '';
      position: absolute;
      height: 1px;
      background: $base-line-1;
      bottom: 0;
      left: -24px;
      right: -24px;
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
    &.tag-add {
      color: $base-Brand1-6;
      background: none;
      padding: 0;
      font-size: 14px;
    }
  }
  .form-price {
    &-input {
      width: 75%;
    }
    &-number {
      width: 25%;
      padding-left: 10px;
      padding-top: 26px;
      .zn-icon {
        margin-right: 0;
      }
      ::v-deep .el-input-group__append {
        padding-left: 10px;
        padding-right: 10px;
      }
    }
  }
  ::v-deep .el-cascader {
    width: 100%;
  }
  ::v-deep .el-radio__label {
    font-weight: 400;
  }
}
</style>
