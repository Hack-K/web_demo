import request from '@/utils/request'

//会员等级列表
export function getLevelList(params) {
    return request({
        url: '/api/memberLevel/list',
        method: 'get',
        params,
    })
}

//会员列表
export function getMemberList(params) {
    return request({
        url: '/api/member/list',
        method: 'get',
        params,
    })
}

//会员列表
export function getDetail(params) {
    return request({
        url: '/api/member/detail',
        method: 'get',
        params,
    })
}

// 新建会员
export function addMember(data){
    return request({
        url: '/api/member/add',
        method: 'post',
        data
    })
}

// 编辑会员
export function editMember(data){
    return request({
        url: '/api/member/edit',
        method: 'post',
        data
    })
}

// 删除会员
export function delMember(data){
    return request({
        url: '/api/member/del',
        method: 'post',
        data
    })
}

// 更新状态
export function updateMember(data){
    return request({
        url: '/api/member/updateStatus',
        method: 'post',
        data
    })
}

//职位列表
export function getPosition(params) {
    return request({
        url: '/common/positionList',
        method: 'get',
        params,
    })
}

// 职位保存
export function savePosition(data){
    return request({
        url: '/position/save',
        method: 'post',
        data
    })
}

// 职位删除
export function delPosition(data){
    return request({
        url: '/position/del',
        method: 'post',
        data
    })
}
