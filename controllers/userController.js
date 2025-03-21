const express = require("express");
const { UserModel } = require("../models");
const { paginate, returnSuccess, consoleError } = require("../helpers/requestHelper")
const httpStatus = require("http-status");
const userCollection = require("../resource/userCollection")

const getUserList = async(req, res) => {
    const { per_page = 100, page = 1 } = req.query
    const queryOptions = []
    let users = await paginate(
        UserModel,
        queryOptions,
        page,
        per_page
    )
    res.send(returnSuccess(httpStatus.OK, 'Users Listing', users, userCollection ))
}

module.exports = {
    getUserList
}