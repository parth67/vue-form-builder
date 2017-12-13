import Vue from 'vue'

const prefix = '_async_computed$'

Vue.config
  .optionMergeStrategies
  .asyncComputed = Vue.config.optionMergeStrategies.computed

let mixin = {
  beforeCreate () {
    const optionData = this.$options.data

    if (!this.$options.computed) this.$options.computed = {}

    for (const key in this.$options.asyncComputed || {}) {
      this.$options.computed[prefix + key] = getterFn(key, this.$options.asyncComputed[key])
    }

    this.$options.data = function vueAsyncComputedInjectedDataFn () {
      const data = (
        (typeof optionData === 'function')
          ? optionData.call(this)
          : optionData
      ) || {}
      for (const key in this.$options.asyncComputed || {}) {
        const item = this.$options.asyncComputed[key]
        data[key] = generateDefault.call(this, item)
      }
      return data
    }
  },
  beforeMount () {
    for (const key in this.$options.asyncComputed || {}) {
      let promiseId = 0
      this.$watch(prefix + key, newPromise => {
        const thisPromise = ++promiseId

        if (!newPromise || !newPromise.then) {
          newPromise = Promise.resolve(newPromise)
        }

        newPromise.then(value => {
          if (thisPromise !== promiseId) return
          this[key] = value
        }).catch(err => {
          if (thisPromise !== promiseId) return
          console.error('Error evaluating async computed property:', err)
        })
      }, {immediate: true})
    }
  }
}

function getterFn (key, fn) {
  if (typeof fn === 'function') return fn

  let getter = fn.get

  if (fn.hasOwnProperty('watch')) {
    getter = function getter () {
      fn.watch.call(this)
      return fn.get.call(this)
    }
  }
  return getter
}

function generateDefault (fn) {
  let defaultValue = null

  if ('default' in fn) {
    defaultValue = fn.default
  }

  if (typeof defaultValue === 'function') {
    return defaultValue.call(this)
  } else {
    return defaultValue
  }
}

export default mixin
