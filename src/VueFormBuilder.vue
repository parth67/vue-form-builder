<template>

  <div class="vue-form-generator" v-if="schema != null">
    <fieldset v-if="fields.length > 0" :is="tag">
      <template v-for="field in fields">
        <field-wrapper :storeNamespace="field.join('/')"></field-wrapper>
      </template>
    </fieldset>

    <template v-for="(group, id) in groups">
      <fieldset :is="groupTag">
        <slot v-if="groupsLabel[id]" v-bind:legend="groupsLabel[id]">
          <legend>{{ groupsLabel[id] }}</legend>
        </slot>
        <template v-for="field in group">
          <field-wrapper :storeNamespace="field.join('/')"></field-wrapper>
        </template>
      </fieldset>
    </template>

  </div>

</template>

<script>
  import FieldWrapper from './fields/fieldWrapper'
  // import { each } from 'lodash'
  import ScheamStore from './store/schema-store'
  // import StoreNamespaceMixIn from './mixin/store-namespace'
  import {
    namespaceToArray,
    getNamespacedDispatch,
    getNamespacedState,
    arrayToNamespace
  } from './helper'

  export default {
    components: {
      FieldWrapper: FieldWrapper
    },
    name: 'VueFormBuilder',
    inject: {
      schemaNamespace: 'schemaNamespace',
      modelNamespace: 'modelNamespace',
      schema: 'schema',
      storeNamespace: 'schemaNamespace'
    },
    props: {
      /* schema: {
        type: Object,
        required: true,
        default: {
          modelNamespace: 'a/b',
          fields: [],
          groups: [{
            legend: 'Group 1',
            fields: [{
              id: 'id1',
              model: 'a.b',
              type: 'input',
              visible: true,
              disabled: false,
              styleClass: 'col-md-6',
              default: 'val', // if attribute is added.
              validator: function () {},
              set: function (commiter, value) {},
              get: function (getter) {},
              onChange: function () {},
              onValidate: function () {},
              depends: ['id2'],
              watcher: function (def, oldVal, newVal) {}
            }]
          }]
        }
      },
      schemaNamespace: {
        type: String,
        default: 'formSchema',
        required: true
      },
      modelNamespace: {
        type: String,
        default: 'model',
        required: true
      }, storeNamespace: {
        type: String,
        required: true,
        default: {}
      }, */
      options: {
        type: Object,
        default () {
          return {
            validateAfterLoad: false,
            validateAfterChanged: false,
            validationErrorClass: 'error',
            validationSuccessClass: ''
          }
        }
      },
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
      currentGroup: {
        type: String,
        default: null,
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
      getFieldType: function (field) {
        let namespace = arrayToNamespace(field)
        let state = getNamespacedState(namespace, this.$store)
        return 'field-' + state.type
      }
    },
    computed: {
      fields: function () {
        let state = getNamespacedState(this.schemaNamespace, this.$store)
        return state.fields
      },
      groups: function () {
        let state = getNamespacedState(this.schemaNamespace, this.$store)
        return state.groups
      },
      groupsLabel: function () {
        let state = getNamespacedState(this.schemaNamespace, this.$store)
        return state.groupsLabel
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
