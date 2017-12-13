<template>
  <input class="form-control"
         :value="value"
         @input="value = $event.target.value"
         :disabled="disabled"
         :id="$storeCtx.state.id"
         :type="$storeCtx.state.inputType"
         :class="$storeCtx.state.fieldClasses"
         :accept="$storeCtx.state.accept"
         :alt="$storeCtx.state.alt"
         :autocomplete="$storeCtx.state.autocomplete"
         :checked="$storeCtx.state.checked"
         :dirname="$storeCtx.state.dirname"
         :formaction="$storeCtx.state.formaction"
         :formenctype="$storeCtx.state.formenctype"
         :formmethod="$storeCtx.state.formmethod"
         :formnovalidate="$storeCtx.state.formnovalidate"
         :formtarget="$storeCtx.state.formtarget"
         :height="$storeCtx.state.height"
         :list="$storeCtx.state.list"
         :max="$storeCtx.state.max"
         :maxlength="$storeCtx.state.maxlength"
         :min="$storeCtx.state.min"
         :minlength="$storeCtx.state.minlength"
         :multiple="$storeCtx.state.multiple"
         :name="$storeCtx.state.inputName"
         :pattern="$storeCtx.state.pattern"
         :placeholder="$storeCtx.state.placeholder"
         :readonly="$storeCtx.state.readonly"
         :required="$storeCtx.state.required"
         :size="$storeCtx.state.size"
         :src="$storeCtx.state.src"
         :step="$storeCtx.state.step"
         :width="$storeCtx.state.width"
  />
</template>

<script>
  import AbstractFieldMixin from '../../mixin/abstract-field'

  export default {
    name: 'field-input',
    mixins: [AbstractFieldMixin]
  }
</script>

<style>

</style>
