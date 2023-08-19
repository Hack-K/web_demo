// 数据刷新事件总线
const install = function(Vue){
    const Bus = new Vue({
        methods: {
            emit(event, ...arg){
                this.$emit(event, ...arg)
            },
            on(event, callback){
                this.$on(event, callback)
            },
            off(event, callback){
                this.$off(event, callback)
            }
        }
    })
    Vue.prototype.$EventBus = Bus
}
export default install