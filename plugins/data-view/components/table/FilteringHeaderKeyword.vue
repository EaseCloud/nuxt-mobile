<script>
  export default {
    name: 'FilteringHeaderKeyword',
    props: {
      field: { type: Object },
      options: { type: Object }
    },
    render (h) {
      const vm = this
      const key = vm.options.key
      const value = vm.field.$view.query[key] || ''

      if (value) {
        return h('tag', {
          style: { marginLeft: '8px' },
          props: {
            closable: true,
            color: '#CCCCCC',
            fade: false
          },
          on: {
            'on-close': vm.reset
          }
        }, value)
      } else {
        return h('a', {
          style: { marginLeft: '8px' },
          class: { collapsible: true },
          on: {
            async click () {
              await vm.query(value)
            }
          }
        }, [
          h('x-icon', {
            props: { name: 'fa fa-filter' }
          })
        ])
      }
    },
    methods: {
      async query (value) {
        const vm = this
        const key = vm.options.key
        const text = await vm.$prompt('请输入关键词', {
          title: '根据关键词过滤',
          defaultValue: value
        }).catch(() => 0)
        // ListViewTable 执行查询
        if (text) vm.field.$view.doQuery({ [key]: text })
      },
      async reset () {
        const vm = this
        const key = vm.options.key
        // ListViewTable 执行查询
        vm.field.$view.doQuery({ [key]: null })
      }
    }
  }
</script>
