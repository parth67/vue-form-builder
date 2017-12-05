import { getNamespacedState, getNamespacedDispatch, getNamespacedCommit, getNamespacedGetter } from '@/helper'

export default {
  props: {
    storeNamespace: {
      type: String,
      required: false
    }
  },
  beforeMount: injectStoreCtx
}

function injectStoreCtx () {
  const namespace = this.storeNamespace
  // store injection
  if (namespace && this.$store) {
    this.$storeCtx = {
      state: getNamespacedState(namespace, this.$store),
      dispatch: getNamespacedDispatch(namespace, this.$store),
      commit: getNamespacedCommit(namespace, this.$store),
      getters: getNamespacedGetter(namespace, this.$store)
    }
  }
}
