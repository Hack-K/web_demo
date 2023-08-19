import request from '@/utils/request'

//编辑商会信息
export function editChamberList(data) {
    return request({
        url: '/apis/commerce/setting/edit',
        method: 'post',
        data,
    })
}
//获取商会信息
export function getChamberList(params) {
    return request({
        url: '/apis/commerce/setting/detail',
        method: 'get',
        params,
    })
}
//获取商会班子信息---------以下是商会班子页面
export function getChamberClassList(params) {
    return request({
        url: '/apis/commerce/manager/list',
        method: 'get',
        params,
    })
}
//删除商会班子信息
export function delChamberList(data) {
    return request({
        url: '/apis/commerce/manager/batchDel',
        method: 'delete',
        data,
    })
}
//新增商会班子信息
export function addChamberList(data) {
    return request({
        url: '/apis/commerce/manager/add',
        method: 'post',
        data,
    })
}
//编辑商会班子信息
export function editChamber(data) {
    return request({
        url: '/apis/commerce/manager/edit',
        method: 'post',
        data,
    })
}
//查看详情
export function getChamberDetail(params) {
    return request({
        url: '/apis/commerce/manager/detail',
        method: 'get',
        params,
    })
}
//获取最大序号
export function getChamberSequence(params) {
    return request({
        url: '/apis/commerce/manager/getMaxSequence',
        method: 'get',
        params,
    })
}