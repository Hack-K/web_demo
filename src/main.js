import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'

// 加载雪碧图
// 加载全局样式样式
import '@/assets/icons' // icon
import '@/assets/styles/zn.scss'


console.log("发布版本", process.env.VUE_APP_RELEASE_VERSION)
// 加载主题
const Themes = require.context('@/assets/styles/themes', false, /\.scss$/)
try{
  Themes.keys().map(Themes)
}catch(e){
  console.error(e)
}


// 加载插件
const Plugins = require.context('./plugins', true, /\.js$/)
Plugins.keys().map(Plugins)

// Vue.use(VueBus)

// 加载组件
const Components = require.context('@/components', true, /\.vue$/)
Components.keys()
  .map(Components)
  .forEach((item) => {
    if (item.default.name && item.default.name !== 'Layouts')
      Vue.component(item.default.name, item.default)
  })
//防多次点击，重复提交
import preventReClick from '@/utils/preventReClick'
// 全局方法引入
import { parseTime,indexMethod,getCurrentTime,compare } from '@/utils'
// 全局数据刷新事件总线
import refreshDataBus  from '@/utils/refreshData'

Vue.use(refreshDataBus)
// 全局方法下载引入
import { download, correctModal, scrollView } from '@/api'

Vue.prototype.parseTime = parseTime
Vue.prototype.indexMethod = indexMethod
Vue.prototype.getCurrentTime = getCurrentTime
Vue.prototype.compare = compare
Vue.prototype.$download = download
Vue.prototype.$correctModal = correctModal
Vue.prototype.$scrollView = scrollView

Vue.config.productionTip = false

new Vue({
  el: '#app',
  store,
  router,
  preventReClick,
  render: (h) => h(App),
})
