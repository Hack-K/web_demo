import {
  resolve
} from 'path'
import {
  hasPermission
} from '@/utils/permission'
import {
  isExternal
} from '@/utils/validate'
import {
  recordRoute
} from '@/config'
import qs from 'qs'

/**
 * @description all模式渲染后端返回路由,支持包含views路径的所有页面
 * @param asyncRoutes
 * @returns {*}
 */
export function convertRouter(asyncRoutes) {
  return asyncRoutes.map((route) => {
  
    if (route.component) {
      if (route.component === 'Layout') {
        route.component = (resolve) => require(['@/layouts'], resolve)
      } else {
        const index = route.component.indexOf('views')
        const path =
          index > 0 ? route.component.slice(index) : `views/${route.component}`
        route.component = (resolve) => require([`@/${path}`], resolve)
      }
    }
    if (route.children && route.children.length)
      route.children = convertChildRouter(route.children)
    if (route.children && route.children.length === 0) delete route.children
    return route
  })
}

export function convertChildRouter(asyncRoutes){
  let hideRoute=[]
  let outputRoute=[]
  let ids=[]
    let routes = asyncRoutes.map((route) => {
  
    if (route.component) {
      if (route.component === 'Layout') {
        route.component = (resolve) => require(['@/layouts'], resolve)
      } else {
        const index = route.component.indexOf('views')
        const path =
          index > 0 ? route.component.slice(index) : `views/${route.component}`
        route.component = (resolve) => require([`@/${path}`], resolve)
      }
    }
    if (route.children && route.children.length){
      hideRoute=Array.prototype.concat.call(hideRoute,convertHideRouter(route.children))
    
      // if(!isMetaShow(route.children)){
      //   route.children=[]
      // }
 
    }
    if (route.children && route.children.length === 0) delete route.children


    return route
  })
  let res=Array.prototype.concat.call(routes,hideRoute)
   ids=res.map((r)=>r.parent_id)
  
  for(let i=0;i<res.length;i++){
     if (ids.indexOf(res[i].id)>-1) {
     delete res[i].children
     }
  }
  return  res
}

export function convertHideRouter(asyncRoutes){
 let routes = asyncRoutes.map((route) => {
  
    if (route.component) {
      if (route.component === 'Layout') {
        route.component = (resolve) => require(['@/layouts'], resolve)
      } else {
        const index = route.component.indexOf('views')
        const path =
          index > 0 ? route.component.slice(index) : `views/${route.component}`
        route.component = (resolve) => require([`@/${path}`], resolve)
      }
    }
    if (route.children && route.children.length){
      route.children = convertHideRouter(route.children)
    }
    if (route.children && route.children.length === 0) delete route.children
    return route
  })
  return  routes
}

/**
 * @description 根据roles数组拦截路由
 * @param routes 路由
 * @param rolesControl 是否进行权限控制
 * @param baseUrl 基础路由
 * @returns {[]}
 */
export function filterRoutes(routes, rolesControl, baseUrl = '/') {
  return routes
    .filter((route) =>
      rolesControl && route.meta && route.meta.guard ?
      hasPermission(route.meta.guard) :
      true
    )
    .map((route) => {
      route = {
        ...route
      }
      route.path = route.path !== '*' && !isExternal(route.path) ? resolve(baseUrl, route.path) : route.path
      if (route.children && route.children.length > 0 ) {
        route.children = filterRoutesChild(route.children, rolesControl, route.path)
        
        if (route.children.length > 0 ) {
        
            route.childrenNameList = route.children.flatMap(
              (_) => _.childrenNameList
            )
          
        
          if (!route.redirect ){
        
                route.redirect = route.children[0].redirect  && route.parent_id !=0?
            route.children[0].redirect :
            route.children[0].path
          }
          
       
    
        }
      } else route.childrenNameList = [route.name]
      return route
    })
}

export function filterRoutesChild(routes, rolesControl, baseUrl = '/') {
 return routes
   .filter((route) =>
     rolesControl && route.meta && route.meta.guard ?
     hasPermission(route.meta.guard) :
     true
   )
   .map((route) => {
     route = {
       ...route
     }
     route.path = route.path !== '*' && !isExternal(route.path) ? resolve(baseUrl, route.path) : route.path
     

    //  if (route.children && route.children.length > 0 ) {
    //   //  route.children = filterRoutesChild(route.children, rolesControl, route.path)
       
    //    if (route.children.length > 0 ) {
       
    //        route.childrenNameList = route.children.flatMap(
    //          (_) => _.childrenNameList
    //        )
         
       
    //      if (!route.redirect ){
       
    //            route.redirect = route.children[0].redirect  && route.parent_id !=0?
    //        route.children[0].redirect :
    //        route.children[0].path
    //        console.log(route,route.redirect ,route.id)
    //      }
         
      
   
    //    }
    //  } else route.childrenNameList = [route.name]
     return route
   })
}
export function isMetaShow(routes){
  var res =true;
  if (!routes && !Array.isArray(routes)) {
    res=false
    return res
  }
  routes.forEach(element => {
    if (element.meta.hidden) {
      res=false
      return 
    }
  });
  return res
}
/**
 * 根据path路径获取matched
 * @param routes 菜单routes
 * @param name 路由名
 * @returns {*} matched
 */
export function handleMatched(routes, name) {
  
  return routes
    .filter((route) => route.childrenNameList.indexOf(name) + 1)
    .flatMap((route) =>
      route.children ? [route, ...handleMatched(route.children, name)] : [route]
    )
}

/**
 * 生成单个多标签元素，可用于同步/异步添加多标签
 * @param tag route页信息
 */
export function handleTabs(tag) {
  let parentIcon = null
  if (tag.matched)
    for (let i = tag.matched.length - 2; i >= 0; i--)
      if (!parentIcon && tag.matched[i].meta.icon)
        parentIcon = tag.matched[i].meta.icon
  if (!parentIcon) parentIcon = 'menu-line'
  const path = handleActivePath(tag, true)
  if (tag.name && tag.meta && tag.meta.tabHidden !== true) {
    return {
      path: path,
      query: tag.query,
      params: tag.params,
      name: tag.name,
      parentIcon,
      meta: {
        ...tag.meta
      },
    }
  }
}

/**
 * 根据当前route获取激活菜单
 * @param route 当前路由
 * @param isTab 是否是标签
 * @returns {string|*}
 */
export function handleActivePath(route, isTab = false) {
  const {
    meta,
    path
  } = route
  
  const rawPath = route.matched ?
    route.matched[route.matched.length - 1].path :
    path
  const fullPath =
    route.query && Object.keys(route.query).length ?
    `${route.path}?${qs.stringify(route.query)}` :
    route.path
  if (isTab) return meta.dynamicNewTab ? fullPath : rawPath
  if (meta.activeMenu) return meta.activeMenu
  return fullPath
}

/**
 * 获取当前跳转登录页的Route
 * @param currentPath 当前页面地址
 */
export function toLoginRoute(currentPath) {
  if (recordRoute && currentPath !== '/')
    return {
      path: '/login',
      query: {
        redirect: currentPath
      },
      replace: true,
    }
  else return {
    path: '/login',
    replace: true
  }
}
