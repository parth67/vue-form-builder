import { getNamespacedContext } from '../../helper'

export default {
  props: {
    storeNamespace: {
      type: String,
      required: true
    }
  },
  beforeMount: injectStoreCtx
}

function injectStoreCtx () {
  const namespace = this.storeNamespace
  // store injection
  if (namespace && this.$store) {
    this.$storeCtx = getNamespacedContext(namespace, this.$store)
  }
}
