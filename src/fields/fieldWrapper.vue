<template>
  <div :class="rowClasses">
    <div v-if="isVisible" :class="styleClasses">
      <label v-if="isLabelApplicable == true" :for="$storeCtx.state.id">
        {{ $storeCtx.state.label }}
        <span class="help" v-if="$storeCtx.state.help">
        <i class="icon"></i>
        <div class="helpText" v-html="$storeCtx.state.help"></div>
      </span>
      </label>
      <div class="field-wrap">
        <component :is="fieldType" :storeNamespace="storeNamespace"></component>
        <!-- button feature is not required -->
        <!--div class="buttons" v-if="buttonVisibility(field)">
          <button v-for="btn in field.buttons" @click="buttonClickHandler(btn, field, $event)" :class="btn.classes">
            {{ btn.label }}
          </button>
        </div-->
      </div>
      <div class="hint" v-if="$storeCtx.state.hint">{{ fieldHint }}</div>
      <div class="errors help-block" v-if="fieldHasErrors == true">
        <span v-for="(error, index) in errors" :key="index">{{ error }}</span>
      </div>
    </div>
  </div>
  <!--div class="field-wrap">
    <component :is="getFieldType(field)" v-bind:storeNamespace="field.join('/')"></component>
  </div-->
</template>

<script>
  import StoreNamespaceMixin from '../mixin/store-namespace'
  import { isArray, each, isFunction, isString, isObject, extend } from 'lodash'

  // start collecting all fields component
  let fieldComponents = {}

  let coreFields = require.context('./core', false, /^\.\/field([\w-_]+)\.vue$/)
  each(coreFields.keys(), (key) => {
    let compName = key.replace(/^\.\//, '').replace(/\.vue/, '')
    fieldComponents[compName] = coreFields(key).default
  })
  // all components are collected in fieldComponents

  export default {
    name: 'field-wrapper',
    components: fieldComponents,
    mixins: [StoreNamespaceMixin],
    inject: {},
    methods: {
      processStyle (styleAttr) {
        let retVal = {}
        if (isString(styleAttr)) {
          retVal[styleAttr] = true
        } else if (isArray(styleAttr)) {
          each(styleAttr, (c) => {
            retVal[c] = true
          })
        } else if (isObject(styleAttr)) {
          retVal = {...retVal, ...styleAttr}
        }
        return retVal
      }
    },
    computed: {
      isVisible () {
        return this.$storeCtx.state.visible
      },
      errors () {
        return this.$storeCtx.state.errors
      },
      fieldHasErrors () {
        return this.$storeCtx.getters('hasErrors')
      },
      rowClasses () {
        let state = this.$storeCtx.state
        return this.processStyle(state.rowClasses)
      },
      styleClasses () {
        let state = this.$storeCtx.state
        const hasErrors = this.fieldHasErrors
        let baseClasses = {
          field: true,
          error: hasErrors,
          disabled: state.disabled,
          readonly: state.readonly,
          required: state.required
        }

        // let {validationErrorClass, validationSuccessClass} = this.options
        // if (validationErrorClass && validationSuccessClass) {
        if (hasErrors) {
          // baseClasses[validationErrorClass] = true
          baseClasses['has-error'] = true
        } else {
          baseClasses['has-error'] = false
          // baseClasses[validationSuccessClass] = true
        }
        // }

        baseClasses['form-group'] = true
        extend(baseClasses, this.processStyle(state.styleClasses))

        baseClasses['field-' + state.type] = true
        return baseClasses
      },
      isLabelApplicable () {

        if (this.$storeCtx.state.label === null || this.$storeCtx.state.label === '') {
          return false
        }

        let relevantType = ''
        let field = this.$storeCtx.state
        if (field.type === 'input') {
          relevantType = field.inputType
        } else {
          relevantType = field.type
        }

        switch (relevantType) {
          case 'button':
          case 'submit':
          case 'reset':
            return false
          default:
            return true
        }
      },
      fieldType () {
        return 'field-' + this.$storeCtx.state.type
      },
      fieldHint () {
        let field = this.$storeCtx.state
        if (isFunction(field.hint)) {
          return field.hint.call(this, this.$storeCtx)
        }
        return field.hint
      }
    }
  }
</script>

<style>

</style>
