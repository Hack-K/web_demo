import request from '@/utils/request'

// 获取商品配置
export function getConfig(params){
    return request({
        url: '/product/config',
        method: 'get',
        params
    })
}

// 获取商品列表
export function getList(params){
    return request({
        url: '/product/getList',
        method: 'get',
        params
    })
}

// 添加商品
export function addProduct(data){
    return request({
        url: '/product/add',
        method: 'post',
        data
    })
}

// 编辑商品
export function editProduct(data){
    return request({
        url: '/product/edit',
        method: 'put',
        data
    })
}

// 批量上下架
export function batchUpdate(params){
    return request({
        url: '/product/updateStatus',
        method: 'get',
        params
    })
}

// 批量删除
export function batchDelete(params){
    return request({
        url: '/product/del',
        method: 'get',
        params
    })
}

// 获取七牛token
export function getToken(params){
    return request({
        url: '/common/token',
        method: 'get',
        params
    })
}

// 获取商品详情
export function getDetail(params){
    return request({
        url: '/product/getInfo',
        method: 'get',
        params
    })
}

// 获取商品分类表格
export function getCategoryViews(params){
    return request({
        url: '/v1/user/table/views',
        method: 'get',
        params
    })
}
// 获取商品分类字段
export function getCategoryBuilder(params){
    return request({
        url: '/v1/user/table/builder',
        method: 'get',
        params
    })
}
// 获取商品分类列表
export function getCategory(data){
    return request({
        url: '/v1/api/minister/catalog',
        method: 'post',
        data
    })
}
