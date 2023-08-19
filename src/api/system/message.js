/*
 * @Descripttion: 
 * @version: 
 * @Author: LiZeju
 * @Date: 2022-06-16 16:46:54
 * @LastEditors: LiZeju
 * @LastEditTime: 2022-06-22 12:28:47
 */
import request from '@/utils/request'
// 消息列表
export function noticeList(params) {
  return request({
    url: '/system/noticeList',
    method: 'get',
    params,
  })
}

//系统通知设置已读
export function noticeRead(params) {
  return request({
    url: '/system/noticeRead',
    method: 'put',
    params,
  })
}


// 系统通知配置数据
export function getNoticeExData(params) {
  return request({
    url: '/system/getNoticeExData',
    method: 'get',
    params,
  })
}