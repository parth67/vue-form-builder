import { defaults, isNil, isNumber, isString, isArray, isFunction } from 'lodash'

let resources = {
  fieldIsRequired: 'This field is required!',
  invalidFormat: 'Invalid format!',

  numberTooSmall: 'The number is too small! Minimum: {0}',
  numberTooBig: 'The number is too big! Maximum: {0}',
  invalidNumber: 'Invalid number',

  textTooSmall: 'The length of text is too small! Current: {0}, Minimum: {1}',
  textTooBig: 'The length of text is too big! Current: {0}, Maximum: {1}',
  thisNotText: 'This is not a text!',

  thisNotArray: 'This is not an array!',

  selectMinItems: 'Select minimum {0} items!',
  selectMaxItems: 'Select maximum {0} items!',

  invalidDate: 'Invalid date!',
  dateIsEarly: 'The date is too early! Current: {0}, Minimum: {1}',
  dateIsLate: 'The date is too late! Current: {0}, Maximum: {1}',

  invalidEmail: 'Invalid e-mail address!',
  invalidURL: 'Invalid URL!',

  invalidCard: 'Invalid card format!',
  invalidCardNumber: 'Invalid card number!',

  invalidTextContainNumber: 'Invalid text! Cannot contains numbers or special characters',
  invalidTextContainSpec: 'Invalid text! Cannot contains special characters'
}

function isEmpty (value) {
  if (isNil(value) || value === '') {
    return true
  }
  return false
}

function msg (text) {
  if (text != null && arguments.length > 1) {
    for (let i = 1; i < arguments.length; i++) {
      text = text.replace('{' + (i - 1) + '}', arguments[i])
    }
  }

  return text
}

let validators = {

  resources,

  required (modelCtx, schemaCtx, fieldCtx, value, messages = resources) {
    if (isEmpty(value)) {
      return [msg(messages.fieldIsRequired)]
    }
  },

  number (modelCtx, schemaCtx, fieldCtx, value, messages = resources) {
    let field = fieldCtx.state

    let err = []
    if (!isEmpty(value) && isNumber(value)) {
      if (!isNil(field.min) && value < field.min) { err.push(msg(messages.numberTooSmall, field.min)) }

      if (!isNil(field.max) && value > field.max) { err.push(msg(messages.numberTooBig, field.max)) }

    } else { err.push(msg(messages.invalidNumber)) }

    return err
  },

  integer (modelCtx, schemaCtx, fieldCtx, value, messages = resources) {
    if (!isEmpty(value) && !(Number(value) === value && value % 1 === 0)) { return [msg(messages.invalidNumber)] }
  },

  double (modelCtx, schemaCtx, fieldCtx, value, messages = resources) {
    if (!isEmpty(value) && (!isNumber(value) || isNaN(value))) { return [msg(messages.invalidNumber)] }
  },

  string (modelCtx, schemaCtx, fieldCtx, value, messages = resources) {
    let err = []
    let field = fieldCtx.state

    if (isString(value)) {
      if (!isNil(field.min) && value.length < field.min) { err.push(msg(messages.textTooSmall, value.length, field.min)) }

      if (!isNil(field.max) && value.length > field.max) { err.push(msg(messages.textTooBig, value.length, field.max)) }

    } else { err.push(msg(messages.thisNotText)) }

    return err
  },

  array (modelCtx, schemaCtx, fieldCtx, value, messages = resources) {
    let field = fieldCtx.state
    if (field.required) {

      if (!isArray(value)) { return [msg(messages.thisNotArray)] }

      if (value.length === 0) { return [msg(messages.fieldIsRequired)] }
    }

    if (!isNil(value)) {
      if (!isNil(field.min)) {
        if (value.length < field.min) { return [msg(messages.selectMinItems, field.min)] }
      }

      if (!isNil(field.max)) {
        if (value.length > field.max) { return [msg(messages.selectMaxItems, field.max)] }
      }
    }
  },

  regexp (modelCtx, schemaCtx, fieldCtx, value, messages = resources) {
    let field = fieldCtx.state

    if (!isEmpty(value) && !isNil(field.pattern)) {
      let re = new RegExp(field.pattern)
      if (!re.test(value)) { return [msg(messages.invalidFormat)] }
    }
  },

  regexpInvert (modelCtx, schemaCtx, fieldCtx, value, messages = resources) {
    let field = fieldCtx.state

    if (!isEmpty(value) && !isNil(field.pattern)) {
      let re = new RegExp(field.pattern)
      if (re.test(value)) { return [msg(messages.invalidFormat)] }
    }
  },

  email (modelCtx, schemaCtx, fieldCtx, value, messages = resources) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ // eslint-disable-line no-useless-escape
    if (!isEmpty(value) && !re.test(value)) { return [msg(messages.invalidEmail)] }
  },

  url (modelCtx, schemaCtx, fieldCtx, value, messages = resources) {
    let re = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g // eslint-disable-line no-useless-escape
    if (!isEmpty(value) && !re.test(value)) { return [msg(messages.invalidURL)] }
  },

  alpha (modelCtx, schemaCtx, fieldCtx, value, messages = resources) {
    let re = /^[a-zA-Z]*$/
    if (!isEmpty(value) && !re.test(value)) {
      return [msg(messages.invalidTextContainNumber)]
    }
  },

  alphaNumeric (modelCtx, schemaCtx, fieldCtx, value, messages = resources) {
    let re = /^[a-zA-Z0-9]*$/
    if (!isEmpty(value) && !re.test(value)) { return [msg(messages.invalidTextContainSpec)] }
  }
}

Object.keys(validators).forEach(name => {
  const fn = validators[name]
  if (isFunction(fn)) {
    fn.locale = customMessages => (modelCtx, schemaCtx, fieldCtx, value) => fn(modelCtx, schemaCtx, fieldCtx, value, defaults(customMessages, resources))
  }
})

export default validators
