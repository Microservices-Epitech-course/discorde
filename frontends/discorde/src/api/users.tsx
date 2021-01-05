const axios = require('axios');

export const getAllUsers = async (params: LoginParams) => {
  try {
    const response = await axios.get('https://api-discorde-jbdm.herokuapp.com/users/@me/relations');
    console.log(response.data);
    return true;
  } catch (error) {
    return rerror.response.data;
  }
};
