/**
 * @description 通话条容联返回状态储存
 */

 const state = () => ({
    phoneNum: '',
    isCallIng: false,
    isCallQuick: false,
    statusNumber: '',
    memberId: '',
    hangUp:{
        time:"",
        my:false,
    }
})
const getters = {
    phoneNum: (state) => state.phoneNum,
    statusNumber: (state) => state.statusNumber,
    memberId: (state) => state.memberId,
    isCallIng: (state) => state.isCallIng,
    isCallQuick: (state) => state.isCallQuick,
    hangUp:(state)=>state.hangUp
}
const mutations = {
    /**
  * @description 设置当前页面点击的电话号码
  * @param {*} state
  * @param {*} phoneNum
  */
    setPhoneNum(state, phoneNum) {
        if(this.state.user.isArea){
            if (phoneNum.toString().indexOf('021') !== 0 && phoneNum.length === 8 && phoneNum !== '') {
                phoneNum = '021' + phoneNum.toString()
            }
        }
        state.phoneNum = phoneNum
    },
    setStatusNumber(state, statusNumber) {
        state.statusNumber = statusNumber
    },
    setIsCallIng(state, isCallIng) {
        // console.log("mutation setIsCallIng", isCallIng)
        state.isCallIng = isCallIng
    },
    setIsCallQuick(state, isCallQuick) {
        state.isCallQuick = isCallQuick
    },
    setMemberId(state, memberId){
        state.memberId = memberId
    },
    setHangUp(state,hangUp){
        state.hangUp = hangUp
    }
}
const actions = {
    /**
  * @description 设置当前页面点击的电话号码
  * @param {*} { commit }
  * @param {*} phoneNum
  */
    setPhoneNum({ commit }, phoneNum) {
        if(this.state.user.isArea){
            if (phoneNum.toString().indexOf('021') !== 0 && phoneNum.length === 8 && phoneNum !== '') {
                phoneNum = '021' + phoneNum.toString()
            }
        }
        commit('setPhoneNum', phoneNum)
    },
    /**
     * @description 修改 statusNumber
     * @param {*} { commit }
     * @param activeName 当前容联statusNumber
     */
     setStatusNumber({ commit }, statusNumber) {
        commit('setStatusNumber', statusNumber)
    },
    /**
     * @description 修改 isCallIng
     * @param {*} { commit }
     * @param activeName 当前通话条是否为通话中
     */
     setIsCallIng({ commit }, isCallIng) {
        // console.log("actions setIsCallIng", isCallIng)
        commit('setIsCallIng', isCallIng)
    },
    /**
     * @description 修改 isCallQuick
     * @param {*} { commit }
     * @param activeName 当前是否为快捷拨号
     */
     setIsCallQuick({ commit }, isCallQuick) {
        commit('setIsCallQuick', isCallQuick)
    },
    /**
     * @description 修改 memberId
     * @param {*} { commit }
     * @param activeName 当前拨号绑定的用户ID
     */
     setMemberId({ commit }, memberId) {
        commit('setMemberId', memberId)
    },
    setHangUp({ commit }, hangUp) {
        commit('setHangUp', hangUp)
    },
}
export default { state, getters, mutations, actions }
