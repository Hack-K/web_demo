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
                <el-carousel height="192px" arrow="never" :autoplay="false">
                  <el-carousel-item
                    v-for="(item, index) in form.banners"
                    :key="index"
                  >
                    <div class="pos-relative height-100">
                      <div v-if="item.ImgSrc" class="banner-img">
                        <img :src="item.ImgSrc" />
                      </div>
                      <div class="default-img flex-column height-100" v-else>
                        <zn-icon :iconName="'icon-default-pic'" />
                      </div>
                    </div>
                  </el-carousel-item>
                </el-carousel>
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
            :cutWidth="527"
            :cutHeight="264"
            @uploadImg="uploadImg"
          />
          <el-form
            ref="shopForm"
            class="create-form"
            label-position="top"
            :model="form"
            :rules="rules"
          >
            <!-- 广告位 -->
            <div class="banner mb-16">
              <div class="title banner-title mb-10">
                广告位
                <span class="banner-tip pl-8">建议上传750*514尺寸图片</span>
              </div>
              <div
                class="item flex mb-16 pos-relative"
                v-for="(item, index) in form.banners"
                :key="index"
              >
                <el-form-item 
                    class="banner-form"
                    :prop="`banners.${index}.ImgSrc`"
                    :rules="rules.ImgSrc"
                    :ref="`banners.${index}.ImgSrc`"
                >
                    <div
                    v-if="item.ImgSrc"
                    class="item-thumbnail pos-relative pointer"
                    >
                    <img
                        :src="item.ImgSrc + '?imageView2/1/w/100/h/100'"
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
                </el-form-item>
                <div class="item-info pl-16">
                  <el-form-item>
                    <el-input
                      placeholder="(选填）请输入同公司主体公众号链接"
                      v-model="item.BannerHref"
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
          </el-form>
        </div>
        <div class="shop-footer">
          <el-button class="el-save" @click="save(0)">保存</el-button>
          <el-button type="primary" @click="save(1)">发布</el-button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { getStore, saveStore } from "@/api/chamber/shop"
  export default {
    name: 'ShopDecoration',
    data() {
      return {
        current: 1,
        uploadType: '',
        uploadIndex: '',
        currentIndex: "", // 当前导航索引
        form: {
          banners: [
            {
              ImgSrc: '',
              BannerHref: '',
              BannerTitle: '',
            },
          ],
          publish_status: ""
        },
        defaultBanners: [
          {
            ImgSrc: '',
            BannerHref: '',
            BannerTitle: '',
          },
        ],
        rules: {
          ImgSrc: [
            { required: true, trigger: 'change', message: '图片未上传' },
          ],  
          BannerTitle: [
            { required: true, trigger: 'blur', message: '广告标题未填写' },
          ],
          BannerHref: [
            { required: true, trigger: 'blur', message: '广告路径未选择' },
          ],
        },
      }
    },
    async created() {
      await this.getSettingData()
    },
    methods: {
      // 获取商城配置
      async getSettingData() {
        getStore().then(async (res) => {
          if (res.code === 200) {
            let banners =
              res.data && res.data.banners
                ? res.data.banners
                : JSON.parse(JSON.stringify(this.defaultBanners))
            this.form = {
              banners,
            };
          }
        })
      },
      // 打开裁剪框
      openCropping(type, index) {
        this.uploadType = type
        this.uploadIndex = index
        this.$refs['znPictureCropping'].openPopOver()
      },
      // 更新上传数据
      uploadImg(data) {
        if (this.uploadType === 'banner') {
          this.form.banners[this.uploadIndex].ImgSrc = data.url
        }
      },
      // 删除图片
      removeImg(type, index) {
        if (type === 'banner') {
          this.form.banners[index].ImgSrc = ''
        }
      },
      // 删除选项
      removeItem(type, index) {
        if (type === 'banner') {
          this.form.banners.splice(index, 1)
        }
      },
      // 增加操作
      addOperate(type) {
        if (type === 'banner') {
          this.form.banners.push({
            ImgSrc: '',
            BannerHref: '',
            BannerTitle: '',
          })
        }
      },
      // 保存操作
      save(status) {
        this.$refs['shopForm'].validate((valid,object) => {
          if (valid) {
            saveStore({
                ...this.form,
                publish_status: status
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
          }else{
            this.$scrollView(object, this)
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
      overflow-y: auto;
      overflow-x: hidden;
      .pl-132 {
        padding-left: 132px;
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
  }
  // 右侧样式
  .shop-right {
    width: 470px;
    height: 100%;
    position: relative;
    .shop-form {
      padding: 16px 16px 100px;
      max-height: 100%;
      overflow-y: auto;
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
  