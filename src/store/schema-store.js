import {
  each,
  isArray,
  isFunction,
  isObject,
  isString,
  uniqueId,
  get as objGet,
  cloneDeep
} from 'lodash'
import {
  getCallChainFunction,
  getCallChainFunctionForkJoin,
  namespaceToArray,
  defineValueProperty,
  slugify,
  getModuleByNamespace
} from '../helper'
import fieldStore from './field-store'
import Vue from 'vue'
// import groupStore from './group-store'

const state = function () {
  return {
    modelNamespace: '',
    schemaNamespace: '',
    validateOnLoad: false,
    fields: [],
    groups: {},
    groupsLabel: {},
    watchers: []
  }
}

const getters = {}

const mutations = {
  setSchemaNamespace (state, payload) {
    state.schemaNamespace = payload.value
  },
  setModelNamespace (state, payload) {
    state.modelNamespace = payload.value
  },
  setValidateOnLoad (state, payload) {
    state.validateOnLoad = payload.value
  },
  addField (state, payload) {
    state.fields.push(payload.value)
  },
  addGroupField (state, payload) {
    let gId = payload.groupId
    let fId = payload.fieldId
    let gMap = state.groups[gId]
    if (isArray(gMap)) {
      gMap.push(fId)
    } else {
      Vue.set(state.groups, gId, [fId])
    }
  },
  addGroupsLabel (state, payload) {
    let {groupId, label} = payload
    Vue.set(state.groupsLabel, groupId, label)
  },
  clearGroups (state) {
    state.groups = {}
    state.groupsLabel = {}
  },
  clearFields (state) {
    state.fields.splice(0)
  },
  addWatcher (state, payload) {
    state.watchers.push(payload.watcher)
  },
  clearWatcher (state) {
    for (let i = 0; i < state.watchers.length; i++) {
      let unwatch = state.watchers[i]
      if (unwatch && unwatch.then) {
        unwatch.then((v) => v())
      }
    }
    state.watchers.splice(0)
  }
}

