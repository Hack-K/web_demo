import request from '@/utils/request'

// 获取专委会列表
export function getClubList(params) {
    return request({
        url: '/api/group/list',
        method: 'get',
        params,
    })
}

// 获取专委会详情
export function getClubDetail(params) {
    return request({
        url: '/api/group/detail',
        method: 'get',
        params,
    })
}

// 专委会排序
export function saveSortClub(data) {
    return request({
        url: '/api/group/sortSave',
        method: 'post',
        data,
    })
}

// 保存专委会
export function saveClub(data) {
    return request({
        url: '/api/group/save',
        method: 'post',
        data,
    })
}

// 删除专委会
export function delClub(data) {
    return request({
        url: '/apis/commerce/group/delete',
        method: 'delete',
        data,
    })
}

// 获取成员列表
export function getMemberList(params) {
    return request({
        url: '/api/group/memberList',
        method: 'get',
        params,
    })
}

// 删除专委会成员
export function delClubMember(data) {
    return request({
        url: '/apis/commerce/group/batchDelMember',
        method: 'delete',
        data,
    })
}

// 获取关联成员
export function getAssociatedList(params) {
    return request({
        url: '/api/group/selectMemberList',
        method: 'get',
        params,
    })
}

// 绑定成员
export function bindingMember(data) {
    return request({
        url: '/api/group/batchBindMember',
        method: 'post',
        data,
    })
}

