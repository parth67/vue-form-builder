import { keys, each, isObject, has, isFunction, flattenDepth, filter, isNil, negate } from 'lodash'
import Vue from 'vue'
// import { defineValueProperty } from './helper'

const state = function () {
  return {
    // Initial state of field-store
    // non-editable
    id: null,
    model: null,
    type: null,
    dependsOn: [],
    label: '',
    helpText: '',
    hint: '',

    // editable see mutation
    visible: true,
    disabled: false,
    styleClasses: [],
    rowClasses: '',
    fieldClasses: '',
    errors: [],

    // methods for processing
    validator: null, // validator is merge chain
    // formatValueToField: identity,
    // formatValueToModel: identity,
    onChange: null, // identity
    onValidate: null, // identity
    // on change call this notification chain.
    // on field def see: watcher option function.
    // this points to store itself first arg is schema store context
    notifier: null,
    _private: {
      // private data to be stored
      value: null,
      // schemaNamespace: '',
      savedValue: null,
      // this is not used for now. but we might require to enable disable validation
      validationRequired: true
    }
    // default: 'val', // if attribute is added.
    // value: null,
  }
}

const getters = {
  // Getters to access field-store values
  value (state) {
    return state._private.value
  },
  privateData (state) {
    return state._private
  },
  // schemaNamespace (state) {
  //   return state._private.schemaNamespace
  // },
  savedValue (state) {
    return state._private.savedValue
  },
  hasErrors (state) {
    return state.errors.length > 0
  }
  // label (state) {
  //   return state.label
  // },
  // hint (state) {
  //   return state.hint
  // },
  // helpText (state) {
  //   return state.helpText
  // },
  // errors (state) {
  //   return state.errors
  // }
}

const actions = {
  // Asynchronous mutations commits to modify field-store
  init (context, payload) {
    let {value: fieldDef} = payload

    // define private space to save value
    // fieldDef._private = {}
    // defineValueProperty(fieldDef._private, this, modelNamespace, fieldDef.model, fieldDef.formatValueToField, fieldDef.formatValueToModel)

    if (isFunction(fieldDef.registerWatcher)) {
      // on change of this field we need to notify others about change.
      // we will setup Vue instance for this purpose with watcher attached
      // to value of this field
      // eslint-disable-next-line func-names, no-new
      // new Vue({
      //   computed: {
      //     watchVal () {
      //       console.log('recompute watchval')
      //       return context.state._private.value
      //     }
      //   },
      //   watch: {
      //     'watchVal': {
      //       handler: function (val, oldVal) {
      //         context.dispatch({
      //           type: 'notify',
      //           newVal: val,
      //           oldVal: oldVal
      //         })
      //       },
      //       immediate: true
      //     }
      //   }
      // })
      fieldDef.registerWatcher((newVal, oldVal) => {
        context.dispatch({
          type: 'notify',
          newVal: newVal,
          oldVal: oldVal
        })
      })
    }

    context.commit({
      type: 'merge',
      value: fieldDef
    })
  },
  hide ({commit, dispatch, state}, payload) {
    if (state.visible === true) {
      commit({
        type: 'preserveValue'
      })
      commit({
        type: 'hide'
      })
      return dispatch({
        type: 'validate'
      })
    }
  },
  show ({commit, dispatch, state}, payload) {
    if (state.visible === false) {
      commit({
        type: 'restoreValue'
      })
      commit({
        type: 'show'
      })
      return dispatch({
        type: 'validate'
      })
    }
  },
  validate (context) {
    let validator = context.state.validator
    if (isFunction(validator)) {
      // its a validator chain. call each function with value
      // call each validator in chain
      let currVal = context.getters.value
      let validatorResultPromise = validator(currVal)

      validatorResultPromise.then(function (result) {
        let flattenErrors = filter(flattenDepth(result, 3), negate(isNil))
        context.commit({
          type: 'setErrors',
          value: flattenErrors
        })

        // call onchange
        if (isFunction(context.state.onValidate)) {
          context.state.onValidate(flattenErrors)
        }
      })
    }

    // return context.dispatch({
    //   type: 'notify'
    // })
  },
  notify (context, payload) {
    // call dependency change notifier
    if (isFunction(context.state.notifier)) {
      context.state.notifier(context, context.state.id, payload.newVal, payload.oldVal)
    }
  },
  setValue (context, payload) {
    const {value} = payload
    // get current value
    const oldVal = context.getters.value

    if (oldVal === value) {
      // change in value.
      return
    }

    // commit new value
    context.commit({
      type: 'setValue',
      value: value
    })

    // get new value with formatter applied
    const newVal = context.getters.value

    // call onchange
    if (isFunction(context.state.onChange)) {
      context.state.onChange(oldVal, newVal)
    }

    // TODO should we move to watcher. we will need watcher for all
    // call validate
    return context.dispatch({
      type: 'validate'
    })
  }
}

const mutations = {
  // Synchronous modifications of field-store
  merge (state, payload) {
    const obj = payload.value
    if (isObject(obj)) {
      each(keys(obj), (key) => {
        if (has(state, key) || key === 'value') {
          state[key] = obj[key]
        } else {
          // define new property
          // console.warn(`unknown key in field-store ${key}`)
          Vue.set(state, key, obj[key])
        }
      })
    }
  },
  mergePrivate (state, payload) {
    const obj = payload.value
    state._private = {...state._private, ...obj}
  },
  hide (state) {
    state.visible = false
  },
  show (state) {
    state.visible = true
  },
  disable (state) {
    state.disabled = true
  },
  enable (state) {
    state.disabled = false
  },
  setStyleClasses (state, payload) {
    const {value = []} = payload
    state.styleClasses = value
  },
  setErrors (state, payload) {
    const {value = ''} = payload
    state.errors = value
  },
  clearErrors (state) {
    state.errors.splice(0)
  },
  setAttr (state, payload) {
    let {key, value} = payload
    Vue.set(state, key, value)
  },
  // private
  setValue (state, payload) {
    const {value = ''} = payload
    state._private.value = value
  },
  // set saved val
  preserveValue (state) {
    state._private.savedValue = state._private.value
    state._private.value = null
  },
  restoreValue (state) {
    state._private.value = state._private.savedValue
    state._private.savedValue = null
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}

