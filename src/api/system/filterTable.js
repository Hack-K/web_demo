import request from '@/utils/request'
// 筛选表格
export function getList(params) {
  return request({
    url: '/departmentManagement/getList',
    method: 'get',
    params,
  })
}

