<template>
  <div class="wrapper">
    <div class="checkbox" v-if="value instanceof Array" v-for="(item, index) in $storeCtx.state.items" :key="index">
      <label>
        <input type="checkbox" :value="getValue(item)" v-model="value">
        {{getLabel(item)}}
      </label>
    </div>
  </div>
</template>

<script>
  import AbstractFieldMixin from '@/mixin/abstract-field'
  import { isObject, isString, isArray } from 'lodash'

  export default {
    name: 'field-check-list',
    mixins: [AbstractFieldMixin],
    mounted () {
      this.ensureValAsArray()
    },
    methods: {
      getValue: function (item) {
        if (isObject(item)) {
          return item.value
        } else if (isString(item)) {
          return item
        }
      },
      getLabel: function (item) {
        if (isObject(item)) {
          return item.label
        } else if (isString(item)) {
          return item
        }
      },
      ensureValAsArray () {
        if (!isArray(this.value)) {
          this.value = []
        }
        return true
      }
    }
  }
</script>

<style scoped>

</style>
