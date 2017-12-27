<template>

  <div class="vue-form-generator" v-if="schema != null">
    <fieldset v-if="fields.length > 0" :is="tag">
      <template v-for="field in fields">
        <field-wrapper :storeNamespace="field">
        </field-wrapper>
      </template>
    </fieldset>

    <template v-for="(group, id) in groups" v-if="isGroupVisible(id)">
      <!-- bind slot to group name -->
      <slot :name="id"
            :groupId="id"
            :groupFields="group.Fields"
            :groupLabel="groupsLabel[id]">
        <!-- default content if slot is not provided -->
        <fieldset :is="groupTag">
          <slot v-if="groupsLabel[id]" v-bind:legend="groupsLabel[id]">
            <legend>{{ groupsLabel[id] }}</legend>
          </slot>
          <template v-for="field in group">
            <field-wrapper :storeNamespace="field"></field-wrapper>
          </template>
        </fieldset>
      </slot>
    </template>

  </div>

</template>

<script>
  import FieldWrapper from './fields/fieldWrapper'
  import { findIndex, map, each } from 'lodash'
  import ScheamStore from './store/schema-store'
  // import StoreNamespaceMixIn from './mixin/store-namespace'
  import {
    namespaceToArray,
    getNamespacedDispatch,
    getNamespacedState
  } from './helper'

  export default {
    components: {
      FieldWrapper: FieldWrapper
    },
    name: 'vue-form-builder',
    props: {
      schemaNamespace: {
        type: String,
        required: true
      },
      modelNamespace: {
        type: String,
        required: true
      },
      schema: {
        type: Object,
        required: true,
        default: {}
      },
      // options: {
      //   type: Object,
      //   default () {
      //     return {
      //       validateAfterLoad: false,
      //       validateAfterChanged: false,
      //       validationErrorClass: 'error',
      //       validationSuccessClass: ''
      //     }
      //   }
      // },
      tag: {
        type: String,
        default: 'fieldset',
        validator: function (value) {
          return value.length > 0
        }
      },
      groupTag: {
        type: String,
        default: 'fieldset',
        validator: function (value) {
          return value.length > 0
        }
      },
      hideGroup: {
        type: Array,
        default: () => [],
        required: false
      }
    },
    created () {
      // install store
      this.$store.registerModule(namespaceToArray(this.schemaNamespace), ScheamStore)
      this.initSchema()
    },
    destroyed () {
      let dispatch = getNamespacedDispatch(this.schemaNamespace, this.$store)
      dispatch({
        type: 'dispose'
      })
      this.$store.unregisterModule(namespaceToArray(this.schemaNamespace))
    },
    methods: {
      initSchema: function () {
        let value = this.schema
        let schemaNamespace = this.schemaNamespace
        let modelNamespace = this.modelNamespace
        let dispatch = getNamespacedDispatch(schemaNamespace, this.$store)
        dispatch({
          type: 'init',
          value,
          schemaNamespace,
          modelNamespace
        })
      },
      isGroupVisible: function (id) {
        if (findIndex(this.hideGroup, id) === -1) {
          return true
        } else {
          return false
        }
      }
    },
    computed: {
      fields: function () {
        let state = getNamespacedState(this.schemaNamespace, this.$store)
        return map(state.fields, (f) => f.join('/'))
      },
      groups: function () {
        let retVal = {}
        let state = getNamespacedState(this.schemaNamespace, this.$store)
        each(state.groups, (group, gid) => {
          if (retVal[gid] === undefined) {
            retVal[gid] = map(group, (f) => f.join('/'))
          }
        })
        return retVal
      },
      groupsLabel: function () {
        let state = getNamespacedState(this.schemaNamespace, this.$store)
        return state.groupsLabel
      }
    }
  }
</script>

<style lang="scss">

</style>
