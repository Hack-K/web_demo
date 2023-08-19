import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/data/add',
    method: 'post',
    data,
  })
}

//获取数据组详情
export function details(params) {
  return request({
    url: '/data/getInfo',
    method: 'get',
    params,
  })
}
// 获取数据组关联成员列表
export function dataUser(params) {
  return request({
    url: '/data/getMemberList',
    method: 'get',
    params,
  })
}

// 编辑数据组信息
export function doEdit(data) {
  return request({
    url: '/data/edit',
    method: 'put',
    data,
  })
}