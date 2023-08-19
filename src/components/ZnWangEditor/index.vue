<template lang="html">
  <div class="editor">
    <div ref="toolbar" class="toolbar"></div>
    <div ref="editor" class="text"></div>
  </div>
</template>

<script>
import axios from 'axios'
import E from 'wangeditor'
// import { getToken } from "@/utils/token";
import { getToken } from '@/api/service/product'
export default {
  name: 'ZnWangEditor',
  data() {
    return {
      baseUrl: process.env.VUE_APP_BASE_API,
      editor: null,
      info_: null,
      loading: false,
      baseUrl: '', // 域名
      basePath: '', // 文件路径
      qiniuToken: '', // 七牛 token
    }
  },
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    menus: {
      type: Array,
    },
    value: {
      type: String,
      default: '',
    },
    isClear: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    isClear(val) {
      // 触发清除文本域内容
      if (val) {
        this.editor.txt.clear()
        this.info_ = null
      }
    },
    value: function (value) {
      if (value !== this.editor.txt.html()) {
        this.editor.txt.html(this.value)
      }
    },
    //value为编辑框输入的内容，这里我监听了一下值，当父组件调用得时候，如果给value赋值了，子组件将会显示父组件赋给的值
  },
  created() {
    this.getQiniuConfig()
  },
  mounted() {
    this.seteditor(this)
    this.editor.txt.html(this.value)
  },
  methods: {
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
    seteditor(_this) {
      // http://192.168.2.125:8080/admin/storage/create
      this.editor = new E(this.$refs.toolbar, this.$refs.editor)
      this.editor.customConfig = this.editor.customConfig
        ? this.editor.customConfig
        : this.editor.config
      this.editor.customConfig.uploadImgShowBase64 = false // base 64 存储图片
      this.editor.customConfig.uploadImgServer =
        this.baseUrl + '/file/minio/upload' // 配置服务器端地址
      this.editor.customConfig.uploadFileName = 'file' // 后端接受上传文件的参数名
      this.editor.customConfig.uploadImgMaxSize = 2 * 1024 * 1024 // 将图片大小限制为 2M
      this.editor.customConfig.uploadImgMaxLength = 6 // 限制一次最多上传 3 张图片
      this.editor.customConfig.uploadImgTimeout = 3 * 60 * 1000 // 设置超时时间

      // 配置菜单
      this.editor.customConfig.menus = this.menus || [
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'link', // 插入链接
        'list', // 列表
        'justify', // 对齐方式
        'quote', // 引用
        'emoticon', // 表情
        'image', // 插入图片
        'table', // 表格
        // "video", // 插入视频
        // "code", // 插入代码
        'undo', // 撤销
        'redo', // 重复
        'fullscreen', // 全屏
      ]
      // 自定义上传图片
      this.editor.config.customUploadImg = async function (
        resultFiles,
        insertImgFn
      ) {
        // resultFiles 是 input 中选中的文件列表
        // insertImgFn 是获取图片 url 后，插入到编辑器的方法
        let fileList = resultFiles
        for (let i = 0; i < fileList.length; i++) {
          let file_item = fileList[i]
          let key =
            _this.basePath +
            _this.randomStr(30) +
            '.' +
            _this.extname(file_item['name'])
          let formData = new FormData()
          formData.append('token', _this.qiniuToken)
          formData.append('file', file_item)
          formData.append('key', key)
          await _this.uploadFileRequest(formData)
          setTimeout(() => {
            // 上传图片，返回结果，将图片插入到编辑器中
            insertImgFn(_this.baseUrl + key)
          }, 500)
        }
      }
      this.editor.customConfig.onchange = (html) => {
        this.info_ = html // 绑定当前逐渐地值
        this.$emit('change', this.info_) // 将内容同步到父组件中
      }

      // 上传图片的错误提示默认使用alert弹出，你也可以自定义用户体验更好的提示方式
      this.editor.customConfig.customAlert = (info) => {
        // info 是需要提示的内容
        this.$message({
          message: info,
          type: 'warning',
        })
      }

      // 创建富文本编辑器
      this.editor.create()
      if (this.disabled) {
        this.editor.disable()
      } else {
        this.editor.enable()
      }
    },
  },
}
</script>

<style lang="scss">
.editor {
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  border-radius: 4px;
  border: 1px solid $base-fill-4;
  img {
    margin: 0 auto;
  }
}
.text {
  min-height: 200px;
}
.w-e-text {
  max-height: 360px;
}
</style>
