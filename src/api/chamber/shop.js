import request from '@/utils/request'

// 获取店铺装修
export function getStore(params) {
    return request({
        url: '/apis/commerce/store/query',
        method: 'get',
        params,
    })
}

// 保存发布店铺装修
export function saveStore(data) {
    return request({
        url: '/apis/commerce/store/publish',
        method: 'post',
        data,
    })
}