<template>
  <div class="radio-list wrapper">
    <div :class="$storeCtx.state.fieldClasses" v-for="(item, index) in items" :key="index">
      <input type="radio" :id="uid + '-' + index" :value="getValue(item)" :disabled="isDisabled(item)" v-model="value">
      <label :for="uid + '-' + index">
        {{getLabel(item)}}
      </label>
    </div>
  </div>
</template>

<script>
  import AbstractFieldMixin from '../../mixin/abstract-field'
  import AsyncComputed from '../../mixin/async-computed'
  import { isObject, isFunction, uniqueId } from 'lodash'

  export default {
    name: 'field-radio',
    mixins: [AbstractFieldMixin, AsyncComputed],

    computed: {
      uid () {
        return uniqueId('radio-list')
      }
    },
    asyncComputed: {
      items () {
        let values = this.$storeCtx.state.items
        if (isFunction(values)) {
          return values(this.$storeCtx)
        } else {
          return values
        }
      }
    },
    methods: {
      getValue: function (item) {
        if (isObject(item)) {
          return this.fieldOptions.value ? item[this.fieldOptions.value] : item.value
        } else {
          return item
        }
      },
      getLabel: function (item) {
        if (isObject(item)) {
          return this.fieldOptions.label ? item[this.fieldOptions.label] : item.label
        } else {
          return item
        }
      },
      isDisabled: function (item) {
        if (isObject(item) && item.disable === true) {
          return true
        }
        return false
      }
    }
  }
</script>

<style>

</style>
