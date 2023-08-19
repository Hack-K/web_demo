/*
 * @Descripttion: 
 * @version: 
 * @Author: LiZeju
 * @Date: 2022-06-16 16:46:54
 * @LastEditors: LiZeju
 * @LastEditTime: 2022-06-22 12:28:47
 */
import request from '@/utils/request'
// 角色列表
export function getList(params) {
  return request({
    url: '/role/list',
    method: 'get',
    params,
  })
}
// 角色详情
export function details(params) {
  return request({
    url: '/role/details',
    method: 'get',
    params,
  })
}
// 角色新增
export function doAdd(data) {
  return request({
    url: '/role/add',
    method: 'post',
    data,
  })
}
// 角色编辑
export function doEdit(data) {
  return request({
    url: '/role/edit',
    method: 'put',
    data,
  })
}
// 编辑角色姓名
export function roleEditName(data) {
  return request({
    url: '/role/roleEditName',
    method: 'put',
    data,
  })
}
// 角色删除
export function doDelete(data) {
  return request({
    url: '/role/del',
    method: 'delete',
    data,
  })
}
// 角色关联成员列表
export function roleUser(params) {
  return request({
    url: '/role/roleUser',
    method: 'get',
    params,
  })
}
// 移除成员
export function userDel(data) {
  return request({
    url: '/role/userDel',
    method: 'delete',
    data,
  })
}
// 角色参考模版列表
export function tplList(params) {
  return request({
    url: '/role/tplList',
    method: 'get',
    params,
  })
}
// 添加角色成员
export function userAdd(data) {
  return request({
    url: '/role/userAdd',
    method: 'post',
    data,
  })
}
// 根据角色ID获取对应权限
export function menuIds(params) {
  return request({
    url: '/role/menuIds',
    method: 'get',
    params,
  })
}
