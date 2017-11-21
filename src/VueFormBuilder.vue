<template>

  <div class="vue-form-generator" v-if="schema != null">
    <fieldset v-if="schema.fields" :is="tag">
      <template v-for="field in fields">
        <div class="form-group" v-if="fieldVisible(field)" :class="getFieldRowClasses(field)">
          <label v-if="fieldTypeHasLabel(field)" :for="getFieldID(field)">{{ field.label }}
            <span class="help" v-if="field.help">
              <i class="icon"></i>
              <div class="helpText" v-html="field.help"></div>
            </span>
          </label>
          <div class="field-wrap">
            <component :is="getFieldType(field)" :disabled="fieldDisabled(field)" :model="model" :schema="field"
                       :formOptions="options" @model-updated="modelUpdated" @validated="onFieldValidated"></component>
            <div class="buttons" v-if="buttonVisibility(field)">
              <button v-for="btn in field.buttons" @click="buttonClickHandler(btn, field, $event)" :class="btn.classes">
                {{ btn.label }}
              </button>
            </div>
          </div>
          <div class="hint" v-if="field.hint">{{ fieldHint(field) }}</div>
          <div class="errors help-block" v-if="fieldErrors(field).length &gt; 0"><span
            v-for="(error, index) in fieldErrors(field)" track-by="index">{{ error }}</span></div>
        </div>
      </template>
    </fieldset>
    <template v-for="group in groups">
      <fieldset :is="groupTag">
        <slot v-if="group.legend" v-bind:legend="group.legend">
          <legend>{{ group.legend }}</legend>
        </slot>
        <template v-for="field in group.fields">
          <div class="form-group" v-if="fieldVisible(field)" :class="getFieldRowClasses(field)">
            <label v-if="fieldTypeHasLabel(field)" :for="getFieldID(field)">{{ field.label }}<span class="help"
                                                                                                   v-if="field.help"><i
              class="icon"></i>
              <div class="helpText" v-html="field.help"></div></span></label>
            <div class="field-wrap">
              <component :is="getFieldType(field)" :disabled="fieldDisabled(field)" :model="model" :schema="field"
                         :formOptions="options" @model-updated="modelUpdated" @validated="onFieldValidated"></component>
              <div class="buttons" v-if="buttonVisibility(field)">
                <button v-for="btn in field.buttons" @click="buttonClickHandler(btn, field, $event)"
                        :class="btn.classes">{{ btn.label }}
                </button>
              </div>
            </div>
            <div class="hint" v-if="field.hint">{{ field.hint }}</div>
            <div class="errors help-block" v-if="fieldErrors(field).length &gt; 0"><span
              v-for="(error, index) in fieldErrors(field)" track-by="index">{{ error }}</span></div>
          </div>
        </template>
      </fieldset>
    </template>
  </div>

</template>

<script>
  import ScheamStore from './store'
  import StoreNamespaceMixIn from './mixin/store-namespace'
  import { namespaceToArray } from './helper'

  export default {
    name: 'VueFormBuilder',
    mixins: [StoreNamespaceMixIn],
    props: {
      schema: {
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
      },
      /* storeNamespace: {
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
      this.$store.registerModule(namespaceToArray(this.schemaNamespace), ScheamStore)
    }
  }
</script>

<style scoped lang="scss">

</style>
