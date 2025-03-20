const { consoleError, returnSuccess } = require('../helpers/requestHelper')
const httpStatus = require('http-status')

const register = (req, res) => {
    res.send(returnSuccess(httpStatus.OK, "Login success"))
}

const login = (req, res) => {
    res.send(returnSuccess(httpStatus.OK, "Login success", []))
}

module.exports = {
    register,
    login
}