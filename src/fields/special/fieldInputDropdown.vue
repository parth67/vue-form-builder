<template>
  <div class="input-select-wrapper">
    <input ref="input" class="form-control" autocomplete="off" role="textbox" aria-label="Search" type="text">
    <ul class="dropdown-menu" v-show="$storeCtx.state.dropdown">
      <li v-for="(item, index) in items" :key="index">
        <a href="javascript:void(0);" @click="handleSelect(getValue(item), $event)">{{getLabel(item)}}</a>
      </li>
    </ul>
  </div>
</template>

<script>
  import AbstractField from '../../mixin/abstract-field'
  import AsyncComputed from '../../mixin/async-computed'
  import { isObject, isFunction } from 'lodash'

  export default {
    name: 'field-input-dropdown',
    mixins: [AbstractField, AsyncComputed],
    mounted () {
      this.$storeCtx.commit({
        type: 'setAttr',
        key: 'dropdown',
        value: false
      })
    },
    asyncComputed: {
      items () {
        let values = this.$storeCtx.state.items
        let callVal
        if (isFunction(values)) {
          callVal = values(this.$storeCtx)
          if (!callVal || !callVal.then) {
            callVal = Promise.resolve(callVal)
          }
        } else {
          callVal = Promise.resolve(values)
        }
        return callVal
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
      },
      handleSelect (value, $event) {
        this.$refs.input.value = value
        this.$storeCtx.commit({
          type: 'setAttr',
          key: 'dropdown',
          value: false
        })
      }
    }
  }
</script>

<style scoped>
  .dropdown-menu {
    min-width: 100%;
    display: block;
    max-height: 75px;
    overflow-y: auto;
  }

  .input-select-wrapper {
    position: relative;
  }
</style>
