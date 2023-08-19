import request from '@/utils/request'

//文章列表
export function getList(params) {
  return request({
    url: '/apis/commerce/article/list',
    method: 'get',
    params,
  })
}

//文章-分类列表
export function getCategoryList(params) {
  return request({
    url: '/api/articleClass/getList',
    method: 'get',
    params,
  })
}
//文章-分类列表-删除
export function delCategory(data) {
  return request({
    url: '/api/articleClass/del',
    method: 'post',
    data,
  })
}
//文章-分类列表-保存
export function saveCategory(data) {
  return request({
    url: '/api/articleClass/save',
    method: 'post',
    data,
  })
}

//文章-新增
export function saveArticle(data) {
  return request({
    url: '/apis/commerce/article/save',
    method: 'post',
    data,
  })
}
//文章-详情
export function detailArticle(params) {
  return request({
    url: '/apis/commerce/article/detail',
    method: 'get',
    params,
  })
}
//文章-删除
export function deleteArticle(data) {
  return request({
    url: '/apis/commerce/article/batchDel',
    method: 'delete',
    data,
  })
}
//文章-状态更新
export function updateStatusArticle(data) {
  return request({
    url: '/apis/commerce/article/updateStatus',
    method: 'post',
    data,
  })
}
