const express = require("express");
const router = express.Router();
const userRoute = require("./userRoutes");
const authRoutes = require("./authRoutes");
const docsRoute = require("./docsRoutes");
const config = require('../config/config');

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },
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
