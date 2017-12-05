<template>
  <div class="wrapper">
    <input id="$storeCtx.state.id"
           type="file"
           :name="$storeCtx.state.inputName"
           :accept="$storeCtx.state.accept"
           :multiple="$storeCtx.state.multiple"
           :placeholder="$storeCtx.state.placeholder"
           :readonly="$storeCtx.state.readonly"
           :required="$storeCtx.state.required"
           :disabled="disabled"
           class="form-control"/>
  </div>
</template>

<script>

  export default {
    name: 'field-file-upload'
  }

</script>

<style scoped>

</style>
