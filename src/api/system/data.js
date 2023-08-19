import request from '@/utils/request'
// 新增数据组
export function dataAdd(data) {
    return request({
        url: '/data/add',
        method: 'post',
        data,
    })
}


// 新增数据组-成员列表
export function userList(params) {
    return request({
        url: '/data/userList',
        method: 'get',
        params,
    })
}


//数据组列表
export function getList(params) {
    return request({
        url: '/data/getList',
        method: 'get',
        params,
    })
}
// 修改数据组名称
export function editData(data) {
    return request({
        url: '/data/editName',
        method: 'put',
        data,
    })
}


// 删除数据组
export function doDelete(data) {
    return request({
        url: '/data/del',
        method: 'delete',
        data,
    })
}

//  新增或删除关联成员
export function dataMember(data) {
    return request({
        url: '/data/member',
        method: 'post',
        data,
    })
}
