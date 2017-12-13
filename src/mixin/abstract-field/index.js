import StoreNamespace from '../store-namespace'

export default {
  mixins: [StoreNamespace],
  mounted () {
    this.$nextTick(function () {
      this.$storeCtx.dispatch({
        type: 'notify'
      })
    })
  },
  methods: {},
  computed: {
    disabled () {
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
