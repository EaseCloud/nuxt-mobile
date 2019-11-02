export class NotifyData {
  constructor ({ message = '', delay = 3000, closable = false }) {
    this.message = message
    this.delay = delay
    this.closable = closable
  }
}
