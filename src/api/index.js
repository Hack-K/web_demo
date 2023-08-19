import request from '@/utils/request'
import { encryptedData } from '@/utils/encrypt'
import { loginRSA } from '@/config'
// 登录
export async function login(data) {
  if (loginRSA) {
    data = await encryptedData(data)
  }
  return request({
    url: '/common/login/username',
    method: 'post',
    data,
  })
}


// 获取验证码
export function sendSms(params) {
  return request({
    url: '/common/sms',
    method: 'get',
    params,
  })
}


// RSA加密登录
export async function socialLogin(data) {
  if (loginRSA) {
    data = await encryptedData(data)
  }
  return request({
    url: '/socialLogin',
    method: 'post',
    data,
  })
}
// 获取用户信息
export function getUserInfo() {
  return request({
    url: '/common/getUserInfo',
    method: 'get',
  })
}
// 登出
export function logout() {
  return request({
    url: '/common/logout',
    method: 'get',
  })
}

export function register(data) {
  return request({
    url: '/register',
    method: 'post',
    data,
  })
}
// 获取视图
export function viewsTabs(params) {
  return request({
    url: '/table/views',
    method: 'get',
    params,
  })
}
// 视图字段获取
export function getTableHeader(params) {
  return request({
    url: '/table/builder',
    method: 'get',
    params,
  })
}
// 视图字段保存
export function saveHeader(data) {
  return request({
    url: '/table/saveHeader',
    method: 'post',
    data,
  })
}
// 获取筛选规则
export function filterRules(params) {
  return request({
    url: '/table/getFilterRules',
    method: 'get',
    params,
  })
}
// 视图筛选保存
export function saveFilters(data) {
  return request({
    url: '/table/saveFilters',
    method: 'post',
    data,
  })
}
// 视图筛选获取
export function filters(params) {
  return request({
    url: '/table/getFilters',
    method: 'get',
    params,
  })
}
// 新版视图获取
export function newViewsTabs(params) {
  return request({
    url: '/table/viewsV2',
    method: 'get',
    params,
  })
}
// 新版视图字段获取
export function newGetTableHeader(params) {
  return request({
    url: '/table/builderV2',
    method: 'get',
    params,
  })
}

// 新版视图字段保存
export function newSaveHeader(data) {
  return request({
    url: '/table/saveHeaderV2',
    method: 'post',
    data,
  })
}
// 新版视图筛选获取
export function newFilters(params) {
  return request({
    url: '/table/getFiltersV2',
    method: 'get',
    params,
  })
}
// 新版视图筛选保存
export function newSaveFilters(data) {
  return request({
    url: '/table/saveFiltersV2',
    method: 'post',
    data,
  })
}
// 新版视图添加
export function newAddView(data) {
  return request({
    url: '/table/addView',
    method: 'put',
    data,
  })
}
// 新版视图重命名
export function newEditView(data) {
  return request({
    url: '/table/editView',
    method: 'post',
    data,
  })
}
// 新版视图复制
export function newCopyView(data) {
  return request({
    url: '/table/copyView',
    method: 'post',
    data,
  })
}
// 新版视图删除
export function newDelView(data) {
  return request({
    url: '/table/delView',
    method: 'post',
    data,
  })
}
// 远程搜索单选
export function optionsList(params) {
  return request({
    url: '/common/search',
    method: 'get',
    params,
  })
}
// 文件上传
export function uploadFiles(data) {
  return request({
    url: '/common/uploadFiles',
    method: 'post',
    data,
  })
}
// 图片上传
export function uploadImages(data) {
  return request({
    url: '/common/uploadImages',
    method: 'post',
    data,
  })
}
// 进程管理
export function downloadFileLog(params) {
  return request({
    url: '/common/downloadFileLog',
    method: 'get',
    params,
  })
}
// 话务人员列表
export function getAgentList(params) {
  return request({
    url: '/common/getAgentList',
    method: 'get',
    params,
  })
}
// 获取省市区地区
export function getRegion(params) {
  return request({
    url: '/common/getRegion',
    method: 'get',
    params,
  })
}
// 获取公用配置
export function getConfigData(params) {
  return request({
    url: '/common/getConfigData',
    method: 'get',
    params,
  })
}

// 更新话务员接听方式
export function updateCallModel(data) {
  return request({
    url: '/common/upSip',
    method: 'post',
    data,
  })
}

// 修正遮罩
export function correctModal(parentClassName){
  if(!parentClassName) return
  let modal = document.querySelector("body>.v-modal");
  let parentElement = document.querySelector(`.${parentClassName}`);
  if(parentElement){
    parentElement.append(modal);
  }
}
// 请确认每项 prop 校验规则增加同名 ref
export function scrollView(object, _this){
  for(const i in object){
    let DomComponent = _this.$refs[i]
    // 处理某项为数组循环的情况
    if(Object.prototype.toString.call(DomComponent) !== '[object Object]'){
      DomComponent = DomComponent[0]
    }
    // 调用组件自身的滑动方法
    DomComponent.$el.scrollIntoView({
      block: "start",
      behavior: "smooth"
    })
    // 我们只需检查一项即可
    break;
  }
}

// 文件下载
export function download(item) {
  let link = document.createElement('a')
  link.style.display = 'none'
  link.href = item.url
  link.setAttribute('download', item.title) //指定下载后的文件名，防跳转
  document.body.appendChild(link)
  link.click()
}

// 工作台-我的客户
export function myMemberList(params) {
  return request({
    url: '/workbench/myMemberList',
    method: 'get',
    params,
  })
}

//验证码登录
export function loginMobile(data) {
  return request({
    url: '/common/login/mobile',
    method: 'post',
    data,
  })
}

//修改密码
export function editPwd(data) {
  return request({
    url: '/common/editPwd',
    method: 'put',
    data,
  })
}

// 收集错误日志
export function errorLog(data) {
  return request({
    url: '/error/log',
    method: 'post',
    data,
  })
}

// 获取七牛云配置
export function getQiniuConfig(params) {
  return request({
    url: '/common/token',
    method: 'get',
    params,
  })
}

// 获取全局配置
export function getCommonData(params) {
  return request({
    url: '/common/getConfigData',
    method: 'get',
    params,
  })
}



