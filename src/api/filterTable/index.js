import request from '@/utils/request'
// 客户中心-列表数据
export function getList(params) {
  return request({
    url: '/callcenter/Search/getTestList',
    method: 'get',
    params,
  })
}


