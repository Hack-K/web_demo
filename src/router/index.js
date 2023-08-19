/**
 * @description router全局配置，如有必要可分文件抽离，其中asyncRoutes只有在intelligence模式下才会用到，只支持remixIcon图标
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layouts'
import {
  publicPath,
  routerMode
} from '@/config'

Vue.use(VueRouter)
export const constantRoutes = [{
    path: '/login',
    component: () => import('@/views/login'),
    meta: {
      hidden: true,
    },
  },
  {
    path: '/register',
    component: () => import('@/views/register'),
    meta: {
      hidden: true,
    },
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/403'),
    meta: {
      hidden: true,
    },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404'),
    meta: {
      hidden: true,
    },
  },
  {
    path: '/permission',
    name: 'Permission',
    component: Layout,
    levelHidden: true,
    meta: {
      hidden: true,
    },
    children: [{
      path: 'index',
      name: 'Index',
      component: () => import('@/views/permission/index'),
      meta: {
        noColumn: true,
        noKeepAlive: true,
        hidden: true,
        breadcrumbHidden: false
      },
    }, ],
  },
]

export const asyncRoutes = [
  // {
  //   path: '/',
  //   name: 'Root',
  //   component: Layout,
  //   meta: {
  //     title: '工作台',
  //     // breadcrumbHidden: true,
  //     imgPath: require('@/assets/images/menu/menu-work-unselected.png'),
  //     selectImgPath: require('@/assets/images/menu/menu-work-selected.png')
  //   },
  //   children: [{
  //     path: 'index',
  //     name: 'Index',
  //     component: () => import('@/views/index'),
  //     meta: {
  //       title: '工作台',
  //       icon: 'icon-index',
  //       // noClosable: true,
  //       noColumn: true,
  //     },
  //   }, ],
  // },
  // {
  //   path: '/customer',
  //   name: 'Customer',
  //   component: Layout,
  //   meta: {
  //     title: '客户',
  //     imgPath: require('@/assets/images/menu/menu-client-unselected.png'),
  //     selectImgPath: require('@/assets/images/menu/menu-client-selected.png')
  //   },
  //   children: [{
  //       path: 'allCustomer',
  //       name: 'AllCustomer',
  //       component: () => import('@/views/customer/allCustomer'),
  //       meta: {
  //         title: '全部客户',
  //         icon: 'callcenter-icon-user2',
  //       },
  //     },
  //     {
  //       path: 'myCustomer',
  //       name: 'MyCustomer',
  //       component: () => import('@/views/customer/myCustomer'),
  //       meta: {
  //         title: '我的客户',
  //         icon: 'callcenter-icon-user2',
  //       },
  //     },
  //     {
  //       path: 'deatils',
  //       name: 'detailCustomer',
  //       component: () => import('@/views/customer/detailCustomer'),
  //       meta: {
  //         hidden: true,
  //         title: '详情页',
  //         icon: 'user-1',
  //         activeMenu: '/customer/allCustomer',
  //         dynamicNewTab: true,
  //       },
  //     },
  //   ],
  // },
  // {
  //   path: '/callCenter',
  //   name: 'CallCenter',
  //   component: Layout,
  //   meta: {
  //     title: '呼叫',
  //     imgPath: require('@/assets/images/menu/menu-call-unselected.png'),
  //     selectImgPath: require('@/assets/images/menu/menu-call-selected.png')
  //   },
  //   children: [{
  //     path: 'callRecord',
  //     name: 'callRecord',
  //     component: () => import('@/views/callCenter/callRecord'),
  //     meta: {
  //       title: '通话记录',
  //       icon: 'callcenter-phone',
  //     },
  //   }, {
  //     path: 'callRecordDetail',
  //     name: 'callRecordDetail',
  //     component: () => import('@/views/callCenter/callRecordDetail'),
  //     meta: {
  //       hidden: true,
  //       title: '通话详情',
  //       icon: 'user-1',
  //       dynamicNewTab: true,
  //       activeMenu: '/callCenter/callRecord',
  //     },
  //   }],
  // },

  // // {
  // //   path: '/dataCenter',
  // //   name: 'DataCenter',
  // //   component: Layout,
  // //   meta: {
  // //     title: '数据',
  // //     icon: 'database-2-fill',
  // //   },
  // //   children: [{
  // //     path: 'dataCenter',
  // //     name: 'DataCenter',
  // //     component: () => import('@/views/dataCenter'),
  // //     meta: {
  // //       title: '数据',
  // //       icon: 'database-2-fill',
  // //     },
  // //   }, ],
  // // },
  // {
  //   path: '/workOrder',
  //   name: 'WorkOrder',
  //   component: Layout,
  //   meta: {
  //     title: '工单',
  //     icon: 'archive-drawer-line',
  //     imgPath: require('@/assets/images/menu/menu-workorder-unselected.png'),
  //     selectImgPath: require('@/assets/images/menu/menu-workorder-selected.png')
  //   },
  //   children: [{
  //     path: 'allWorkOrder',
  //     name: 'allWorkOrder',
  //     component: () => import('@/views/workOrder/allWorkOrder'),
  //     meta: {
  //       title: '全部工单',
  //       icon: 'icon-work-1',
  //     },
  //   }, {
  //     path: 'workOrderDetail',
  //     name: 'workOrderDetail',
  //     component: () => import('@/views/workOrder/workOrderDetail'),
  //     meta: {
  //       hidden: true,
  //       title: '工单详情',
  //       icon: 'icon-work-2',
  //       dynamicNewTab: true,
  //     },
  //   }],
  // },
  // {
  //   path: '/plan',
  //   name: 'Plan',
  //   component: Layout,
  //   meta: {
  //     title: '计划',
  //     icon: 'archive-drawer-line',
  //     imgPath: require('@/assets/images/menu/menu-plan-unselected.png'),
  //     selectImgPath: require('@/assets/images/menu/menu-plan-selected.png'),
  //   },
  //   children: [{
  //       path: 'myPlan',
  //       name: 'MyPlan',
  //       component: () => import('@/views/plan/myPlan'),
  //       meta: {
  //         title: '我的计划',
  //         icon: 'icon-plan-1',
  //       },
  //     },
  //     {
  //       path: 'myTask',
  //       name: 'myTask',
  //       component: () => import('@/views/plan/myTask'),
  //       meta: {
  //         title: '我的任务',
  //         icon: 'icon-tasks-1',
  //       },
  //     },
  //     {
  //       path: 'planDetail',
  //       name: 'planDetail',
  //       component: () => import('@/views/plan/planDetail'),
  //       meta: {
  //         hidden: true,
  //         title: '计划详情',
  //         icon: 'user-1',
  //         activeMenu: '/plan/myPlan',
  //         dynamicNewTab: true,
  //       },
  //     },
  //     {
  //       path: 'taskDetail',
  //       name: 'taskDetail',
  //       component: () => import('@/views/plan/taskDetail'),
  //       meta: {
  //         hidden: true,
  //         title: '任务详情',
  //         icon: 'user-1',
  //         activeMenu: '/plan/myTask',
  //         dynamicNewTab: true,
  //       },
  //     },
  //   ],
  // },
  // // {
  // //   path: '/knowledgeBase',
  // //   name: 'KnowledgeBase',
  // //   component: Layout,
  // //   meta: {
  // //     title: '知识库',
  // //     icon: 'book-fill',
  // //   },
  // //   children: [{
  // //     path: 'knowledgeBase',
  // //     name: 'KnowledgeBase',
  // //     component: () => import('@/views/knowledgeBase'),
  // //     meta: {
  // //       title: '知识库',
  // //       icon: 'book-fill',
  // //     },
  // //   }, ],
  // // },

  // {
  //   path: '/system',
  //   name: 'PersonnelManagement',
  //   component: Layout,
  //   meta: {
  //     title: '设置',
  //     icon: 'user-settings-line',
  //     imgPath: require('@/assets/images/menu/menu-sys-unselected.png'),
  //     selectImgPath: require('@/assets/images/menu/menu-sys-selected.png'),
  //     guard: ['Admin'],
  //   },
  //   children: [{
  //       path: 'memberManagement',
  //       name: 'MemberManagement',
  //       component: () => import('@/views/system/memberManagement'),
  //       meta: {
  //         title: '成员管理',
  //         icon: 'icon-staff',
  //       },
  //     },
  //     {
  //       path: 'memberDeatils',
  //       name: 'MemberDeatils',
  //       component: () => import('@/views/system/memberManagement/components/memberDeatils'),
  //       meta: {
  //         hidden: true,
  //         title: '详情页',
  //         icon: 'user-1',
  //         activeMenu: '/system/memberManagement',
  //         dynamicNewTab: true,
  //       },
  //     },
  //     {
  //       path: 'roleManagement',
  //       name: 'RoleManagement',
  //       component: () => import('@/views/system/roleManagement'),
  //       meta: {
  //         title: '角色权限',
  //         icon: 'icon-role',
  //       },
  //     },
  //     // {
  //     //   path: 'dataManagement',
  //     //   name: 'RataManagement',
  //     //   component: () => import('@/views/system/dataManagement'),
  //     //   meta: {
  //     //     title: '数据权限',
  //     //     icon: 'icon-dataauthority',
  //     //   },
  //     // },
  //     {
  //       path: 'departmentManagement',
  //       name: 'DepartmentManagement',
  //       component: () => import('@/views/system/departmentManagement'),
  //       meta: {
  //         title: '部门管理',
  //         icon: 'group-line',
  //         hidden: true,
  //       },
  //     },
  //     {
  //       path: 'menuManagement',
  //       name: 'MenuManagement',
  //       component: () => import('@/views/system/menuManagement'),
  //       meta: {
  //         title: '菜单管理',
  //         icon: 'menu-2-fill',
  //       },
  //     },
  //     {
  //       path: 'ceshiyiji',
  //       name: 'Ceshiyiji',
  //       component: () => import('@/views/system/ceshiyiji'),
  //       meta: {
  //         title: '测试模块',
  //         icon: 'menu-2-fill',
  //       },
  //     },
  //     {
  //       path: 'systemLog',
  //       name: 'SystemLog',
  //       component: () => import('@/views/system/systemLog'),
  //       meta: {
  //         title: '系统日志',
  //         icon: 'file-shield-2-line',
  //         hidden: true,
  //       },
  //     },
  //     {
  //       path: 'personalCenter',
  //       name: 'PersonalCenter',
  //       component: () => import('@/views/system/personalCenter'),
  //       meta: {
  //         title: '个人中心',
  //         icon: 'delete-column',
  //         noColumn: true,
  //         hidden: true
  //       },
  //     },
  //   ],
  // },
  // {
  //   path: '/error',
  //   name: 'Error',
  //   component: Layout,

  //   meta: {
  //     title: '错误页',
  //     icon: 'error-warning-line',
  //     hidden: true,
  //   },
  //   children: [{
  //       path: '403',
  //       name: 'Error403',
  //       component: () => import('@/views/403'),
  //       meta: {
  //         title: '403',
  //         icon: 'error-warning-line',
  //         // tabHidden: true,
  //       },
  //     },
  //     {
  //       path: '404',
  //       name: 'Error404',
  //       component: () => import('@/views/404'),
  //       meta: {
  //         title: '404',
  //         icon: 'error-warning-line',
  //         // tabHidden: true,
  //       },
  //     },
  //   ],
  // },
  // {
  //   path: '*',
  //   redirect: '/404',
  //   meta: {
  //     hidden: true,
  //   },
  // },
]

const router = createRouter()

function fatteningRoutes(routes) {
  return routes.flatMap((route) => {
    return route.children ? fatteningRoutes(route.children) : route
  })
}

export function resetRouter(routes = constantRoutes) {
  routes.map((route) => {
    if (route.children) {
      route.children = fatteningRoutes(route.children)
    }
  })
  router.matcher = createRouter(routes).matcher
}

function createRouter(routes = constantRoutes) {
  return new VueRouter({
    base: publicPath,
    mode: routerMode,
    scrollBehavior: () => ({
      y: 0,
    }),
    routes: routes,
  })
}

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

export default router
