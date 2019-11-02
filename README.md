#### 1. css 依赖引入

1. 安装 reset-css

```bash
yarn add reset-css
```

2. 创建 ~/assets/styles/style.less 


3. 在 nuxt.config.js 中引入这两个 css

```javascript
export default {
  // ...
  css: [
    'reset-css/reset.css',
    '~/assets/styles/style.less'
  ]
  // ...
}
```

4. 在 nuxt.config.js 中配置 less

```bash
yarn add less less-loader

```

```javascript
export default {
  // ...
  build: {
    loaders: {
      less: {
        javascriptEnabled: true
      }
    }
  }
  // ...
}
```

#### 其他插件

```bash
yarn add axios url-join url-template
```

```javascript
export default {
  // ...
  plugins: [
    '~/plugins/vue-mobile/api',
    '~/plugins/mixins',
    '~/plugins/notifier',
  ],
  // ...
}
```

