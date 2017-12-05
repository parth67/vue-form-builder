<template>
  <input type="checkbox"
         v-model="value"
         :autocomplete="$storeCtx.state.autocomplete"
         :disabled="disabled"
         :name="$storeCtx.state.inputName"
         :class="$storeCtx.state.fieldClasses"/>
</template>

<script>
  import AbstractFieldMixin from '@/mixin/abstract-field'

  export default {
    name: 'field-checkbox',
    mixins: [AbstractFieldMixin]
  }
</script>

<style scoped>

</style>
