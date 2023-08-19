/**
 * @description 登录、获取用户信息、退出登录、清除token逻辑，不建议修改
 */
import Vue from 'vue'
import { getUserInfo, login, logout, socialLogin, loginMobile } from '@/api/index'
import { getToken, removeToken, setToken } from '@/utils/token'
import { resetRouter } from '@/router'
import { isArray, isNumber, isString } from '@/utils/validate'
import { title, tokenName } from '@/config'

const state = () => ({
  token: getToken(),
  username: '游客',
  avatar: '@/assets/images/default-avatar.png',
  isRestPswd: 0,//是否需要修改密码 0:不需要 1需要
  nickname: '暂无数据',
  app_title: '暂无数据',
  notice_unread: 0,
  isArea: false,    
  sipType: '',
  sipCode: '', 
  agentCode: '',
  viewNumber: 0
})
const getters = {
  token: (state) => state.token,
  username: (state) => state.username,
  avatar: (state) => state.avatar,
  isRestPswd: (state) => state.isRestPswd,
  nickname: (state) => state.nickname,
  app_title: (state) => state.app_title,
  notice_unread: (state) => state.notice_unread,
  isArea: (state) => state.isArea,
  sipType: (state) => state.sipType,
  sipCode: (state) => state.sipCode,
  agentCode: (state) => state.agentCode,
  viewNumber: (state) => state.viewNumber
}
const mutations = {
  /**
   * @description 设置token
   * @param {*} state
   * @param {*} token
   */
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  /**
   * @description 设置用户名
   * @param {*} state
   * @param {*} username
   */
  setUsername(state, username) {
    state.username = username
  },
  /**
   * @description 设置头像
   * @param {*} state
   * @param {*} avatar
   */
  setAvatar(state, avatar) {
    state.avatar = avatar
  },
  /**
   * @description 设置用户id
   * @param {*} state
   * @param {*} id
   */
  setId(state, id){
    state.id = id
  },
  /**
   * @description 设置未读消息总数
   * @param {*} state
   * @param {*} notice_unread
   */
   setNoticeUnread(state, notice_unread){
    state.notice_unread = notice_unread
  },
  /**
   * @description 设置 021 开关
   * @param {*} state
   * @param {*} isArea
   */
   setIsArea(state, isArea){
    state.isArea = isArea
  },
  /**
   * @description 记录用户是否被重置密码
   * @param {*} state
   * @param {*} isRestPswd
   */
  setIsRestPswd(state, is_reset_pwd){
    state.isRestPswd = is_reset_pwd
  },
  /**
   * @description 记录用户姓名
   * @param {*} state
   * @param {*} isRestPswd
   */
  setNickname(state, nickname){
    state.nickname = nickname
  },
  /**
   * @description 记录用户坐席模式
   * @param {*} state
   * @param {*} sipType
   */
   setSipType(state, sipType){
    state.sipType = sipType
  },
  /**
   * @description 记录用户SIP座机编号
   * @param {*} state
   * @param {*} sipCode
   */
   setSipCode(state, sipCode){
    state.sipCode = sipCode
  },
  /**
   * @description 记录用户agentCode坐席号
   * @param {*} state
   * @param {*} agentCode
   */
  setAgentCode(state, agentCode){
    state.agentCode = agentCode
  },
  /**
   * @description 记录免费视图上限
   * @param {*} state
   * @param {*} viewNumber
   */
  setViewNumber(state, viewNumber){
    state.viewNumber = viewNumber
  },
  /**
   * @description 记录用户所属公司
   * @param {*} state
   * @param {*} isRestPswd
   */
  setApp_title(state, app_title){
    state.app_title = app_title
  },
}
const actions = {
  /**
   * @description 登录拦截放行时，设置虚拟角色
   * @param {*} { commit, dispatch }
   */
  setVirtualRoles({ commit, dispatch }) {
    dispatch('acl/setFull', true, { root: true })
    commit('setAvatar', '@/assets/images/default-avatar.png')
    commit('setUsername', 'admin(未开启登录拦截)')
  },
  /**
   * @description 登录
   * @param {*} { commit }
   * @param {*} userInfo
   */
  async login({ commit }, userInfo) {
    // const {
    //   data: { [tokenName]: token },
    // } = await login(userInfo)
    // type===1 验证码登录 type===2 账号密码登录
    const {
      data: { [tokenName]: token },
    } = userInfo.type === 1 ? await loginMobile(userInfo) : await login(userInfo)
    if (token) {
      commit('setToken', token)
      const hour = new Date().getHours()
      const thisTime =
        hour < 8
          ? '早上好'
          : hour <= 11
            ? '上午好'
            : hour <= 13
              ? '中午好'
              : hour < 18
                ? '下午好'
                : '晚上好'
      Vue.prototype.$baseNotify(`欢迎登录${title}`, `${thisTime}！`, 'success', 'top-right', 1000)
    } else {
      const err = `登录接口异常，未正确返回${tokenName}...`
      Vue.prototype.$baseMessage(err, 'error', 'zn-hey-message-error')
      throw err
    }
  },
  /**
   * @description 第三方登录
   * @param {*} {}
   * @param {*} tokenData
   */
  async socialLogin({ commit }, tokenData) {
    const {
      data: { [tokenName]: token },
    } = await socialLogin(tokenData)
    if (token) {
      commit('setToken', token)
      const hour = new Date().getHours()
      const thisTime =
        hour < 8
          ? '早上好'
          : hour <= 11
            ? '上午好'
            : hour <= 13
              ? '中午好'
              : hour < 18
                ? '下午好'
                : '晚上好'
      Vue.prototype.$baseNotify(`欢迎登录${title}`, `${thisTime}！`, 'success', 'top-right', 1000)
    } else {
      const err = `login核心接口异常，请检查返回JSON格式是否正确，是否正确返回${tokenName}...`
      Vue.prototype.$baseMessage(err, 'error', 'zn-hey-message-error')
      throw err
    }
  },
  /**
   * @description 获取用户信息接口 这个接口非常非常重要，如果没有明确底层前逻辑禁止修改此方法，错误的修改可能造成整个框架无法正常使用
   * @param {*} { commit, dispatch, state }
   * @returns
   */
  async getUserInfo({ commit, dispatch }) {
    const {
      data: { id, username, avatar, notice_unread, roles, permissions,is_reset_pwd,nickname,app_title, is_area, sip_type, sip_code, agent_code, app_auth},
    } = await getUserInfo()
    /**
     * 检验返回数据是否正常，无对应参数，将使用默认用户名,头像,Roles和Permissions
     * id {Number}
     * username {String}
     * avatar {String}
     * roles {List}
     * ability {List}
     */
    if (
      (id && !isNumber(id)) ||
      (notice_unread && !isNumber(notice_unread)) ||
      (username && !isString(username)) ||
      (avatar && !isString(avatar)) ||
      (roles && !isArray(roles)) ||
      (permissions && !isArray(permissions))||
      (is_reset_pwd && !isNumber(is_reset_pwd))||
      (nickname && !isString(nickname))||
      (app_title && !isString(app_title))
    ) {
      const err = 'getUserInfo核心接口异常，请检查返回JSON格式是否正确'
      Vue.prototype.$baseMessage(err, 'error', 'zn-hey-message-error')
      throw err
    } else {
      // 如不使用 id,可删除以下代码
      if(id) commit('setId', id) 
      if(notice_unread) commit('setNoticeUnread', notice_unread) 
      if(is_reset_pwd)commit('setIsRestPswd',is_reset_pwd)
      if(nickname)commit('setNickname',nickname)
      if(app_title)commit('setApp_title',app_title)
      // 如不使用username用户名,可删除以下代码
      if (username) commit('setUsername', username)
      // 如不使用avatar头像,可删除以下代码
      if (avatar) commit('setAvatar', avatar)
      // 设置开关
      commit('setIsArea', is_area)
      // 设置坐席模式
      if(sip_type) commit('setSipType',sip_type)
      // 设置视图上限数量
      if(app_auth.length > 0){
        commit('setViewNumber', app_auth[0].value)
      }
      // 设置SIP座机编号
      if(sip_code) commit('setSipCode',sip_code)
      // 设置坐席号
      if(agent_code) commit ('setAgentCode', agent_code)
      // 如不使用roles权限控制,可删除以下代码
      if (roles) dispatch('acl/setRole', roles, { root: true })
      // 如不使用permissions权限控制,可删除以下代码
      if (permissions)
        dispatch('acl/setPermission', permissions, { root: true })
    }
  },
  /**
   * @description 退出登录
   * @param {*} { dispatch }
   */
  async logout({ dispatch }) {
    logout()
    await dispatch('resetAll')
    localStorage.removeItem('agentStatus')    // 清空作息状态
    // if(window.webPhone){
    //   window.webPhone.destroy()
    //   window.webPhone = null
    // }
    window.location.reload() //解决通话条退出后跳转到登录页webscoket持续连接导致通话条账号互顶的问题
  },
  /**
   * @description 重置token、roles、permission、router、tabsBar等
   * @param {*} { commit, dispatch }
   */
  async resetAll({ commit, dispatch }) {
    commit('setUsername', '游客')
    commit('isRestPswd', 0)
    commit('nickname', '暂无数据')
    commit('app_title', '暂无数据')
    commit('setAvatar', '@/assets/images/default-avatar.png')
    commit('routes/setRoutes', [], { root: true })
    await dispatch('setToken', '')
    await dispatch('acl/setFull', false, { root: true })
    await dispatch('acl/setRole', [], { root: true })
    await dispatch('acl/setPermission', [], { root: true })
    await dispatch('tabs/delAllVisitedRoutes', null, { root: true })
    await resetRouter()
    removeToken()
  },
  /**
   * @description 设置token
   * @param {*} { commit }
   * @param {*} token
   */
  setToken({ commit }, token) {
    commit('setToken', token)
  },
  /**
   * @description 设置头像
   * @param {*} { commit }
   * @param {*} avatar
   */
  setAvatar({ commit }, avatar) {
    commit('setAvatar', avatar)
  },
  /**
   * @description 设置坐席模式
   * @param {*} { commit }
   * @param {*} sipType
   */
   setSipType({ commit }, sipType) {
    commit('setSipType', sipType)
  },

}
export default { state, getters, mutations, actions }
