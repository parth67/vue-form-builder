import { keys, each, isObject, has, isFunction, isArray, flattenDepth } from 'lodash'
// import { defineValueProperty } from './helper'

const state = {
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
  styleClass: '',
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
  label (state) {
    return state.label
  },
  hint (state) {
    return state.hint
  },
  helpText (state) {
    return state.helpText
  }
}

const actions = {
  // Asynchronous mutations commits to modify field-store
  init ({state, commit}, payload) {
    let { value: fieldDef } = payload

    // validator must be array of function.
    if (isFunction(fieldDef.validator)) {
      // redefine as array of function
      fieldDef.validator = [fieldDef.validator]
    }

    // define private space to save value
    // fieldDef._private = {}
    // defineValueProperty(fieldDef._private, this, modelNamespace, fieldDef.model, fieldDef.formatValueToField, fieldDef.formatValueToModel)

    console.log(fieldDef)
    commit({
      type: 'merge',
      value: fieldDef
    })
  },
  hide ({commit, dispatch}, payload) {
    commit({
      type: 'preserveValue'
    })
    commit({
      type: 'hide'
    })
    return dispatch({
      type: 'validate'
    })
  },
  show ({commit, dispatch}, payload) {
    commit({
      type: 'restoreValue'
    })
    commit({
      type: 'show'
    })
    return dispatch({
      type: 'validate'
    })
  },
  validate (context) {
    let validatorArray = state.validator
    if (isArray(validatorArray)) {
      // its a validator chain. call each function with value
      // call each validator in chain
      let currVal = context.getters.value
      let validatorResult = []
      each(validatorArray, (validatorFunc) => {
        let result = validatorFunc.call(context, currVal)
        validatorResult.push(result)
      })

      let flattenErrors = flattenDepth(validatorResult, 3)
      context.commit({
        type: 'setErrors',
        value: flattenErrors
      })

      // call onchange
      if (isFunction(context.state.onValidate)) {
        context.state.onValidate(context, flattenErrors)
      }

      // call dependency change notifier
      if (isFunction(context.state.notifier)) {
        context.state.notifier(context)
      }
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
      context.state.onChange(context, oldVal, newVal)
    }

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
          console.warn(`unknown key in field-store ${key}`)
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
  setStyleClass (state, payload) {
    const {value = ''} = payload
    state.styleClass = value
  },
  setErrors (state, payload) {
    const {value = ''} = payload
    state.errors = value
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

