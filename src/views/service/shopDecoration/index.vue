<template>
  <div class="shop-decoration-container">
    <div class="shop-left flex-column">
      <div class="mobile-view">
        <div class="mobile-head">
          <img src="@/assets/images/service_images/mobile-head.png" />
        </div>
        <div class="mobile-content">
          <div class="pos-relative pl-132">
            <el-tag class="mobile-tag pos-absolute">广告位</el-tag>
            <div
              class="mobile-banner pos-relative mt-24"
              :class="current === 1 ? 'active' : ''"
            >
              <el-carousel height="355px" arrow="never" :autoplay="false">
                <el-carousel-item
                  v-for="(item, index) in form.banners"
                  :key="index"
                >
                  <div class="pos-relative height-100">
                    <div v-if="item.img_src" class="banner-img">
                      <img :src="item.img_src + '?imageView2/1/w/323/h/325'" />
                    </div>
                    <div class="default-img flex-column height-100" v-else>
                      <zn-icon :iconName="'icon-default-pic'" />
                    </div>
                    <div class="banner-title pos-absolute pl-16 pr-16">
                      {{ item.banner_title }}
                    </div>
                  </div>
                </el-carousel-item>
              </el-carousel>
            </div>
          </div>
          <div class="pos-relative pl-132" v-if="navShow">
            <el-tag class="mobile-tag pos-absolute">导航</el-tag>
            <div class="mobile-nav pos-relative" :class="current === 2 ? 'active' : ''">
              <div class="flex flex-center-between mb-24">
                <span class="mobile-nav-title">
                  {{ form.navTitle || '快速入口' }}
                </span>
                <span class="mobile-nav-more flex-center">
                  更多
                  <zn-icon :iconName="'icon-down'" />
                </span>
              </div>
              <div class="nav-list">
                <ul class="nav-ul flex">
                  <li
                    class="nav-item"
                    v-for="(item, index) in form.navs"
                    :key="index"
                  >
                    <div class="nav-img" v-if="item.img_src">
                      <img :src="item.img_src + '?imageView2/1/w/103/h/103'" />
                    </div>
                    <div class="default-img flex-column" v-else>
                      <zn-icon :iconName="'icon-default-pic'" />
                    </div>
                    <div class="nav-name overflowOne mt-12">
                      {{ item.nav_title || '默认标题' }}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="pos-relative pl-132">
            <el-tag class="mobile-tag pos-absolute">商品列表</el-tag>
            <div
              class="mobile-product pos-relative"
              :class="current === 3 ? 'active' : ''"
            >
              <div class="flex flex-between mb-24">
                <span class="mobile-product-title">
                  {{ form.menuTitle || '推荐服务' }}
                </span>
              </div>
              <div class="product-list">
                <ul class="product-ul flex">
                  <li
                    class="product-item mr-16 mb-24"
                    v-for="item in productList"
                    :key="item.id"
                  >
                    <div v-if="item.product_img.length > 0">
                      <img
                        :src="item.product_img[0] + '?imageView2/1/w/156/h/156'"
                        class="product-img"
                      />
                    </div>
                    <div class="default-img flex-column" v-else>
                      <zn-icon :iconName="'icon-default-pic'" />
                    </div>
                    <div class="product-name overflowOne mt-12">
                      {{ item.product_name || '默认标题' }}
                    </div>
                    <div class="product-tags flex">
                      <span v-for="(tag, index) in item.tag" :key="index">
                        {{ tag }}
                      </span>
                    </div>
                    <div class="product-price">
                      <span>{{ item.sale_price }}</span>
                      {{ item.product_unit }}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="mobile-tabbar">
          <img src="@/assets/images/service_images/mobile-tabbar.png" />
        </div>
      </div>
    </div>
    <div class="shop-right">
      <div class="shop-form">
        <zn-picture-cropping
          ref="znPictureCropping"
          :cutWidth="350"
          :cutHeight="350"
          @uploadImg="uploadImg"
        />
        <el-form
          ref="shopForm"
          class="create-form"
          label-position="top"
          :model="form"
          :rules="rules"
        >
          <el-form-item label="店铺名称" prop="storeName">
            <el-input
              placeholder="请输入"
              v-model="form.storeName"
              maxlength="6"
            >
              <template slot="append">{{ form.storeName.length }}/6</template>
            </el-input>
          </el-form-item>
          <el-form-item label="服务范围" prop="serviceScopeName">
            <el-cascader
              v-model="form.serviceScopeName"
              :options="areaOptions"
              :props="propSetting"
              clearable
              collapse-tags
            ></el-cascader>
          </el-form-item>
          <!-- 广告位 -->
          <div class="banner mb-16">
            <div class="title banner-title mb-10">
              广告位
              <span class="banner-tip pl-8">建议上传750*514尺寸图片</span>
            </div>
            <div
              class="item flex-center mb-16 pos-relative"
              v-for="(item, index) in form.banners"
              :key="index"
            >
              <div
                v-if="item.img_src"
                class="item-thumbnail pos-relative pointer"
              >
                <img
                  :src="item.img_src + '?imageView2/1/w/100/h/100'"
                  class="item-img"
                  @click="openCropping('banner', index)"
                />
                <div
                  class="item-remove thum-remove pos-absolute flex-column"
                  @click="removeImg('banner', index)"
                >
                  <zn-icon :iconName="'icon-close'" />
                </div>
                <div class="item-tip pos-absolute">更换图片</div>
              </div>
              <div
                v-else
                class="item-img flex-column pointer"
                @click="openCropping('banner', index)"
              >
                <zn-icon class="mb-8" :iconName="'callcenter-add'" />
                <span>上传图片</span>
              </div>
              <div class="item-info pl-16">
                <el-form-item
                  :prop="`banners.${index}.banner_title`"
                  :rules="rules.banner_title"
                >
                  <el-input
                    placeholder="请输入广告标题"
                    v-model="item.banner_title"
                    maxlength="30"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  :prop="`banners.${index}.banner_title`"
                  :rules="rules.banner_href"
                >
                  <el-input
                    placeholder="请输入跳转链接"
                    v-model="item.banner_href"
                  ></el-input>
                </el-form-item>
              </div>
              <div
                class="item-remove project-remove pos-absolute flex-column"
                @click="removeItem('banner', index)"
                v-if="form.banners.length > 1"
              >
                <zn-icon :iconName="'icon-close'" />
              </div>
            </div>
            <el-button
              class="el-button-add"
              type="primary"
              size="medium"
              icon="el-icon-plus"
              plain
              @click="addOperate('banner')"
            >
              添加广告
            </el-button>
          </div>
          <!-- 导航 -->
          <div :class="`nav ${navShow ? 'mb-16' : 'mb-32'}`">
            <div class="title nav-title mb-16 flex-between">
              <span>导航</span>
              <el-tooltip effect="dark" :content="navShow ? '关闭导航' : '显示导航'" placement="left">
                <el-switch
                  v-model="navShow"
                  active-color="#005BD9"
                  inactive-color="#C9CDD4">
                </el-switch>
              </el-tooltip>
            </div>
            <div v-if="navShow">
              <el-form-item label="导航标题" prop="name">
                <el-input
                  placeholder="请输入分类标题"
                  v-model="form.navTitle"
                  maxlength="6"
                >
                  <template slot="append">{{ form.navTitle.length }}/6</template>
                </el-input>
              </el-form-item>
              <div
                class="item flex-center mb-16 pos-relative"
                v-for="(item, index) in form.navs"
                :key="index"
              >
                <div v-if="item.img_src" class="item-thumbnail pos-relative pointer">
                  <img
                    :src="item.img_src + '?imageView2/1/w/100/h/100'"
                    class="item-img"
                    @click="openCropping('nav', index)"
                  />
                  <div
                    class="item-remove thum-remove pos-absolute flex-column"
                    @click="removeImg('nav', index)"
                  >
                    <zn-icon :iconName="'icon-close'" />
                  </div>
                  <div class="item-tip pos-absolute">更换图片</div>
                </div>
                <div
                  v-else
                  class="item-img flex-column pointer"
                  @click="openCropping('nav', index)"
                >
                  <zn-icon class="mb-8" :iconName="'callcenter-add'" />
                  <span>上传图片</span>
                </div>
                <div class="item-info pl-16">
                  <el-form-item :prop="`navs.${index}.nav_title`" :rules="rules.nav_title">
                    <el-input
                      placeholder="请输入导航标题"
                      v-model="item.nav_title"
                      maxlength="30"
                    ></el-input>
                  </el-form-item>

                  <el-form-item>
                    <el-popover
                      ref="selectPopover"
                      popper-class="select-popover"
                      placement="bottom-start"
                      :visible-arrow="false"
                      width="150"
                      trigger="click"
                    >
                      <div slot="reference">
                        <el-input
                          v-model="item.name"
                          placeholder="请选择导航链接"
                        ></el-input>
                      </div>
                      <div
                        class="select-choice flex-center-between"
                        @click="choiceType(1, index)"
                      >
                        <span>商品分类</span>
                        <i class="el-icon-arrow-right"></i>
                      </div>
                      <div
                        class="select-choice flex-center-between"
                        @click="choiceType(2, index)"
                      >
                        <span>商品链接</span>
                        <i class="el-icon-arrow-right"></i>
                      </div>
                    </el-popover>
                  </el-form-item>
                </div>
                <div
                  class="item-remove project-remove pos-absolute flex-column"
                  @click="removeItem('nav', index)"
                  v-if="form.navs.length > 1"
                >
                  <zn-icon :iconName="'icon-close'" />
                </div>
              </div>
              <el-button
                class="el-button-add"
                type="primary"
                size="medium"
                icon="el-icon-plus"
                plain
                style="margin-bottom: 16px;"
                @click="addOperate('nav')"
              >
                添加导航
              </el-button>
            </div>
          </div>
          <!-- 商品列表 -->
          <div class="product">
            <div class="title product-title mb-16">商品列表</div>
            <el-form-item label="菜单名称" prop="name">
              <el-input
                placeholder="请输入菜单名称"
                v-model="form.menuTitle"
                maxlength="6"
              >
                <template slot="append">{{ form.menuTitle.length }}/6</template>
              </el-input>
            </el-form-item>
            <div class="product-list">
              <ul class="product-ul flex">
                <li
                  class="product-item mr-16"
                  v-for="(item, index) in productList"
                  :key="item.id"
                >
                  <el-tooltip
                    effect="dark"
                    :content="item.product_name"
                    placement="bottom"
                  >
                    <div class="product-img pos-relative">
                      <img
                        :src="item.product_img[0] + '?imageView2/1/w/100/h/100'"
                      />
                      <div
                        class="item-remove pos-absolute flex-column"
                        @click="removeImg('product', index)"
                      >
                        <zn-icon :iconName="'icon-close'" />
                      </div>
                      <div class="product-item-title pos-absolute">
                        {{ item.product_name }}
                      </div>
                    </div>
                  </el-tooltip>
                </li>
                <li
                  class="product-item mr-16 pointer flex-column product-add"
                  @click="addProduct"
                >
                  <zn-icon class="mb-8" :iconName="'callcenter-add'" />
                  <span>上传图片</span>
                </li>
              </ul>
            </div>
          </div>
        </el-form>
      </div>
      <div class="shop-footer">
        <el-button class="el-save" @click="save">保存</el-button>
        <el-button type="primary" @click="publish">发布</el-button>
      </div>
    </div>
    <!-- 选择商品列表 -->
    <add-product ref="addProduct" @update-product="updateProduct"></add-product>
    <!-- 选择商品分类 -->
    <add-category
      ref="addCategory"
      @update-product="updateProduct"
    ></add-category>
  </div>
