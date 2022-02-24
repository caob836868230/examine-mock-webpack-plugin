# examine-mock-webpack-plugin
examine mock interface in your code

# install
```
  npm i examine-mock-webpack-plugin -D
```

# basic usage
```javascript
  const ExamineMockWebpackPlugin = require("examine-mock-webpack-plugin")
  
  // webpack plugin setting
  new ExamineMockWebpackPlugin()
```

# params
1. 参数类型：`object`
   
|  param |  type  | remark |
|  ----  |  ----  | ----   |
| inlcude | String/Array/RegExp | 需要检查的模拟接口规则 |
| exclude | String/Array/RegExp | 排除检查的模拟接口规则 |

```javascript
  new ExamineMockWebpackPlugin({
    include: [/mock1/, /mock2/],
    exclude: [/mock3/]
  })
```

2. `ExamineMockWebpackPlugin.defaultMockReg`: 默认校验规则，基于第三方能力（mocky和fast mock）
   
```javascript
  new ExamineMockyInterfacePlugin({
    include: [...ExamineMockWebpackPlugin.defaultMockReg, /mock1/, /mock2/],
    exclude: [/mock3/]
  })
```