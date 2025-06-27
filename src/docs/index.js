const basicInfo = require("./basicinfo");
const components = require("./components");
const users = require("./users");
const posts = require("./posts");

module.exports = {
  ...basicInfo,
  ...users,
  ...posts,
  ...components,
};
