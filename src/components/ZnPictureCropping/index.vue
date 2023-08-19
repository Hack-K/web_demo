<template>
  <div>
    <el-dialog
      :visible.sync="drawer"
      :width="boxWidth + 50 + 'px'"
      append-to-body
      center
      custom-class="zn-picture-cropping"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      ref="dialog"
    >
      <ImgCutter
        ref="imgCutterModal"
        fileType="jpeg"
        :crossOrigin="true"
        crossOriginHeader="*"
        rate=""
        toolBgc="none"
        :isModal="false"
        :lockScroll="true"
        :boxWidth="boxWidth"
        :boxHeight="boxHeight"
        :cutWidth="cutWidth"
        :cutHeight="cutHeight"
        :sizeChange="sizeChange"
        :moveAble="true"
        :imgMove="true"
        :originalGraph="false"
        :WatermarkText="WatermarkText"
        WatermarkTextFont="14px Sans-serif"
        :WatermarkTextColor="WatermarkTextColor"
        :WatermarkTextX="WatermarkTextX"
        :WatermarkTextY="WatermarkTextY"
        :smallToUpload="true"
        :saveCutPosition="true"
        :scaleAble="true"
        :previewMode="true"
        :quality="1"
        :toolBoxOverflow="toolBoxOverflow"
        @cutDown="cutDown"
        @onClearAll="onClearAll"
      >
        <template #cancel>
          <el-button class="cancel-btn" @click="cancel">取消</el-button>
        </template>
      </ImgCutter>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios'
  import { getQiniuConfig } from '@/api'
  import ImgCutter from 'vue-img-cutter'
  export default {
    name: 'ZnPictureCropping',
    components: {
      ImgCutter,
    },
    props: {
      boxWidth: {
        // 裁剪组件宽度
        type: Number,
        default: () => 850,
      },
      boxHeight: {
        // 裁剪组件高度
        type: Number,
        default: () => 520,
      },
      sizeChange: {
        // 是否允许改变选择框
        type: Boolean,
        default: () => true,
      },
      cutWidth: {
        // 选择框宽度
        type: Number,
        default: () => 350,
      },
      cutHeight: {
        // 选择框高度
        type: Number,
        default: () => 250,
      },
      WatermarkText: {
        // 水印文字
        type: String,
        default: () => '',
      },
      WatermarkTextColor: {
        // 水印颜色
        type: String,
        default: () => '#fff',
      },
      WatermarkTextX: {
        // 水印位置[X轴]
        type: Number,
        default: () => 0.95,
      },
      WatermarkTextY: {
        // 水印位置[Y轴]
        type: Number,
        default: () => 0.95,
      },
      toolBoxOverflow: {
        // 裁剪是否允许超出图片边界
        type: Boolean,
        default: () => true,
      },
    },
    data() {
      return {
        drawer: false,
        baseUrl: '', // 域名
        basePath: '', // 文件路径
        qiniuToken: '', // 七牛 token
      }
    },
    created(){
      this.getQiniuConfig()
    },
    methods: {
      // 获取七牛参数
      getQiniuConfig() {
        getQiniuConfig().then((res) => {
          if (res.code === 200) {
            this.qiniuToken = res.data.token
            this.baseUrl = res.data.domain
            this.basePath = res.data.base_path
          }
        })
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
      async uploadChange(file) {
        this.loading = true
        let key = `${this.basePath}/${this.randomStr(30)}.${this.extname(file['name'])}`
        let formData = new FormData()
        formData.append('token', this.qiniuToken)
        formData.append('file', file)
        formData.append('key', key)
        await this.uploadFileRequest(formData)
        setTimeout(() => {
          this.$emit('uploadImg', {
            url: this.baseUrl + '/' + key
          })
          this.drawer = false
        }, 1000)
        this.loading = false
      },
      // 打开裁剪框
      openPopOver(){
        this.drawer = true
      },
      // 图片裁剪完成
      cutDown(res) {
        this.uploadChange(res.file)
      },
      // 清空画布
      onClearAll(){
        this.drawer = false
      },
      // 取消操作
      cancel(){
        this.$emit("uploadCancel")
      }
    },
  }
</script>

<style lang="scss" scoped>
.cancel-btn{
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
  border-radius: 4px;
  font-size: 14px;
}
</style>
