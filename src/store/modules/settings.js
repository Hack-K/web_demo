/**
 * @description 所有全局配置的状态管理，如无必要请勿修改
 */
import { isJson } from '@/utils/validate'
import {
  background,
  collapse as _collapse,
  columnStyle,
  fixedHeader,
  layout,
  logo,
  showFullScreen,
  showCallBar,
  showNotice,
  showDownLoading,
  showProgressBar,
  showRefresh,
  showZnSearchBtn,
  showTabs,
  showTabsIcon,
  showTheme,
  showThemeSetting,
  tabsBarStyle,
  themeName,
  title,
} from '@/config'

const defaultTheme = {
  background,
  columnStyle,
  fixedHeader,
  layout,
  showProgressBar,
  showTabs,
  tabsBarStyle,
  showTabsIcon,
  showRefresh,
  showZnSearchBtn,
  showTheme,
  showCallBar,
  showNotice,
  showDownLoading,
  showFullScreen,
  showThemeSetting,
  themeName,
}
const getLocalStorage = (key) => {
  const value = localStorage.getItem(key)
  if (isJson(value)) {
    return JSON.parse(value)
  } else {
    return false
  }
}
const { collapse } = getLocalStorage('collapse')
const state = () => ({
  logo,
  title,
  device: 'desktop',
  collapse: collapse || _collapse,
  theme: getLocalStorage('theme') || { ...defaultTheme },
  extra: { first: '' },
})
const getters = {
  logo: (state) => state.logo,
  title: (state) => state.title,
  device: (state) => state.device,
  collapse: (state) => state.collapse,
  theme: (state) => state.theme,
  extra: (state) => state.extra,
}
const mutations = {
  openSideBar(state) {
    state.collapse = false
  },
  foldSideBar(state) {
    state.collapse = true
  },
  toggleDevice(state, device) {
    state.device = device
  },
  toggleCollapse(state) {
    state.collapse = !state.collapse
    localStorage.setItem('collapse', `{"collapse":${state.collapse}}`)
  },
  saveTheme(state) {
    localStorage.setItem('theme', JSON.stringify(state.theme))
  },
  resetTheme(state) {
    state.theme = { ...defaultTheme }
    localStorage.removeItem('theme')
  },
  updateTheme(state) {
    document.getElementsByTagName(
      'body'
    )[0].className = `theme-${state.theme.themeName}`
    if (state.theme.background !== 'none') {
      document
        .getElementsByTagName('body')[0]
        .classList.add(state.theme.background)
    }
  },
}
const actions = {
  openSideBar({ commit }) {
    commit('openSideBar')
  },
  foldSideBar({ commit }) {
    commit('foldSideBar')
  },
  toggleDevice({ commit }, device) {
    commit('toggleDevice', device)
  },
  toggleCollapse({ commit }) {
    commit('toggleCollapse')
  },
  saveTheme({ commit }) {
    commit('saveTheme')
  },
  resetTheme({ commit }) {
    commit('resetTheme')
    commit('updateTheme')
  },
  updateTheme({ commit }) {
    commit('updateTheme')
  },
}
export default { state, getters, mutations, actions }