const actions = {
  init (context, payload) {
    let schema = payload.value
    let {schemaNamespace, modelNamespace} = payload

    let {validateOnLoad = false} = schema

    each(context.state.fields, (fStore) => {
      this.unregisterModule(fStore)
    })

    each(context.state.groups, (gVal) => {
      each(gVal, (gfStore) => {
        this.unregisterModule(gfStore)
      })
    })

    context.commit({
      type: 'clearGroups'
    })

    context.commit({
      type: 'clearFields'
    })

    context.commit({
      type: 'setSchemaNamespace',
      value: schemaNamespace
    })

    context.commit({
      type: 'setModelNamespace',
      value: modelNamespace
    })

    context.commit({
      type: 'setValidateOnLoad',
      value: validateOnLoad
    })

    // let modelContext = getModuleByNamespace(this, modelNamespace)

    // group field id's are changed as 'groupId/fieldId'
    each(schema.groups, (gVal) => {
      const gId = gVal.id
      if (gId === undefined) {
        console.error('Group id is not defined')
      }
      each(gVal.fields, (fVal) => {
        if (fVal.id === undefined) {
          console.error(`Filed without id Label: ${fVal.label}, Model: ${fVal.model}`)
        }
        const id = `${gId}/${fVal.id}`
        fVal.fId = fVal.id
        fVal.id = id
      })
    })

    // collect dependency information in a map
    // map key is id of field
    // map value is array of functions needs to be called on field change
    let dependencyMap = {}
    let store = this
    let schemaNamespaceArr = namespaceToArray(context.state.schemaNamespace)

    function processField (passField) {
      let field = cloneDeep(passField)
      let funcBindCtx = {}
      if (isString(field.styleClasses)) {
        field.styleClasses = [field.styleClasses]
      }

      // if id is not there generate one
      if (field.id === undefined) {
        field.id = slugify(uniqueId(field.model))
      }

      // dependsOn and wather must be defined
      if (isArray(field.dependsOn) &&
        isFunction(field.watcher)) {
        each(field.dependsOn, (depId) => {
          // depId is object with group and field key
          if (isObject(depId)) {
            depId = `${depId.group}/${depId.field}`
          }
          // create new entry in map id not there.
          if (!isArray(dependencyMap[depId])) {
            dependencyMap[depId] = []
          }
          // push watcher in map

          dependencyMap[depId].push(getWrappedFunction(store, field.watcher.bind(funcBindCtx), modelNamespace, schemaNamespace, field.id))
        })
      }

      // process buttons
      each(field.buttons, (b) => {
        b.onClick = getWrappedFunction(store, b.onClick.bind(funcBindCtx), modelNamespace, schemaNamespace, field.id)
      })

      // onChange and onValidate needs to be bound to this.
      if (isFunction(field.onChange)) {
        field.onChange = getWrappedFunction(store, field.onChange.bind(funcBindCtx), modelNamespace, schemaNamespace, field.id)
      }
      if (isFunction(field.onValidate)) {
        field.onValidate = getWrappedFunction(store, field.onValidate.bind(funcBindCtx), modelNamespace, schemaNamespace, field.id)
      }

      if (isFunction(field.items)) {
        field.items = getWrappedFunction(store, field.items.bind(funcBindCtx), modelNamespace, schemaNamespace, field.id)
      }

      if (isFunction(field.validator)) {
        field.validator = [field.validator]
      }

      if (isArray(field.validator)) {
        let validatorArr = []
        each(field.validator, (validator) => {
          validatorArr.push(getWrappedFunction(store, validator.bind(funcBindCtx), modelNamespace, schemaNamespace, field.id))
        })
        field.validator = getCallChainFunctionForkJoin(...validatorArr)
      }

      field._private = {}
      defineValueProperty(field._private, store, modelNamespace, field.model, field.formatValueToField, field.formatValueToModel)
      delete field.formatValueToField
      delete field.formatValueToModel
      delete field.watcher
      // delete field.dependsOn
      return field
    }

    let fields = []
    let groups = []

    each(schema.fields, (field) => {
      fields.push(processField(field))
    })

    each(schema.groups, (gVal) => {
      context.commit({
        type: 'addGroupsLabel',
        groupId: gVal.id,
        label: gVal.label
      })
      let lgroup = {}
      lgroup.id = gVal.id
      lgroup.fields = []
      each(gVal.fields, (fVal) => {
        lgroup.fields.push(processField(fVal))
      })
      groups.push(lgroup)
    })

    // now inject real notify chain using dependencyMap
    each(fields, (field) => {
      let fid = field.id
      let callChain = dependencyMap[fid]
      if (isArray(callChain)) {
        field.notifier = getCallChainFunction(...callChain)
      }

      let unwatch = registerNotifyWatcher(store, field, modelNamespace)
      context.commit({
        type: 'addWatcher',
        watcher: unwatch
      })

      let fNamespace = [...schemaNamespaceArr, (field.id)]
      this.registerModule(fNamespace, fieldStore)
      context.dispatch({
        type: `${field.id}/init`,
        // modelNamespace: modelNamespace,
        value: field
      })

      context.commit({
        type: 'addField',
        value: fNamespace
      })
    })

    each(groups, (gVal) => {
      let gId = gVal.id
      each(gVal.fields, (fVal) => {
        let fid = fVal.id
        let callChain = dependencyMap[fid]
        if (isArray(callChain)) {
          fVal.notifier = getCallChainFunction(...callChain)
        }

        let unwatch = registerNotifyWatcher(store, fVal, modelNamespace)
        unwatch.then((val) => {
          context.commit({
            type: 'addWatcher',
            watcher: val
          })
        })

        let fNamespace = [...schemaNamespaceArr, (fVal.id)]
        this.registerModule(fNamespace, fieldStore)
        // let fId = fVal.fId
        delete fVal.fId
        context.dispatch({
          type: `${fVal.id}/init`,
          value: fVal
        })
        context.commit({
          type: 'addGroupField',
          groupId: gId,
          fieldId: fNamespace
        })
      })
    })

    context.dispatch({
      type: 'setUpWatcher'
    })
  },
  setUpWatcher (context) {
    each(context.state.fields, (fStore) => {
      context.dispatch({
        type: fStore[fStore.length - 1] + '/setUpWatcher',
        validateOnLoad: context.state.validateOnLoad
      })
    })

    each(context.state.groups, (gVal) => {
      each(gVal, (gfStore) => {
        context.dispatch({
          type: gfStore[gfStore.length - 1] + '/setUpWatcher',
          validateOnLoad: context.state.validateOnLoad
        })
      })
    })
  },
  dispose (context) {

    context.commit({
      type: 'clearWatcher'
    })

    each(context.state.fields, (fStore) => {
      this.unregisterModule(fStore)
    })

    each(context.state.groups, (gVal) => {
      each(gVal, (gfStore) => {
        this.unregisterModule(gfStore)
      })
    })

    context.commit({
      type: 'clearGroups'
    })

    context.commit({
      type: 'clearFields'
    })
  }
}

function registerNotifyWatcher (store, field, modelNamespace) {
  return new Promise(function (resolve) {
    field.registerWatcher = (passFunc) => {
      let unwatch = store.watch(function (state, getters) {
        let mContext = getModuleByNamespace(store, modelNamespace)
        let value = objGet(mContext.state, field.model, null)
        return value
      }, function (val, oldVal) {
        if (isFunction(passFunc)) {
          passFunc(val, oldVal)
        }
      }, {
        immediate: true
      })
      resolve(unwatch)
    }
  })
}

function getWrappedFunction (store, funct, modelNamespace, schemaNamespace, fid) {
  let retVal = (...args) => {
    let modelCtx = getModuleByNamespace(store, modelNamespace)
    let schemaCtx = getModuleByNamespace(store, schemaNamespace)

    if (schemaNamespace.charAt(schemaNamespace.length - 1) !== '/') {
      schemaNamespace += '/'
    }

    let fieldCtx = getModuleByNamespace(store, schemaNamespace + fid)
    return funct(modelCtx, schemaCtx, fieldCtx, ...args)
  }

  return retVal
}

export default {
  state,
  actions,
  mutations,
  getters,
  namespaced: true
}
