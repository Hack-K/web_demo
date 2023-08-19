import request from '@/utils/request'

// 获取商会成员列表
export function getManagerList(params) {
    return request({
        url: '/apis/commerce/manager/list',
        method: 'get',
        params,
    })
}

// 获取商会成员信息
export function getManager(params) {
    return request({
        url: '/apis/commerce/manager/detail',
        method: 'get',
        params,
    })
}

// 编辑商会成员信息
export function editManager(data) {
    return request({
        url: '/apis/commerce/manager/edit',
        method: 'post',
        data,
    })
}