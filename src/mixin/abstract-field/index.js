import StoreNamespace from '@/mixin/store-namespace'

export default {
  mixins: [StoreNamespace],
  methods: {},
  computed: {
    isDisabled () {
      let context = this.$storeCtx
      return context.state.disabled
    },
    value: {
      get: function () {
        let context = this.$storeCtx
        return context.getters('value')
      },
      set: function (setValue) {
        let context = this.$storeCtx
        context.dispatch({
          type: 'setValue',
          value: setValue
        })
      }
    }
  }
}
