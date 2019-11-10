export class NotifyData {
  constructor ({ message = '', delay = 3000, closable = false }) {
    this.message = message
    this.delay = delay
    this.closable = closable
  }
}

export class DialogOptions {
  constructor ({
                 title = '', render,
                 okText = '确认', onOk,
                 cancelText = '取消', onCancel
               }) {
    const dialog = this
    dialog.title = title
    dialog.okText = okText
    dialog.cancelText = cancelText
    dialog.render = render
    // 按确认键：缺省直接关闭对话框
    dialog.onOk = onOk || function () {
      const vm = this
      vm.$store.dispatch('notifier/closeDialog', dialog)
    }
    // 按取消键：缺省直接关闭对话框
    dialog.onCancel = onCancel || function () {
      const vm = this
      vm.$store.dispatch('notifier/closeDialog', dialog)
    }
  }
}
