import request from '@/utils/request'

// 获取订单列表
export function getList(params){
    return request({
        url: '/order/getList',
        method: 'get',
        params
    })
}

// 获取订单详情
export function getDetail(params){
    return request({
        url: '/order/getInfo',
        method: 'get',
        params
    })
}

// 订单编辑
export function editOrder(data){
    return request({
        url: '/order/edit',
        method: 'put',
        data
    })
}

// 获取预约时间
export function getDate(params){
    return request({
        url: '/order/appointTime',
        method: 'get',
        params
    })
}

// 退款接口
export function refund(params){
    return request({
        url: '/order/refund',
        method: 'get',
        params
    })
}

// 退款验证码
export function refundCode(params){
    return request({
        url: '/order/refundSms',
        method: 'get',
        params
    })
}