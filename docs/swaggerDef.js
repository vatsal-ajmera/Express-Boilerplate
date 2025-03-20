const { version } = require('../package.json');
const config = require('../config/config');

const swaggerDef = {
    openapi: '3.0.0',
    info: {
        title: `${config.app_name} API documentation`,
        version,
        license: {
            name: 'MIT',
            url: 'https://github.com/vatsal-zwt/Express-App',
        },
    },
    servers: [
        {
            url: `${config.app_url}:${config.port}/api/v1`,
        },
    ],
};

module.exports = swaggerDef;
