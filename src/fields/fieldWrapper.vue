<template v-if="storeNamespace">
  <div v-if="isRowVisible" :class="rowClasses">
    <div v-if="isVisible" :class="fieldClasses">
      <label v-if="isLabelApplicable == true" :for="$storeCtx.state.id">
        {{ $storeCtx.state.label }}
      </label>

      <!--tooltip for help -->
      <template v-if="$storeCtx.state.tooltip">
        <i class="icon" data-toggle="tooltip" :data-placement="$storeCtx.state.tooltipPlacement || 'auto'"
           :class="tooltipClasses" :title="$storeCtx.state.tooltip"></i>
      </template>

      <template v-if="$storeCtx.state.help">
        <slot name="help" :class="helpClasses" :help="$storeCtx.state.help">
          <span class="help" :class="helpClasses">
            <i class="icon"></i>
            <div class="helpText" v-html="$storeCtx.state.help"></div>
          </span>
        </slot>
      </template>

      <div class="field-wrap" :class="inputGroupClasses">
        <component :is="fieldType" :storeNamespace="storeNamespace"></component>

        <!-- button feature is not required -->
        <span v-if="isButtonsAvailable" class="input-group-btn" :class="buttonGroupClasses">
          <button v-for="(value, index) in $storeCtx.state.buttons" :key="index" @click="buttonClick(index)"
                  class="btn btn-block" :class="getButtonClasses(value.classes)" v-html="value.html">

          </button>
        </span>

      </div>

      <slot name="hint" :hint="fieldHint" v-if="$storeCtx.state.hint">
        <div class="hint">{{ fieldHint }}</div>
      </slot>

      <div class="errors help-block" v-if="fieldHasErrors == true">
        <span v-for="(error, index) in errors" :key="index">{{ error }}</span>
      </div>
    </div>
    <slot></slot>
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

  let specialFields = require.context('./special', false, /^\.\/field([\w-_]+)\.vue$/)
  each(specialFields.keys(), (key) => {
    let compName = key.replace(/^\.\//, '').replace(/\.vue/, '')
    fieldComponents[compName] = specialFields(key).default
  })

  export default {
    name: 'field-wrapper',
    components: fieldComponents,
    mixins: [StoreNamespaceMixin],
    inject: {},
    mounted () {
      /* eslint-disable no-undef */
      if (this.$storeCtx.state.tooltip && $ && $.fn.tooltip) {
        this.$nextTick(() => {
          // add feature to call bootstrap tooltip for field
          $(this.$el).find('[data-toggle="tooltip"]').tooltip()
        })
      }
      /* eslint-enable no-undef */
    },
    methods: {
      processStyle (styleAttr) {
        let retVal = {}
        if (isString(styleAttr)) {
          retVal[styleAttr] = true
        } else if (isArray(styleAttr)) {
          each(styleAttr, (c) => {
            if (isObject(c)) {
              extend(retVal, c)
            } else {
              retVal[c] = true
            }
          })
        } else if (isObject(styleAttr)) {
          retVal = {...retVal, ...styleAttr}
        }
        return retVal
      },
      buttonClick (index) {
        console.log('click', index)
        this.$storeCtx.dispatch({
          type: 'btnClick',
          index: index
        })
      },
      getButtonClasses (classes) {
        return this.processStyle(classes)
      }
    },
    computed: {
      isButtonsAvailable () {
        return this.$storeCtx.state.buttons && this.$storeCtx.state.buttons.length > 0
      },
      isRowVisible () {
        if (this.$storeCtx.state.hideRow === true) {
          return this.isVisible
        } else {
          return true
        }
      },
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
      helpClasses () {
        let state = this.$storeCtx.state
        return this.processStyle(state.helpClasses)
      },
      tooltipClasses () {
        let state = this.$storeCtx.state
        return this.processStyle(state.tooltipClasses)
      },
      inputGroupClasses () {
        let state = this.$storeCtx.state
        return this.processStyle(state.inputGroupClasses)
      },
      buttonGroupClasses () {
        let state = this.$storeCtx.state
        return this.processStyle(state.buttonGroupClasses)
      },
      fieldClasses () {
        let state = this.$storeCtx.state
        const hasErrors = this.fieldHasErrors
        let baseClasses = {
          field: true,
          error: hasErrors,
          disabled: state.disabled,
          readonly: state.readonly
          // required: state.required
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
        extend(baseClasses, this.processStyle(state.fieldClasses))

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
