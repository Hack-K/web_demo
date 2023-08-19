import request from '@/utils/request'
// 获取用户列表
export function getList(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params,
  })
}
// 用户新增
export function details(params) {
  return request({
    url: '/user/details',
    method: 'get',
    params,
  })
}
// 用户新增
export function doAdd(data) {
  return request({
    url: '/user/add',
    method: 'post',
    data,
  })
}
// 用户编辑
export function doEdit(data) {
  return request({
    url: '/user/edit',
    method: 'put',
    data,
  })
}
// 用户删除
export function doDelete(data) {
  return request({
    url: '/user/del',
    method: 'delete',
    data,
  })
}
// 职务列表
export function jobList(params) {
  return request({
    url: '/user/job',
    method: 'get',
    params,
  })
}
// 成员状态更改
export function memberStatus(data) {
  return request({
    url: '/user/editStatus',
    method: 'put',
    data,
  })
}
// 成员密码重置
export function resetPwd(data) {
  return request({
    url: '/user/resetPwd',
    method: 'put',
    data,
  })
}
// 新增选择成员穿梭框使用
export function userSelect(params) {
  return request({
    url: '/role/userSelect',
    method: 'get',
    params,
  })
}