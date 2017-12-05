<template>

  <div class="vue-form-generator" v-if="schema != null">
    <fieldset v-if="listFileds.length > 0" :is="tag">
      <field-input storeNamespace="formSchema/id1"></field-input>
    </fieldset>
  </div>

</template>

<script>
  import { each } from 'lodash'
  // import ScheamStore from './store/schema-store'
  import StoreNamespaceMixIn from './mixin/store-namespace'
  import { getNamespacedDispatch } from './helper' /* namespaceToArray, */
  import FieldInput from './fields/core/fieldInput'

  let fieldComponents = {}

  let coreFields = require.context('./fields/core', false, /^\.\/field([\w-_]+)\.vue$/)

  each(coreFields.keys(), (key) => {
    let compName = key.replace(/^\.\//, '').replace(/\.vue/, '')
    fieldComponents[compName] = coreFields(key)
  })
  console.log(fieldComponents)


  export default {
    components: {FieldInput},
    name: 'VueFormBuilder',
    mixins: [StoreNamespaceMixIn],
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
      // install store1
      // this.$store.registerModule(namespaceToArray(this.schemaNamespace), ScheamStore)
      this.initSchema()
    },
    destroyed () {
      // let store = this.$store
      // let context = this.$storeCtx
      // each(context.state.fields, (fStore) => {
      //   store.unregisterModule(fStore)
      // })
      //
      // each(context.state.groups, (gVal) => {
      //   each(gVal, (gfStore) => {
      //     store.unregisterModule(gfStore)
      //   })
      // })
      //
      // this.$store.unregisterModule(namespaceToArray(this.schemaNamespace))
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
      }
    },
    computed: {
      listFileds: function () {
        let context = this.$storeCtx
        return context.state.fields
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
