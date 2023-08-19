import request from '@/utils/request'
// 客户中心-全部客户列表数据
export function getAllList(params) {
  return request({
    url: '/member/list',
    method: 'get',
    params,
  })
}

// 客户中心-全部客户列表-客户信息-新增
export function customerAdd(data) {
  return request({
    url: '/member/add',
    method: 'post',
    data,
  })
}
// 根据条件搜索(姓名)
export function searchList(params) {
  return request({
    url: '/member/searchList',
    method: 'get',
    params,
  })
}
// 根据条件搜索(姓名)-用户详情
export function details(params) {
  return request({
    url: '/member/details',
    method: 'get',
    params,
  })
}
// 用户详情-编辑
export function editDetails(data) {
  return request({
    url: '/member/edit',
    method: 'put',
    data,
  })
}
// 用户详情-编辑基本信息
export function ediInfo(data) {
  return request({
    url: '/member/ediInfo',
    method: 'PATCH',
    data,
  })
}
// 用户详情-标签编辑
export function editTags(data) {
  return request({
    url: '/member/ediTags',
    method: 'PATCH',
    data,
  })
}
// 用户详情-服务信息编辑
export function editContract(data) {
  return request({
    url: '/member/editContract',
    method: 'PUT',
    data,
  })
}
// 用户详情-服务信息删除
export function delContract(data) {
  return request({
    url: '/member/delContract',
    method: 'DELETE',
    data,
  })
}
// 用户详情-服务信息新增
export function addContract(data) {
  return request({
    url: '/member/addContract',
    method: 'POST',
    data,
  })
}
// 用户详情-联系人编辑
export function editContacts(data) {
  return request({
    url: '/member/editContacts',
    method: 'PUT',
    data,
  })
}
// 用户详情-其他信息编辑
export function editOther(data) {
  return request({
    url: '/member/ediOther',
    method: 'patch',
    data,
  })
}
// 用户管理-删除用户
export function deleteCustomer(data) {
  return request({
    url: '/member/del',
    method: 'DELETE',
    data,
  })
}
// 分配话务人员
export function distribution(data) {
  return request({
    url: '/member/distribution',
    method: 'patch',
    data,
  })
}
// 个人详情-通话记录
export function myCallRecordsList(params) {
  return request({
    url: '/member/myCallRecordsList',
    method: 'get',
    params,
  })
}

// 个人详情-工单列表
export function myWorkOrder(params) {
  return request({
    url: '/member/myWorkOrder',
    method: 'get',
    params,
  })
}

// 数据导出模板列表
export function statisticsType(params) {
  return request({
    url: '/common/statisticsType',
    method: 'get',
    params,
  })
}
//  数据导出模板下载
export function statisticsExcel(params) {
  return request({
    url: '/common/statisticsExcel',
    method: 'get',
    params,
  })
}
// 全部客户-导出全部
export function exportAllExcel(params) {
  return request({
    url: '/member/exportAllExcel',
    method: 'get',
    params,
    timeout: 100000
  })
}
// 全部客户-导出选中
export function exportSelectExcel(params) {
  return request({
    url: '/member/exportSelectExcel',
    method: 'get',
    params,
  })
}

// 全部客户-工单通话记录
export function exportCallRecord(params) {
  return request({
    url: '/v1/nurse/excel/call/work',
    method: 'get',
    params,
  })
}

// 全部客户导入-全部客户文件上传
export function importFile(data) {
  return request({
    url: '/member/import',
    method: 'POST',
    data,
  })
}
// 客户导入-文件验证
export function importCheck(data) {
  return request({
    url: '/member/checkimport',
    method: 'POST',
    data,
  })
}

// 客户中心-我的客户列表数据
export function getMyList(params) {
  return request({
    url: '/member/myList',
    method: 'get',
    params,
  })
}
// 我的客户-新增客户
export function myAdd(data) {
  return request({
    url: '/member/myAdd',
    method: 'post',
    data,
  })
}
// 我的客户导入-文件上传
export function myimport(data) {
  return request({
    url: '/member/myimport',
    method: 'post',
    data,
  })
}
// 我的客户-导出全部
export function myExportAllExcel(params) {
  return request({
    url: '/member/myExportAllExcel',
    method: 'get',
    params,
  })
}
// 我的客户-导出选中
export function myExportSelectExcel(params) {
  return request({
    url: '/member/myExportSelectExcel',
    method: 'get',
    params,
  })
}
// 客户详情-通话记录导出全部
export function detailExportAllExcel(params) {
  return request({
    url: '/call/myExportAllExcel',
    method: 'get',
    params,
  })
}
// 客户详情-通话记录导出选中
export function detailExportSelectExcel(params) {
  return request({
    url: '/call/myExportSelectExcel',
    method: 'get',
    params,
  })
}
// 新增/用户提交数据前唯一性验证(对标prd1.3.0优化最后一条)
export function chkMember(params) {
  return request({
    url: '/member/chkMember',
    method: 'get',
    params,
  })
}