const config = require("../config/config");
const { tokenTypes } = require("../config/tokens");
const { TokenModel } = require('../models/')
const { getUserByEmail, getUserById, updateUserById } = require("./userServices");
const pug = require('pug');
const path = require('path');
const { triggerEmail } = require("./emailServices");
const { verifyToken } = require("./tokenServices");


const userLoginVerify = async (data) => {
    const { email, password } = data;
    const user = await getUserByEmail(email);
    if (!user || !(await user.isPasswordMatch(password))) {
        return false;
    }
    return user;
};

const logout = async (refreshToken) => {
    const userRefreshToken = await TokenModel.findOne({ where: {token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false} });
    if (!userRefreshToken) {
        return false;
    }
    await userRefreshToken.destroy();
    return true;
};

const sendVerificationEmail = async (to, name, token) => {
    const subject = 'Email Verification';
    const verificationEmailUrl = `${config.app_url}:${config.port}/api/v1/auth/verify-email?token=${token}`;
    const html = pug.renderFile(
        path.join(__dirname, '../views/emails/verificationEmail.pug'),
        { name, verificationEmailUrl }
    );
    await triggerEmail(to, subject, '', html);
};

const sendResetPasswordEmail = async(to, name, token) => {
    const subject = 'Reset Password';
    const resetPasswordToken = `${config.app_url}:${config.port}/api/v1/auth/reset-password?token=${token}`;
    const html = pug.renderFile(
        path.join(__dirname, '../views/emails/resetpasswordEmail.pug'),
        { name, resetPasswordToken }
    );
    await triggerEmail(to, subject, '', html);
}

const resetPassword = async (token, password) => {
    const resetToken = await verifyToken(token, tokenTypes.RESET_PASSWORD);
    const user = await getUserById(resetToken.userId);
    if (!user) {
        throw new Error();
    }
    await updateUserById(user.id, { password: password });
    await TokenModel.destroy({ where: { userId: user.id, type: tokenTypes.RESET_PASSWORD } });
};


module.exports = {
    userLoginVerify,
    logout,
    sendVerificationEmail,
    sendResetPasswordEmail,
    resetPassword
}