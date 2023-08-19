/**
 * @description 页面数据状态存储
 */
const state = () => ({
    record: {},
  })
  const getters = {
    record: (state) => state.record,
  }
  const mutations = {
    setRecordData(state, record) {
      let {key} =record;
      delete record['keywords']
      // delete state.record[key]['keywords']
      state.record[key] = record
    },
  }
  const actions = {
    setRecordData({ commit }, record) {
      commit('setRecordData', record)
    },
  }
  export default { state, getters, mutations, actions }
  