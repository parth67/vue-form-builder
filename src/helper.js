import { get as objGet, isFunction, filter } from 'lodash'
import { createNamespacedHelpers } from 'vuex'
// import Vue from 'vue'

/* export function setVmForVal (store, namespace, model, formatValueToField, formatValueToModel) {
  let vm = new Vue({
    store,
    computed: {
      value: {
        get: function () {
          let mapState = createNamespacedHelpers(namespace).mapState({
            value: (state) => {
              let value = objGet(state, model, null)
              return isFunction(formatValueToField) ? formatValueToField(value) : value
            }
          })
          return mapState.value.call({ $store: store })
        },
        set: function (newVal) {
          let mapActions = createNamespacedHelpers(namespace).mapActions({
            set: 'set'
          })
          mapActions.set.call({ $store: store }, {
            key: model,
            value: isFunction(formatValueToModel) ? formatValueToModel(newVal) : newVal
          })
        }
      }
    }

  })
  return vm
} */

function defaultGetter (store, namespace, model, formatValueToField) {
  return function getter () {
    let mapState = createNamespacedHelpers(namespace).mapState({
      value: (state) => {
        let value = objGet(state, model, null)
        return isFunction(formatValueToField) ? formatValueToField(value) : value
      }
    })
    return mapState.value.call({$store: store})
  }
}

function defaultSetter (store, namespace, model, formatValueToModel) {
  return function commiter (value) {
    let mapActions = createNamespacedHelpers(namespace).mapActions({
      set: 'set'
    })
    mapActions.set.call({$store: store}, {
      key: model,
      value: isFunction(formatValueToModel) ? formatValueToModel(value) : value
    })
  }
}

/* export function getModuleByNamespace (store, namespace) {
  let retVal = {
    dispatch: store.dispatch,
    commit: store.commit,
    getters: store.getters,
    state: store.state
  }
  if (isString(namespace)) {
    if (namespace.charAt(namespace.length - 1) !== '/') {
      namespace += '/'
    }
    const module = store._modulesNamespaceMap[namespace]
    if (process.env.NODE_ENV !== 'production' && !module) {
      console.error(`module namespace not found : ${namespace}`)
    }

    if (module && module.context) {
      retVal = module.context
    }
  } else {
    console.error(`namespace value error - value : ${namespace}`)
  }

  return retVal
} */

export function defineValueProperty (obj, store, namespace, model, formatValueToField, formatValueToModel) {
  let getter = defaultGetter(store, namespace, model, formatValueToField)
  let setter = defaultSetter(store, namespace, model, formatValueToModel)
  Object.defineProperty(obj, 'value', {
    enumerable: true,
    configurable: true,
    get: function valueGetter () {
      return getter()
    },
    set: function (newVal) {
      let value = getter()
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      setter(newVal)
    }
  })
}

export function createNamespacedStore (storeDef) {
  return {...storeDef, namespaced: true}
}

export function slugify (name = '') {
  // Return the slugified version of either:
  return name
  // NB: This is a very simple, conservative, slugify function,
  // avoiding extra dependencies.
    .toString()
    .trim()
    .toLowerCase()
    // Spaces to dashes
    .replace(/ /g, '-')
    // Multiple dashes to one
    .replace(/-{2,}/g, '-')
    // Remove leading & trailing dashes
    .replace(/^-+|-+$/g, '')
    // Remove anything that isn't a (English/ASCII) letter, number or dash.
    .replace(/([^a-zA-Z0-9-_/.:]+)/g, '')
}

/*
current impl is call one by one waiting for each finish (sequential process).
if required change this to no-wait function
 */
export function getNotifyCallFunction (...args) {
  return async function (localContext) {
    for (let i = 0; i < args.length; i++) {
      await args[i](localContext)
    }
  }
}

export function namespaceToArray (namespace) {
  return filter(namespace.split('/'), (value) => {
    return value !== ''
  })
}

