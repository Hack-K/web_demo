/**
 * @description tabsBar标签页逻辑，如无必要请勿修改
 */
const state = () => ({
  visitedRoutes: [],
})
const getters = {
  visitedRoutes: (state) => state.visitedRoutes,
}
const mutations = {
  /**
   * @description 添加标签页
   * @param {*} state
   * @param {*} route
   * @returns
   */
  addVisitedRoute(state, route) {
    const target = state.visitedRoutes.find((item) => item.path === route.path)
    if (target && !route.meta.dynamicNewTab) Object.assign(target, route)
    // else if (!target) state.visitedRoutes.push(Object.assign({}, route)) //如果页签不存在则添加
    // 需求变更(二级路由做更新与替换,只新增route.meta.dynamicNewTab=>动态传参路由是否新开标签页的页签)
    else if (!target) {
      if (route.meta.dynamicNewTab) {
        state.visitedRoutes.push(Object.assign({}, route))
      } else {
        state.visitedRoutes.splice(0, 1, route)
      }
    }

    //应对极特殊情况：没有配置noClosable的情况，默认使当前tab不可关闭
    if (!state.visitedRoutes.find((route) => route.meta.noClosable))
      state.visitedRoutes[0].meta.noClosable = true
  },
  /**
   * @description 删除当前标签页
   * @param {*} state
   * @param {*} path
   * @returns
   */
  delVisitedRoute(state, path) {
    state.visitedRoutes.splice(
      state.visitedRoutes.findIndex((route) => route.path === path),
      1
    )
  },
  /**
   * @description 删除当前标签页以外其它全部标签页
   * @param {*} state
   * @param {*} path
   * @returns
   */
  delOthersVisitedRoutes(state, path) {
    state.visitedRoutes = state.visitedRoutes.filter(
      (route) => route.meta.noClosable || route.path === path
    )
  },
  /**
   * @description 删除当前标签页左边全部标签页
   * @param {*} state
   * @param {*} path
   * @returns
   */
  delLeftVisitedRoutes(state, path) {
    let found = false
    state.visitedRoutes = state.visitedRoutes.filter((route) => {
      if (route.path === path) found = true
      return route.meta.noClosable || found
    })
  },
  /**
   * @description 删除当前标签页右边全部标签页
   * @param {*} state
   * @param {*} path
   * @returns
   */
  delRightVisitedRoutes(state, path) {
    let found = false
    state.visitedRoutes = state.visitedRoutes.filter((route) => {
      const close = found
      if (route.path === path) found = true
      return route.meta.noClosable || !close
    })
  },
  /**
   * @description 删除全部标签页
   * @param {*} state
   * @returns
   */
  delAllVisitedRoutes(state) {
    state.visitedRoutes = state.visitedRoutes.filter(
      (route) => route.meta.noClosable
    )
  },
  /**
   * @description 修改 meta
   * @param {*} state
   * @param options
   */
  changeTabsMeta(state, options) {
    function handleVisitedRoutes(visitedRoutes) {
      return visitedRoutes.map((route) => {
        if (route.name === options.name || route.meta.title === options.title)
          Object.assign(route.meta, options.meta)
        if (route.children && route.children.length)
          route.children = handleVisitedRoutes(route.children)
        return route
      })
    }

    state.visitedRoutes = handleVisitedRoutes(state.visitedRoutes)
  },
   /**
   * @description 保存分页数据
   * @param {*} state
   * @param options
   */
  changeTabsPageHandle(state, options) {
    let { visitedRoutes } = state
    let { path } = options
    const index = visitedRoutes.findIndex(function (item) {
      return item['path'] === path
    })
    if (index >= 0) {
      delete options['path'];
      state.visitedRoutes[index]['query'] = options;
    }
    // console.log(item, options);
  }
}
const actions = {
  /**
   * @description 添加标签页
   * @param {*} { commit }
   * @param {*} route
   */
  addVisitedRoute({ commit }, route) {
    commit('addVisitedRoute', route)
  },
  /**
   * @description 删除当前标签页
   * @param {*} { commit }
   * @param {*} path
   */
  delVisitedRoute({ commit }, path) {
    commit('delVisitedRoute', path)
  },
  /**
   * @description 删除当前标签页以外其它全部标签页
   * @param {*} { commit }
   * @param {*} path
   */
  delOthersVisitedRoutes({ commit }, path) {
    commit('delOthersVisitedRoutes', path)
  },
  /**
   * @description 删除当前标签页左边全部标签页
   * @param {*} { commit }
   * @param {*} path
   */
  delLeftVisitedRoutes({ commit }, path) {
    commit('delLeftVisitedRoutes', path)
  },
  /**
   * @description 删除当前标签页右边全部标签页
   * @param {*} { commit }
   * @param {*} path
   */
  delRightVisitedRoutes({ commit }, path) {
    commit('delRightVisitedRoutes', path)
  },
  /**
   * @description 删除全部标签页
   * @param {*} { commit }
   */
  delAllVisitedRoutes({ commit }) {
    commit('delAllVisitedRoutes')
  },
  /**
   * @description 修改Route Meta
   * @param {*} { commit }
   * @param options
   */
  changeTabsMeta({ commit }, options = {}) {
    commit('changeTabsMeta', options)
  },
  /**
  * @description 动态控制page
  * @param {*} { commit }
  * @param options
  */
  changePageHandle({ commit }, options = {}) {
    commit('changeTabsPageHandle', options)
  }
}
export default { state, getters, mutations, actions }