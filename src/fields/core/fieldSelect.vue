<template>
  <select v-model="value" :disabled="disabled" :name="$storeCtx.state.inputName" :id="$storeCtx.state.id"
          :class="$storeCtx.state.fieldClasses" class="form-control">
    <option v-if="!fieldOptions.hideNoneSelectedText" :disabled="$storeCtx.state.required"
            :value="fieldOptions.noneValue || null"
            :selected="value == undefined">{{ fieldOptions.noneSelectedText || '' }}
    </option>
    <template v-for="item in items">
      <optgroup v-if="item.group" :label="getGroupName(item)">
        <option v-if="item.ops" v-for="i in item.ops" :value="getItemValue(i)" :key="getItemValue(i)">{{ getItemName(i)
          }}
        </option>
      </optgroup>
      <option v-if="!item.group" :value="getItemValue(item)">{{ getItemName(item) }}</option>
    </template>
  </select>
</template>

<script>
  import AbstractFieldMixin from '../../mixin/abstract-field'
  import AsyncComputed from '../../mixin/async-computed'
  import { isFunction, isObject, find } from 'lodash'

  export default {
    name: 'field-select',
    mixins: [AbstractFieldMixin, AsyncComputed],
    computed: {
    },
    asyncComputed: {
      items: {
        get: function () {
          let values = this.$storeCtx.state.items
          let callVal
          if (isFunction(values)) {
            callVal = values()
            if (!callVal || !callVal.then) {
              callVal = Promise.resolve(callVal)
            }
          } else {
            callVal = Promise.resolve(values)
          }
          callVal.then((val) => {
          })
          return new Promise(resolve => {
            callVal.then(rVals => {
              resolve(this.groupValues(rVals))
            })
          })

        },
        default: []
      }
    },
    methods: {

      groupValues (values = []) {
        let array = []

        let valueProp = this.fieldOptions.value || 'value'
        let labelProp = this.fieldOptions.label || 'label'
        let groupProp = this.fieldOptions.group || 'group'

        values.forEach((item) => {

          let arrayElement = null

          if (isObject(item) && item[groupProp]) {
            // There is in a group.

            // Find element with this group.
            arrayElement = find(array, i => i.group === item.group)

            if (arrayElement) {
              // There is such a group.

              arrayElement.ops.push({
                value: item[valueProp],
                label: item[labelProp]
              })
            } else {
              // There is not such a group.

              // Initialising.
              arrayElement = {
                group: '',
                ops: []
              }

              // Set group.
              arrayElement.group = item.group

              // Set Group element.
              arrayElement.ops.push({
                value: item[valueProp],
                label: item[labelProp]
              })

              // Add array.
              array.push(arrayElement)
            }
          } else if (isObject(item)) {
            array.push({
              value: item[valueProp],
              label: item[labelProp]
            })
          } else {
            // There is not in a group.
            array.push(item)
          }
        })

        // With Groups.
        return array
      },
      getGroupName (item) {
        if (item && item.group) {
          return item.group
        }
        return 'Missing group'
      },
      getItemValue (item) {
        if (isObject(item)) {
          return item.value
        } else {
          return item
        }
      },

      getItemName (item) {
        if (isObject(item)) {
          return item.label
        } else {
          return item
        }
      }
    }
  }
</script>

<style>

</style>
