const express = require("express");
const router = express.Router();
const userRoute = require("./users");
const docsRoute = require("./docs");
const config = require('../config/config');

const defaultRoutes = [
  {
    path: "/users",
    route: userRoute,
  },
];

const devRoutes = [
  {
    path: "/docs",
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

if (config.env === "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