</template>

<script>
import { getSetting, saveDraft, publishStore } from '@/api/service/shop'
import { getConfig } from '@/api/service/product'
import addProduct from './components/addProduct'
import addCategory from './components/addCategory'
const region = require('../productManagement/components/region.json')
export default {
  name: 'ShopDecoration',
  components: {
    addProduct,
    addCategory,
  },
  data() {
    return {
      current: 1,
      areaOptions: [], // 服务区域选项
      categoryOptionsIds: [], // 导航分类选项ids
      categoryOptions: [], // 导航分类选项
      propSetting: {
        multiple: true,
        label: 'name',
        value: 'code',
        children: 'child',
      },
      uploadType: '',
      uploadIndex: '',
      productList: [], // 产品列表
      currentIndex: "", // 当前导航索引
      navShow: true,
      form: {
        storeName: '', // 店铺名称
        serviceScopeName: '', // 服务范围
        banners: [
          {
            img_src: '',
            banner_href: '',
            banner_title: '',
          },
        ],
        navTitle: '', // 导航标题
        navs: [
          {
            type: '', // 类别
            img_src: '',
            nav_title: '',
            category_ids: [], // 分类
            product_id: '',
            name: '',
          },
        ],
        menuTitle: '', // 菜单名称
        productIds: '', // 产品id
      },
      defaultBanners: [
        {
          img_src: '',
          banner_href: '',
          banner_title: '',
        },
      ],
      defaultNavs: [
        {
          type: '',
          img_src: '',
          nav_title: '',
          category_ids: [],
          product_id: '',
          name: '',
        },
      ],
      rules: {
        storeName: [
          { required: true, trigger: 'blur', message: '店铺名称未填写' },
        ],
        serviceScopeName: [
          { required: true, trigger: 'change', message: '服务范围未填写' },
        ],
        banner_title: [
          { required: true, trigger: 'blur', message: '广告标题未填写' },
        ],
        banner_href: [
          { required: true, trigger: 'blur', message: '广告路径未选择' },
        ],
        nav_title: [
          { required: true, trigger: 'blur', message: '导航标题未填写' },
        ],
      },
    }
  },
  async created() {
    this.areaOptions = region
    await this.getAllConfig()
    await this.getSettingData()
  },
  methods: {
    // 获取商城配置
    async getSettingData() {
      getSetting().then(async (res) => {
        if (res.code === 200) {
          let banners =
            res.data.banners && res.data.banners.length > 0
              ? res.data.banners
              : JSON.parse(JSON.stringify(this.defaultBanners))
          let navs =
            res.data.navs && res.data.navs.length > 0
              ? res.data.navs
              : JSON.parse(JSON.stringify(this.defaultNavs))
          this.form = {
            id: res.data.id,
            storeName: res.data.storeName,
            serviceScopeName: JSON.parse(res.data.serviceScopeName),
            banners,
            navTitle: res.data.navTitle,
            navs,
            menuTitle: res.data.menuTitle,
            productIds: "",
          };
          this.navShow = res.data.navStatus === 0 ? true : false,
          this.productList = res.data.products;
        }
      })
    },
    // 获取分类选项配置
    async getAllConfig() {
      getConfig().then(async (res) => {
        this.categoryOptions = res.data.cats
      })
    },
    // 打开裁剪框
    openCropping(type, index) {
      this.uploadType = type
      this.uploadIndex = index
      this.$refs['znPictureCropping'].openPopOver(type, index)
    },
    // 更新上传数据
    uploadImg(data) {
      if (data.type === 'banner') {
        this.form.banners[data.index].img_src = data.url
      } else {
        this.form.navs[data.index].img_src = data.url
      }
    },
    // 删除图片
    removeImg(type, index) {
      if (type === 'banner') {
        this.form.banners[index].img_src = ''
      } else if (type === 'nav') {
        this.form.navs[index].img_src = ''
      } else {
        this.productList.splice(index, 1)
      }
    },
    // 删除选项
    removeItem(type, index) {
      if (type === 'banner') {
        this.form.banners.splice(index, 1)
      } else {
        this.form.navs.splice(index, 1)
      }
    },
    // 增加操作
    addOperate(type) {
      if (type === 'banner') {
        this.form.banners.push({
          img_src: '',
          banner_href: '',
          banner_title: '',
        })
      } else {
        this.form.navs.push({
          type: '',
          img_src: '',
          nav_title: '',
          category_ids: [],
          product_id: '',
          name: '',
        })
      }
    },
    // 选择分类
    choiceType(type, index) {
      this.$refs['selectPopover'][index].doClose()
      this.currentIndex = index
      let ids = []
      if (type === 1) {
        ids = this.form.navs[index].category_ids
        this.$refs['addCategory'].show(ids)
      } else {
        ids = [this.form.navs[index].product_id]
        this.$refs['addProduct'].show(ids)
      }
    },
    // 添加商品
    addProduct() {
      let ids = this.productList.map((item) => item.id)
      this.$refs['addProduct'].show(ids, 'list')
    },
    // 导航选择单个商品/多个分类
    updateProduct(list, type) {
      if (type === 'category') {
        this.form.navs[this.currentIndex].category_ids = list.map(
          (item) => item.id
        )
        this.form.navs[this.currentIndex].name = list
          .map((item) => item.pname)
          .join(',')
        this.form.navs[this.currentIndex].type = 1
        this.form.navs[this.currentIndex].product_id = ''
      } else if (type === 'product') {
        this.form.navs[this.currentIndex].product_id = list[0].id
        this.form.navs[this.currentIndex].type = 2
        this.form.navs[this.currentIndex].name = list[0].product_name
        this.form.navs[this.currentIndex].category_ids = []
      } else {
        this.productList = list
      }
    },
    // 保存操作
    save() {
      this.$refs['shopForm'].validate((valid) => {
        if (valid) {
          let formData = JSON.parse(JSON.stringify(this.form))
          saveDraft({
            ...formData,
            navStatus: this.navShow ? 0 : 1,
            serviceScopeName: JSON.stringify(this.form.serviceScopeName),
            productIds: this.productList.map((item) => item.id).join(','),
          }).then((res) => {
            if (res.code === 200) {
              this.$notify({
                title: '成功',
                message: '信息保存成功！',
                type: 'success',
                duration: 1000
              })
              this.getSettingData()
            }
          })
        }
      })
    },
    // 发布操作
    publish() {
      this.$refs['shopForm'].validate((valid) => {
        if (valid) {
          let formData = JSON.parse(JSON.stringify(this.form))
          saveDraft({
            ...formData,
            navStatus: this.navShow ? 0 : 1,
            serviceScopeName: JSON.stringify(this.form.serviceScopeName),
            productIds: this.productList.map((item) => item.id).join(','),
          }).then((res) => {
            if (res.code === 200) {
              publishStore({
                ...formData,
                serviceScopeName: JSON.stringify(this.form.serviceScopeName),
                productIds: this.productList.map((item) => item.id).join(','),
              }).then((res) => {
                if (res.code === 200) {
                  this.$notify({
                    title: '发布成功',
                    message: '店铺装修已发布',
                    type: 'success',
                    duration: 1000
                  })
                  this.getSettingData()
                }
              })
            }
          })
        }
      })
    },
  },
}
</script>
<style lang="scss">
.select-choice {
  padding: 0 8px 0 16px;
  line-height: 38px;
  cursor: pointer;
  &:hover,
  &:focus {
    background: $base-fill-2;
  }
}
</style>
<style lang="scss" scoped>
.shop-decoration-container {
  display: flex;
  .zn-icon {
    margin-right: 0;
  }
  .default-img {
    border-radius: 8px;
    background: $base-fill-3;
  }
  .mobile-tag {
    top: 0px;
    left: 0px;
    z-index: 99;
    border: none;
    height: unset;
    line-height: 38px;
    min-width: 90px;
    text-align: center;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
  }
}
// 左侧预览样式
.shop-left {
  width: calc(100% - 470px);
  height: 100%;
  padding: 40px 0 0;
  border-right: 1px solid #e5e6eb;
  .mobile-view {
    width: 379px;
    height: 100%;
    border: 2px dashed $base-line-2;
    box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.1);
    img {
      display: block;
    }
  }
  .mobile-content {
    height: calc(100% - 88px - 90px);
    padding: 0 24px;
    margin-left: -132px;
    overflow-y: hidden;
    overflow-x: hidden;
    .pl-132 {
      padding-left: 132px;
    }
    &:hover{
      overflow-y: overlay;
    }
  }
  .mobile-banner {
    margin-bottom: 40px;
    &::before {
      content: '';
      position: absolute;
      left: -24px;
      top: -24px;
      right: -24px;
      bottom: 0px;
      border: 2px solid $base-Brand1-6;
      background: rgba(0, 91, 217, 0.1);
      z-index: 0;
      display: none;
    }
    &.active::before {
      display: block;
    }
    ::v-deep .el-carousel {
      z-index: 1;
      overflow: hidden;
      .el-carousel__item {
        padding-bottom: 30px;
      }
      .el-carousel__button {
        background: #d8d8d8;
        opacity: 1;
      }
      .is-active {
        .el-carousel__button {
          background: $base-text-5;
        }
      }
    }
    .banner-img {
      height: 100%;
    }
    .banner-title {
      left: 0;
      bottom: 0;
      right: 0;
      height: 80px;
      line-height: 80px;
      border-radius: 0 0 8px 8px;
      background: rgba(0, 0, 0, 0.01);
      backdrop-filter: blur(15px);
      color: #fff;
      font-size: 18px;
      font-weight: 500;
    }
    .zn-icon {
      width: 150px;
      height: 150px;
    }
  }
  .mobile-nav {
    line-height: 25px;
    margin-bottom: 30px;
    &-title {
      font-size: 20px;
    }
    &-more {
      color: $base-text-3;
      .zn-icon {
        width: 18px;
        height: 18px;
        margin-right: -4px;
        transform: rotate(-90deg);
      }
    }
    .nav-ul {
      overflow-x: auto;
    }
    .nav-item {
      width: 103px;
      margin-right: 8px;
      &:last-child {
        margin-right: 0;
      }
      .nav-img {
        border-radius: 8px;
        background: $base-fill-3;
      }
      .nav-img,
      .default-img {
        width: 103px;
        height: 103px;
        .zn-icon {
          width: 90px;
          height: 90px;
        }
      }
      .nav-name {
        font-size: 16px;
        text-align: center;
      }
    }
  }
  .mobile-product {
    line-height: 25px;
    margin-bottom: 30px;
    &-title {
      font-size: 20px;
    }
    .product-ul {
      margin-right: -24px;
      flex-wrap: wrap;
    }
    .product-item {
      width: 156px;
      margin-right: 16px;
      .product-img,
      .default-img {
        width: 156px;
        height: 156px;
        .zn-icon {
          width: 112px;
          height: 112px;
        }
      }
      .product-name {
        font-size: 16px;
      }
      .product-tags {
        margin-right: -8px;
        span {
          border: none;
          height: unset;
          line-height: 25px;
          padding: 0 4px;
          background: $base-fill-3;
          border-radius: 4px;
          color: $base-text-4;
          display: block;
          margin: 4px 8px 4px 0;
          font-size: 12px;
        }
      }
      .product-price {
        height: 25px;
        font-size: 12px;
        font-weight: bold;
        span {
          display: inline-block;
          font-size: 20px;
          font-weight: bold;
        }
      }
    }
  }
}
// 右侧样式
.shop-right {
  width: 470px;
  height: 100%;
  position: relative;
  .shop-form {
    padding: 16px 16px 100px;
    max-height: 100%;
    overflow-y: hidden;
    &:hover{
      overflow-y: overlay;
    }
    .el-cascader,
    .el-select {
      width: 100%;
    }
    ::v-deep .el-input-group__append {
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
  .title {
    font-size: 16px;
    font-weight: 500;
  }
  .item {
    border: 1px solid $base-line-3;
    padding: 16px;
    border-radius: 4px;
    &-img {
      width: 100px;
      height: 100px;
      border-radius: 2px;
      border: 1px dashed $base-line-3;
      background: $base-fill-4;
    }
    &-thumbnail:hover {
      .thum-remove {
        opacity: 1;
        pointer-events: fill;
      }
    }
    &-info {
      width: calc(100% - 100px);
      .el-form-item:last-child {
        margin-bottom: 0;
      }
    }
    &-remove {
      width: 22px;
      height: 22px;
      border-radius: 100%;
      top: -11px;
      right: -11px;
      background: $base-Error-1;
      color: $base-Error-6;
      transition: all ease 0.25s;
      opacity: 0;
      pointer-events: none;
      .zn-icon {
        font-weight: bold;
        margin-right: 0;
      }
    }
    &:hover {
      .project-remove {
        opacity: 1;
        pointer-events: fill;
      }
    }
    &-tip {
      left: 0;
      bottom: 0;
      right: 0;
      height: 22px;
      line-height: 22px;
      text-align: center;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      font-size: 12px;
      color: $base-text-5;
    }
  }
  .el-button-add {
    width: 100%;
    font-weight: 500;
    border: none;
    padding: 0;
    line-height: 48px;
    border-radius: 4px;
    ::v-deep i {
      font-weight: bold;
    }
  }
  .banner {
    line-height: 24px;
    &-tip {
      font-size: 12px;
      color: $base-text-3;
    }
  }
  .nav {
    line-height: 24px;
    position: relative;
    &::after{
      content: '';
      position: absolute;
      left: -16px;
      right: -16px;
      height: 1px;
      background: #E5E6EB;
    }
  }
  .product {
    &-ul {
      flex-wrap: wrap;
    }
    &-list {
      padding: 16px 0px 16px 24px;
      background: $base-fill-2;
      margin: 0 -24px;
    }
    .product-item {
      width: 92px;
      height: 92px;
      border-radius: 4px;
      background: $base-fill-4;
      margin-top: 8px;
      margin-bottom: 8px;
      &.product-add {
        border: 1px dashed $base-line-3;
      }
      img {
        width: 92px;
        height: 92px;
        border-radius: 4px;
      }
      &:hover {
        .item-remove {
          opacity: 1;
          pointer-events: fill;
        }
      }
    }
    .product-item-title {
      left: 0;
      bottom: 0;
      right: 0;
      line-height: 22px;
      padding: 0 8px;
      font-size: 12px;
      font-weight: 500;
      text-align: center;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      border-radius: 0 0 4px 4px;
    }
  }
  .shop-footer {
    justify-content: flex-end;
    background: #fff;
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 1;
    padding: 10px 24px;
    border-top: 1px solid $base-line-2;
    text-align: right;
    .el-button {
      padding: 0;
      min-width: 68px;
      line-height: 36px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: bold;
      border: none;
      font-weight: 400;
    }
    .el-save {
      background: $base-fill-3;
    }
  }
}
</style>
