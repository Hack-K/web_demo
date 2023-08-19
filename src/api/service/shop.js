import request from '@/utils/request'

// 获取商品配置
export function getSetting(params){
    return request({
        url: '/v1/api/minister/store/draft/current',
        method: 'get',
        params
    })
}

// 保存草稿
export function saveDraft(data){
    return request({
        url: '/v1/api/minister/store/element',
        method: 'post',
        data
    })
}

// 保存草稿
export function publishStore(data){
    return request({
        url: '/v1/api/minister/store/' + data.id,
        method: 'post',
        data
    })
}