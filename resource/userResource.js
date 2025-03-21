const   userResource = (user) => {
    return {
      user_id: user.id,
      first_name: user.firstName,
      last_name: user.lastName,
      phone: user.phone
    };
  };
  
  module.exports = userResource;