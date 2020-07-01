const UserAgent = require("user-agents");
const parser = require("ua-parser-js");

export class UAGenerator {
  /**
   * @param {Object} options - filters ~ {platform, deviceCategory, e.t.c}
   */
  constructor(options) {
    this.options = options;
  }

  /**
   * @return {Object} result.ua = userAgent
   */
  Alone() {
    const userAgent = new UserAgent(this.options);
    var ua = parser(userAgent.userAgent);
    return ua;
  }

  /**
   * @return {Array} result[i].ua = userAgent
   */
  Array(count) {
    let result = [];
    for (let i = 0; i < count; i++) result.push(this.Alone());
    return result;
  }
}
