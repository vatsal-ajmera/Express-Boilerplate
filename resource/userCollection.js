const userResource = require("./userResource");

const userCollection = (users) => {
  return users.map((user) => userResource(user));
};

module.exports = userCollection;