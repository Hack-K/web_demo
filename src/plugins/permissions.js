/*
 * @Descripttion: 
 * @version: v1.3.0
 * @Author: LiZeju
 * @Date: 2022-06-16 16:46:54
 * @LastEditors: LiZeju
 * @LastEditTime: 2022-06-30 15:07:02
 */
/**
 * @description 路由守卫，目前两种模式：all模式与intelligence模式
 */
import router from '@/router'
import store from '@/store'
import ZnProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {
  toLoginRoute
} from '@/utils/routes'
import {
  authentication,
  loginInterception,
  routesWhiteList,
  supportVisit,
} from '@/config'
// 详情带参数路由无参数情况处理数组
let detailPathfilter = ['/customer/detailCustomer', '/workOrder/workOrderDetail', '/callCenter/callRecordDetail', '/system/memberDeatils', '/system/memberManagement/components/memberDeatils']
ZnProgress.configure({
  easing: 'ease',
  speed: 500,
  trickleSpeed: 200,
  showSpinner: false,
})
router.beforeEach(async (to, from, next) => {
  const {
    showProgressBar
  } = store.getters['settings/theme']
  if (showProgressBar) ZnProgress.start()
  let hasToken = store.getters['user/token']

  if (!loginInterception) hasToken = true

  if (hasToken) {
    if (store.getters['routes/routes'].length) {
      // 禁止已登录用户返回登录页
      if (to.path === '/login') {
        next({
          path: '/'
        })
        if (showProgressBar) ZnProgress.done()
      } else {
        // 详情页面 query 参数是否存在
        if (detailPathfilter.includes(to.path)) {
          if (!!to.query.id) {
            next()
          } else {
            next({
              path: '/'
            })
          }
        } else {
          next()
        }
      }
    } else {
      try {
        if (loginInterception) {
          await store.dispatch('user/getUserInfo')
          if (store.getters['user/isRestPswd'] || !store.getters['acl/role'].length) { //用户被重置密码后
            next({
              path: '/permission'
            })
          } else {
            next()
          }
        } else await store.dispatch('user/setVirtualRoles')
        // config/setting.config.js loginInterception为false(关闭登录拦截时)时，创建虚拟角色
        // 根据路由模式获取路由并根据权限过滤
        await store.dispatch('routes/setRoutes', authentication)
        next({
          ...to,
          replace: true
        })
      } catch (err) {
        console.error('vue-admin-beautiful错误拦截:', err)
        await store.dispatch('user/resetAll')
        next(toLoginRoute(to.path))
      }
    }
  } else {
    if (routesWhiteList.includes(to.path)) {
      // 设置游客路由(不需要可以删除)
      if (supportVisit && !store.getters['routes/routes'].length) {
        await store.dispatch('routes/setRoutes', 'visit')
        next({
          ...to,
          replace: true
        })
      } else next()
    } else next(toLoginRoute(to.path))
  }
})
router.afterEach((to) => {
  if (ZnProgress.status) ZnProgress.done()
})
