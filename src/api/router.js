/*
 * @Descripttion: 
 * @version: v1.3.0
 * @Author: LiZeju
 * @Date: 2022-02-18 09:05:32
 * @LastEditors: LiZeju
 * @LastEditTime: 2022-06-23 15:47:59
 */
import request from '@/utils/request'

export function getRouteList(params) {
  return request({
    url: '/router/getList',
    method: 'get',
    params,
  })
}
