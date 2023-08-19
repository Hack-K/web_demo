import request from '@/utils/request'
// 护理标准列表
export function getCateList(params) {
    return request({
        url: '/standard/getCateList',
        method: 'get',
        params,
    })
}


//新增护理标准
export function addCate(data) {
    return request({
        url: '/standard/addCate',
        method: 'post',
        data,
    })
}

// 护理标准编辑
export function editCate(data) {
    return request({
        url: '/standard/editCate',
        method: 'put',
        data,
    })
}

// 护理标准删除
export function DelCate(data) {
    return request({
        url: '/standard/del',
        method: 'delete',
        data,
    })
}

// 护理标准列表
export function getProjectList(params) {
    return request({
        url: '/standard/getList',
        method: 'get',
        params,
    })
}

// 护理项目新增
export function addProject(data) {
    return request({
        url: '/standard/add',
        method: 'post',
        data,
    })
}

// 护理项目编辑
export function editProject(data) {
    return request({
        url: '/standard/edit',
        method: 'put',
        data,
    })
}

// 护理项目删除
export function deleteProject(data) {
    return request({
        url: '/standard/delItem',
        method: 'delete',
        data,
    })
}