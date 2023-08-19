<template>
  <div>
    <el-upload
      :action="uploadImagesURL"
      :headers="headers"
      list-type="picture-card"
      accept="image/jpeg,image/gif,image/png,image/jpg"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :limit="1"
      name="file"
      :data="uploadData"
      :on-success="handleSuccess"
      :before-upload="handleBeforeUpload"
      :file-list="fileList"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { baseURL } from '@/config'
import { getToken } from '@/api/service/product'
export default {
  name: 'bgiUpload',
  props: {
    fileList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      headers: {},
      uploadImagesURL: 'https://up-z2.qiniup.com',
      dialogImageUrl: '',
      dialogVisible: false,
      uploadData: {
        type: 'image',
      },
    }
  },
  computed: {
    ...mapGetters({
      token: 'user/token',
    }),
  },
  created() {
    this.headers['Authorization'] = `${this.token}`
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },

    // 图片上传
    handleSuccess(res, file, fileList) {
      if (res['key']) {
        let { domain, key } = this.uploadData
        let params = {
          name: key,
          status: 'success',
          uid: new Date().getTime(),
          url: `${domain}/${key}`,
        }
        this.fileList.splice(0, 1, params)
        this.$emit('set-url', params)
      }
    },
    // 上传文件之前的钩子
    async handleBeforeUpload(file) {
      return await new Promise((r, e) => {
        if (
          !(
            file.type === 'image/png' ||
            file.type === 'image/gif' ||
            file.type === 'image/jpg' ||
            file.type === 'image/jpeg'
          )
        ) {
          this.$notify({
            title: '提示',
            message:
              '请上传格式为image/png, image/gif, image/jpg, image/jpeg的图片',
            type: 'warning',
            duration: 1000
          })
          e(false)
        } else {
          getToken().then((res) => {
            let key = res.data.base_path + '/' + this.randomStr(30) + '.' + this.extname(file['name'])
            this.uploadData = { ...res.data, key }
            r(this.uploadData)
          })
        }
      })
    },
    randomStr(length) {
      let result = ''
      let characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      let charactersLength = characters.length
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        )
      }
      return result
    },
    extname(filename) {
      if (!filename || typeof filename != 'string') {
        return false
      }
      let a = filename.split('').reverse().join('')
      return a.substring(0, a.search(/\./)).split('').reverse().join('')
    },
  },
}
</script>