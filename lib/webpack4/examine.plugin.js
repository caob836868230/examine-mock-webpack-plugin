const chalk = require('chalk');

/**
 * 检查代码中是否出现调用mocky接口
 */
const paramAdapt = {
  array: (param) => {
    let result = [];
    if (!param || param.length === 0) {
      return result;
    }
    const paramType = Object.prototype.toString.call(param);
    switch (paramType) {
      case '[object Array]':
        result = param;
        break;
      case '[object String]':
        result = [param];
        break;
    }
    return result;
  },
};

class ExamineMockyInterfacePlugin {
  constructor(options) {
    const { include = [], exclude = [] } = options;
    // 判断是否传了include参数，没有传递采用默认规则
    const includeAdapt = paramAdapt.array(include);
    this.include =
      includeAdapt.length !== 0 ? includeAdapt : ExamineMockyInterfacePlugin.defaultMockReg;
    this.exclude = paramAdapt.array(exclude);
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('ExamineMockyInterfacePlugin', (compilation, callback) => {
      let errorList = [];
      // 遍历所有资源文件
      for (const filePathName in compilation.assets) {
        // 获取文件内容
        if (compilation.assets[filePathName]) {
          const content = compilation.assets[filePathName].source().toString() || '';
          const hitMockList = this.hasMock(content);
          hitMockList.length > 0 && (errorList = errorList.concat(hitMockList));
        }
      }
      if (errorList.length > 0) {
        throw Error(`\r\n${chalk.red(
          'some mock interface in your code, please check it：'
        )}\r\n${chalk.green(
          errorList.reduce((pre, next, index) => {
            return `${pre}${index + 1}. ${next}\r\n`;
          }, '')
        )}
        `);
      } else {
        callback();
      }
    });
  }

  hasMock(content) {
    let list = [];
    this.include.forEach((reg) => {
      let regResult = content.match(reg);
      if (regResult) {
        regResult = this.checkExclude(regResult);
        regResult.length > 0 && (list = list.concat(regResult));
      }
    });
    return list;
  }

  checkExclude(mockList) {
    return mockList.filter((mock) => {
      return !this.exclude.some((reg) => {
        let need = false;
        if (typeof reg === 'string') {
          need = reg.indexOf(mock) !== -1;
        } else if (reg instanceof RegExp) {
          need = reg.test(mock);
        }
        return need;
      });
    });
  }
}

ExamineMockyInterfacePlugin.defaultMockReg = [
  // mocky接口规则 https://run.mocky.io/v3/x-x-x-x-x
  /https:\/\/run\.mocky\.io\/v3\/[-a-z0-9]+/g,
  // fast mock规则 https://www.fastmock.site/mock/21ebe4b4333bb069fd0019ee479795f9/xxx/aaa
  /https:\/\/www\.fastmock\.site\/mock\/[-/0-9a-z]+/g,
];

module.exports = ExamineMockyInterfacePlugin;
