const { UserModel } = require('../models')


const getUserByEmail = async (email) => {
    return UserModel.findOne({ where: { email } });
};

const createUser = async(userData) => {
    return UserModel.create(userData);
}

const getUserById = async (id) => {
    return UserModel.findByPk(id);
};

const isEmailTaken = async (email, userId) => {
    const user = await UserModel.findOne({ where: { email, id: { [Op.ne]: userId } } });
    return !!user;
};

const updateUserById = async (userId, updateBody) => {
    const user = await getUserById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    if (updateBody.email && (await isEmailTaken(updateBody.email, userId))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    Object.assign(user, updateBody);
    await user.save();
    return user;
};

module.exports = {
    getUserByEmail,
    createUser,
    updateUserById,
    getUserById,
    updateUserById,
    isEmailTaken
}