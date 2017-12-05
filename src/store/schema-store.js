import { each, isArray, isFunction, isObject } from 'lodash'
import { getNotifyCallFunction, namespaceToArray, setVmForVal } from '../helper'
import fieldStore from './field-store'
import Vue from 'vue'
// import groupStore from './group-store'

const state = function () {
  return {
    modelNamespace: '',
    schemaNamespace: '',
    fields: [],
    groups: {}
  }
}

const getters = {
  modelNamespace (state) {
    return state.modelNamespace
  },
  schemaNamespace (state) {
    return state.schemaNamespace
  }
}

const mutations = {
  setSchemaNamespace (state, payload) {
    state.schemaNamespace = payload.value
  },
  setModelNamespace (state, payload) {
    state.modelNamespace = payload.value
  },
  addField (state, payload) {
    state.fields.push(payload.value)
  },
  addGroupField (state, payload) {
    let gId = payload.groupId
    let fId = payload.fieldId
    let gMap = state.groups[gId]
    if (isObject(gMap)) {
      gMap.push(fId)
    } else {
      Vue.set(state.groups, gId, [fId])
    }
  },
  clearGroups (state) {
    state.groups = {}
  },
  clearFields (state) {
    state.fields.splice(0)
  }
}

const actions = {
  init (context, payload) {
    let schema = payload.value
    let {schemaNamespace, modelNamespace} = payload

    context.commit({
      type: 'setSchemaNamespace',
      value: schemaNamespace
    })

    context.commit({
      type: 'setModelNamespace',
      value: modelNamespace
    })

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

    function processField (field) {
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
          dependencyMap[depId].push(field.watcher.bind(null, context))
        })
      }

      // onChange and onValidate needs to be bound to this.
      if (isFunction(field.onChange)) {
        field.onChange.bind(null, context)
      }
      if (isFunction(field.onValidate)) {
        field.onValidate.bind(null, context)
      }
      field._private = {}
      // defineValueProperty(field._private, store, modelNamespace, field.model, field.formatValueToField, field.formatValueToModel)
      field._private._vm = setVmForVal(store, modelNamespace, field.model, field.formatValueToField, field.formatValueToModel)
      delete field.formatValueToField
      delete field.formatValueToModel
      delete field.watcher
    }

    each(schema.fields, (field) => {
      processField(field)
    })

    each(schema.groups, (gVal) => {
      each(gVal.fields, (fVal) => {
        processField(fVal)
      })
    })

    let schemaNamespaceArr = namespaceToArray(context.getters.schemaNamespace)
    // now inject real notify chain using dependencyMap
    each(schema.fields, (field) => {
      let fid = field.id
      let callChain = dependencyMap[fid]
      if (isArray(callChain)) {
        field.notifier = getNotifyCallFunction(...callChain)
      }

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

    each(schema.groups, (gVal) => {
      let gId = gVal.id
      each(gVal.fields, (fVal) => {
        let fid = fVal.id
        let callChain = dependencyMap[fid]
        if (isArray(callChain)) {
          fVal.notifier = getNotifyCallFunction(...callChain)
        }

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

  },
  dispose (context) {
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

export default {
  state,
  actions,
  mutations,
  getters,
  namespaced: true
}
