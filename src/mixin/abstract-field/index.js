import StoreNamespace from '../store-namespace'
import { isArray, each, isString, isObject, extend } from 'lodash'

export default {
  mixins: [StoreNamespace],
  mounted () {
    // this.$nextTick(function () {
    //   this.$storeCtx.dispatch({
    //     type: 'notify'
    //   })
    // })
  },
  methods: {
    processStyle (styleAttr) {
      let retVal = {}
      if (isString(styleAttr)) {
        retVal[styleAttr] = true
      } else if (isArray(styleAttr)) {
        each(styleAttr, (c) => {
          if (isObject(c)) {
            extend(retVal, c)
          } else {
            retVal[c] = true
          }
        })
      } else if (isObject(styleAttr)) {
        retVal = {...retVal, ...styleAttr}
      }
      return retVal
    }
  },
  computed: {
    fieldOptions () {
      return this.$storeCtx.state.fieldOptions || {}
    },
    inputClasses () {
      let state = this.$storeCtx.state
      return this.processStyle(state.inputClasses)
    },
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
