<template>
  <input :value="value"
         @input="value = $event.target.value"
         :disabled="isDisabled"
  />
</template>

<script>
  import StoreMixin from '@/mixin/store-namespace'
  import AbstractFieldMixin from '@/mixin/abstract-field'
  export default {
    name: 'field-input',
    mixins: [StoreMixin, AbstractFieldMixin]
  }
</script>

<style scoped>

</style>
