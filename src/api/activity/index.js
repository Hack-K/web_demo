import request from '@/utils/request'

//活动列表
export function getList(params) {
  return request({
    url: '/api/activity/list',
    method: 'get',
    params,
  })
}

//活动详情
export function getDetail(params) {
  return request({
    url: '/api/activity/detail',
    method: 'get',
    params,
  })
}

//活动详情 - 报名人列表
export function getPersonList(params) {
  return request({
    url: '/api/activity/personList',
    method: 'get',
    params,
  })
}

//活动保存
export function saveActivity(data) {
  return request({
    url: '/api/activity/save',
    method: 'post',
    data,
  })
}
//活动数据获取
export function getActivity(data) {
  return request({
    url: '/api/activityClass/getList',
    method: 'get',
    data,
  })
}
//活动数据发送
export function postActivity(data) {
  return request({
    url: '/api/activityClass/save',
    method: 'post',
    data,
  })
}
//活动数据删除
export function delActivity(data) {
  return request({
    url: '/api/activityClass/del',
    method: 'post',
    data,
  })
}
