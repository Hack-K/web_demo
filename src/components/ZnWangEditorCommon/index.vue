<template>
  <div id="rich-text-editor" class="rich-text-editor">
    <!-- 工具栏 -->
    <Toolbar
      class="editor-tool-bar"
      :editor="editor"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <!-- 编辑器 -->
    <Editor
      class="editor-content"
      v-model="html"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="onCreated"
      @onBlur="onBlur"
      @onChange="onChange"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import axios from 'axios'

axios.interceptors.request.use(
  (config) => {
    //携带token
    let token =
      localStorage.getItem('zn-admin-token') ||
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJZR0wiLCJhdWQiOiIiLCJpYXQiOjE2NzAyOTE1MjIsIm5iZiI6MTY3MDI5MTUyMiwiZGF0YSI6eyJ1aWQiOjEsImFwcF9pZCI6MSwiaXNfaGVhZCI6bnVsbCwiY2xpZW50X2NvZGUiOm51bGx9fQ.n0-DttKNoHbC0G6uZVlPVGX4ASArLChS26Nb70vDixA'
    if (token) {
      config.headers['Authorization'] = `${token}`
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

export default Vue.extend({
  components: { Editor, Toolbar },
  props: {
    htmlValue: {
      // 回显数据
      type: String,
      default: () => '',
    },
    readOnly: {
      // 是否禁用
      type: Boolean,
      default: () => false,
    },
    disable: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      base_url: process.env.VUE_APP_BASE_API,
      editor: null,
      html: this.htmlValue,
      toolbarConfig: {
        // 工具栏菜单配置
        toolbarKeys: ['bold', 'italic', 'underline', 'color', 'uploadImage'],
      },
      editorConfig: {
        // 编辑器配置
        readOnly: this.readOnly, // 是否只读
        autoFocus: false, // 默认编辑器是否选中
        placeholder: '请输入内容',
        MENU_CONF: {
          uploadImage: {
            server: false,
            customUpload: async (file, insertImage) => {
              let formData = new FormData()
              let key = `${this.qNConfig['base_path']}/${this.randomStr(
                30
              )}.${this.extname(file['name'])}`
              formData.append('token', this.qNConfig['token'])
              formData.append('file', file)
              formData.append('key', key)
              let upload_response = await this.uploadFileRequest(formData)
              if (upload_response['status'] === 200) {
                let url = `${this.qNConfig['domain']}/${upload_response['data']['key']}`
                insertImage(url)
              }
            },
          },
        },
      },
      mode: 'default',
      qNConfig: {},
    }
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor)
    },
    // 监听数据变化
    onChange(editor) {
      // 选中文字
      const selectionText = editor.getSelectionText()
      const text = editor.getText().replace(/\n|\r/gm, '')
      this.$emit('htmlUpdate', { content: editor.getHtml(), text })
    },
    // 编辑器失焦事件
    onBlur() {
      const selectionText = this.editor.getSelectionText()
      const text = this.editor.getText().replace(/\n|\r/gm, '')
      this.$emit('htmlUpdate', { content: this.editor.getHtml(), text })
      return this.editor.getHtml()
    },
    // 请求token地址
    getUrl(url) {
      return this.base_url + url
    },
    // 获取token
    getToken() {
      return new Promise(async (resolve) => {
        let request_url = this.getUrl('/common/token')
        let token_response = await this.requestsGet(request_url)
        this.qNConfig = token_response['data']
      })
    },
    /*发起Get请求*/
    async requestsGet(url) {
      return await new Promise(async (resolve) => {
        let response = await axios.get(url)
        resolve(response['data'])
      })
    },
    getEditTextlength() {
      const content = this.editor.getHtml()
      const text = this.editor.getText().replace(/\n|\r/gm, '')
      return { content, text }
    },
    // 上传七牛云
    async uploadFileRequest(data) {
      return await new Promise(async (resolve) => {
        resolve(
          axios({
            method: 'post',
            url: 'https://up-z2.qiniup.com',
            headers: { 'Content-Type': 'multipart/form-data' },
            data,
          })
        )
      })
    },
    // 生成随机数 number生成随机数长度
    randomStr(length) {
      let result = ''
      let characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * characters.length)
        )
      }
      return result
    },
    // 文件后缀
    extname(filename) {
      if (!filename || typeof filename != 'string') {
        return false
      }
      let fileNameArr = filename.split('.')
      return fileNameArr[fileNameArr.length - 1]
    },
  },
  mounted() {
    this.getToken()
  },
  // 卸载编辑器
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  },
  watch: {
    htmlValue(newVal, oldVal) {
      if (newVal) {
        this.editor.setHtml(newVal)
      }
    },
    disable(newVal, oldVal) {
      if (oldVal === true) {
        this.editor.disable()
      }
    },
  },
})
</script>
<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang="scss" scoped>
.rich-text-editor {
  width: 100%;
  border-radius: 8px;
  background: #ffffff;
  overflow: hidden;
  ::v-deep .editor-tool-bar {
    .w-e-bar {
      padding: 0;
      border-radius: 6px;
    }
    .w-e-bar-item button {
      width: unset !important;
      font-size: 12px;
      padding: 0 6px;
    }
  }
  ::v-deep .editor-content {
    height: 500px;
    overflow-y: hidden;
    border-bottom: 1px solid #e5e6eb;
    .w-e-text-container {
      background: transparent;
      p {
        margin: 8px 0;
      }
    }
    .w-e-text-placeholder {
      top: 8px;
      line-height: 24px;
    }
  }
}
</style>
