const basicInfo = require("./basicinfo");
const components = require("./components");
const user = require("./user");

module.exports = {
  ...basicInfo,
  ...user,
  ...components,
};
