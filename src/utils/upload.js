import { getQiniuConfig } from '@/api/index'
import axios from 'axios'
class uploadFileService {
  base_path = ''
  domain = ''
  token = ''
  upload_url = 'https://up-z2.qiniup.com'
  constructor() {}
  async getToken() {
    return await new Promise(async (r) => {
      let { data } = await getQiniuConfig()
      this.base_path = data['base_path']
      this.domain = data['domain']
      this.token = data['token']
      r(data)
    })
  }

  async uploadFile(files) {
    let config = await this.getToken()
    let fileList = []
    for (let index = 0; index < files.length; index++) {
      const file = files[index]
      let key = this.setFileKey(file)
      let formData = new FormData()
      formData.append('token', this.token)
      formData.append('file', file)
      formData.append('key', key)
      let uploadFileResponse = await axios({
        method: 'post',
        url: this.upload_url,
        headers: { 'Content-Type': 'multipart/form-data' },
        data: formData,
      })
      let u = this.getImagePath(key)
      fileList.push(u)
    }
    return fileList
  }

  setFileKey(file) {
    let file_name =
      this.base_path +
      '/' +
      this.randomStr(30) +
      '.' +
      this.extname(file['name'])
    return file_name
  }

  getImagePath(key) {
    return this.domain + '/' + key
  }

  randomStr(length) {
    let result = ''
    let characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let charactersLength = characters.length
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  }
  extname(filename) {
    if (!filename || typeof filename != 'string') {
      return false
    }
    let a = filename.split('').reverse().join('')
    return a.substring(0, a.search(/\./)).split('').reverse().join('')
  }
}

export default uploadFileService
