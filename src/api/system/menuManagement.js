import request from '@/utils/request'
// 菜单树
export function getTree(params) {
  return request({
    url: '/menu/list',
    method: 'get',
    params,
  })
}
// 添加
export function doAdd(data) {
  return request({
    url: '/menu/add',
    method: 'post',
    data,
  })
}
// 编辑
export function doEdit(data) {
  return request({
    url: '/menu/edit',
    method: 'put',
    data,
  })
}
// 删除
export function doDelete(data) {
  return request({
    url: '/menu/del',
    method: 'delete',
    data,
  })
}
// 获取菜单节点权限选择展示
export function authTree(params) {
  return request({
    url: '/menu/authTree',
    method: 'get',
    params,
  })
}