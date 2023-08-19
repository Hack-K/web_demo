<template>
  <div id="rich-text-editor" :class="'rich-text-editor theme-' + this.styleTheme">
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
      /* 样式主题 */
      styleTheme: {
        type: Number,
        default: () => 1
      }
    },
    data() {
      return {
        base_url: process.env.VUE_APP_BASE_API,
        editor: null,
        html: this.htmlValue,
        toolbarConfig: {
          // 工具栏菜单配置
          toolbarKeys: [
            'headerSelect',
            'fontSize',
            'color',
            {
              key: 'group-more-style', // 必填，要以 group 开头
              iconSvg:
                '<svg t="1670307980700" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3050" width="200" height="200"><path d="M825.7536 168.5504H340.5824c-18.2272 0-32.9728 14.7456-32.9728 32.9728v98.304c0 18.2272 14.7456 32.9728 32.9728 32.9728h485.1712c18.2272 0 32.9728-14.7456 32.9728-32.9728v-98.304c0.2048-18.0224-14.7456-32.9728-32.9728-32.9728zM825.7536 690.9952H340.5824c-18.2272 0-32.9728 14.7456-32.9728 32.9728v98.304c0 18.2272 14.7456 32.9728 32.9728 32.9728h485.1712c18.2272 0 32.9728-14.7456 32.9728-32.9728v-98.304c0.2048-18.2272-14.7456-32.9728-32.9728-32.9728zM340.5824 594.3296h308.0192c18.2272 0 32.9728-14.7456 32.9728-32.9728v-98.304c0-18.2272-14.7456-32.9728-32.9728-32.9728H340.5824c-18.2272 0-32.9728 14.7456-32.9728 32.9728v98.304c0 18.0224 14.7456 32.9728 32.9728 32.9728zM191.0784 134.7584c-15.9744 0-29.0816 12.9024-29.0816 29.0816v696.32c0 15.9744 12.9024 29.0816 29.0816 29.0816s29.0816-12.9024 29.0816-29.0816V163.84c0-15.9744-12.9024-29.0816-29.0816-29.0816z" fill="" p-id="3051"></path></svg>', // 可选
              menuKeys: [
                'justifyLeft',
                'justifyRight',
                'justifyCenter',
                'justifyJustify',
              ], // 下级菜单 key ，必填
            },
            'bold',
            'underline',
            'italic',
            'uploadImage',
          ],
        },
        editorConfig: {
          // 编辑器配置
          placeholder: '请输入内容...', // 占位符
          readOnly: this.readOnly, // 是否只读
          autoFocus: false, // 默认编辑器是否选中
          MENU_CONF: {
            uploadImage: {
              server: false,
              customUpload: async (file, insertImage) => {
                let formData = new FormData()
                let key = `${this.qNConfig['base_path']}/${this.randomStr(30)}.${this.extname(file['name'])}`
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
      onChange(editor){
        this.$emit('htmlUpdate', editor.getHtml())
      },
      // 编辑器失焦事件
      onBlur() {
        this.$emit('htmlUpdate', this.editor.getHtml())
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
    },
  })
</script>
<style src="@wangeditor/editor/dist/css/style.css"></style>
<style lang="scss" scoped>
  .rich-text-editor {
    width: 100%;
    border-radius: 8px;
    background: $base-fill-2;
    overflow: hidden;
    /* 菜单栏 */
    ::v-deep .editor-tool-bar {
      padding: 8px;
      .w-e-bar{
        padding: 0;
        border-radius: 6px;
        background-color: #fff!important;
      }
      .w-e-bar-item button{
        width: unset!important;
        font-size: 12px;
        padding: 0 6px;
      }
    }
    /* 内容栏 */
    ::v-deep .editor-content {
      height: 300px;
      overflow-y: hidden;
      .w-e-text-container{
        background: transparent;
        p{
          margin: 8px 0;
        }
      }
      .w-e-text-placeholder{
        top: 8px;
        line-height: 24px;
      }
    }
  }
  /* 样式主题二 */
  .theme-2{
    background: #fff;
    ::v-deep .editor-tool-bar {
      padding: 0px;
      .w-e-bar{
        border-radius: 0;
        background-color: $base-fill-2!important;
      }
    }  
    ::v-deep .editor-content {
      height: calc(100% - 40px);
    }
  }
</style>
