class Field {
  constructor (options) {
    // Basic fields
    this.id = options.id
    this.key = options.key
    this.label = options.label || ''
    this.type = options.type || 'input'
    this.default = options.default || this.getDefaultValue()
    this.required = !!options.required
    this.value = this.getDefaultValue()
    // Extra fields
    this.filter = options.filter || (value => value)
    this.mapper = options.mapper || {}
  }

  getDefaultValue () {
    if (this.type === 'text') return ''
  }
}

