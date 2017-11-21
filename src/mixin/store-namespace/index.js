import { createNamespacedHelpers } from 'vuex'

export default {
  props: {
    storeNamespace: {
      required: true,
      default: null,
      type: String
    }
  },
  created: injectStoreCtx
}

function injectStoreCtx () {
  const options = this.storeNamespace
  // store injection
  if (options.storeNamespace && this.$store) {
    let namespaced = createNamespacedHelpers(options.storeNamespace)
    this.$storeCtx = {
      mapState: namespaced.mapState,
      mapGetters: namespaced.mapGetters,
      mapMutations: namespaced.mapMutations,
      mapActions: namespaced.mapActions
    }
  } else if (options.parent && options.parent.$storeCtx) {
    this.$storeCtx = options.parent.$storeCtx
  }
}

function getNamespacedCaller (namespace, store, arrowFunc = ((state) => state)) {
  let mapState = createNamespacedHelpers(namespace).mapState({
    value: arrowFunc
  })
  return mapState.value.bind({$store: store})
}
