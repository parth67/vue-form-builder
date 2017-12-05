import Vue from 'vue'

const state = {
  a: 123
}
const getters = {
  // Getters to access your store values
  getA (state) {
    return state.a
  }
}

const arrayIndexRegex = /([^[]+)\[(\d+)\]$/

const actions = {
  set ({commit}, payload) {
    const key = payload.key
    const parts = key.split('.')
    const firstpart = parts.shift()
    if (parts.length === 0) {
      // commit to this object
      commit({
        type: 'set',
        key: firstpart,
        value: payload.value
      })
    } else if (arrayIndexRegex.test(firstpart)) {
      // its an array access.
      const match = arrayIndexRegex.match(firstpart)
      const module = match[1]
      const index = match[2]

      commit({
        type: `${module}/set`,
        index,
        key: parts,
        value: payload.value
      })
    } else {
      // its object access

      commit({
        type: `${firstpart}/set`,
        key: parts,
        value: payload.value
      })
    }
  }
}
const mutations = {
  // Synchronous modifications of  your store
  set (state, payload) {
    // console.log('commit', payload, state)
    const key = payload.key
    const val = payload.value
    // console.log('commit', key, val, state[key])
    Vue.set(state, key, val)
    // state[key] = val;
  }
}
export default {
  state,
  getters,
  actions,
  mutations
}
