const { returnSuccess } = require("../helpers/requestHelper");
const httpStatus = require("http-status").default;
const { createUser, getUserByEmail } = require("../services/userServices");
const {
  generateAuthTokens,
  generateVerifyEmailToken,
  generateResetPasswordToken,
} = require("../services/tokenServices");
const ApiError = require("../utils/ApiError");
const {
  userLoginVerify,
  logout,
  sendVerificationEmail,
  sendResetPasswordEmail,
  resetPassword,
} = require("../services/authServices");

const register = async (req, res, next) => {
  try {
    const userData = req.body;
    if (await getUserByEmail(userData.email)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `User ${userData.email} already exists`
      );
    }
    const user = await createUser(userData);
    const tokens = await generateAuthTokens(user);
    const verifyEmailToken = await generateVerifyEmailToken(user);
    await sendVerificationEmail(user.email, user.firstName, verifyEmailToken);
    res.send(
      returnSuccess(httpStatus.CREATED, "User registered successfully", {
        user,
        tokens,
      })
    );
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    loginBody = req.body;
    const user = await userLoginVerify(loginBody);
    if (!user) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Incorrect email or password"
      );
    }
    const tokens = await generateAuthTokens(user);
    res.send(
      returnSuccess(httpStatus.OK, "You have been logged IN", { user, tokens })
    );
  } catch (error) {
    next(error);
  }
};

const logoutSession = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        const status = await logout(refreshToken);
        if (!status) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Invalid refresh token');
        }
        return res.send(returnSuccess(httpStatus.OK, 'You have been logged out'))
    } catch (error) {
        next(error);
    }
};

const forgotPassword = async(req, res, next) => {
    try {
        const { email } = req.body;
        const user = await getUserByEmail(email)
        if (!user || user === null) {
            throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, `User ${email} not exists`);
        }
        const token = await generateResetPasswordToken(user)
        sendResetPasswordEmail(user.email, user.firstName,  token)
        return res.send(returnSuccess(httpStatus.OK, 'Check your email to reset password', {token}))
    } catch (error) {
        next(error);
    }
}

const updatePassword = async(req, res, next) => {
    try {
        const {token} = req.query 
        const {password } = req.body
        await resetPassword(token, password);
        return res.send(returnSuccess(httpStatus.OK, 'Your password has been reset'))
    } catch (error) {
        next(error);
    }
}

const dashboard = (req, res) => {
  res.send(returnSuccess(httpStatus.OK, "Dashboard is available to connect"));
};

module.exports = {
  register,
  login,
  logoutSession,
  dashboard,
  forgotPassword,
  updatePassword
};
