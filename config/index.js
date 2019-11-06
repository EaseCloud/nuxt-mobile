import default_config from './default'
import default_hooks from './hooks'
import custom_config from '~/config'

export default {
  ...default_config,
  ...custom_config,
  hooks: {
    ...default_hooks,
    ...(custom_config.hooks || {})
  }
}


