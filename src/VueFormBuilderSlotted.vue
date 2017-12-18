<template>
  <div>
    <slot :getFieldSchema="getFieldSchema" :getGroupFieldSchema="getGroupFieldSchema">

    </slot>
  </div>
</template>

<script>
  import FieldWrapper from './fields/fieldWrapper'
  import ScheamStore from './store/schema-store'
  import { each } from 'lodash'
  // import StoreNamespaceMixIn from './mixin/store-namespace'
  import {
    namespaceToArray,
    getNamespacedDispatch,
    getModuleByNamespace
  } from './helper'

  export default {
    components: {
      FieldWrapper: FieldWrapper
    },
    name: 'vue-form-builder-slotted',
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
    computed: {
      fieldIdsVsNamespace () {
        let retVal = {}
        let module = getModuleByNamespace(this.$store, this.schemaNamespace)
        let fields = module.state.fields
        each(fields, (f) => {
          retVal[f[f.length - 1]] = f.join('/')
        })
        return retVal
      },
      groupFieldIdsVsNamespace () {
        let retVal = {}
        let module = getModuleByNamespace(this.$store, this.schemaNamespace)
        let groups = module.state.groups
        each(groups, (group, gid) => {
          each(group, (f) => {
            retVal[f[f.length - 1]] = f.join('/')
          })
        })
        return retVal
      }
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
      getFieldSchema: function (id) {
        return this.fieldIdsVsNamespace[id]
      },
      getGroupFieldSchema: function (gid, id) {
        return this.groupFieldIdsVsNamespace[gid + '/' + id]
      }
    }
  }
</script>

<style lang="scss">

</style>
