const axios = require('axios');

interface RegisterParams {
  email: string,
  username: string,
  password: string,
};

export const register = async (params: RegisterParams) => {
  try {
    const response = await axios.post('https://api-discorde-sven.herokuapp.com/register', {
      ...params,
    });
    return true;
  } catch (error) {
    return error.response.data;
  }
};

interface LoginParams {
  email: string,
  password: string,
};

export const login = async (params: LoginParams) => {
  try {
    const response = await axios.post('https://api-discorde-sven.herokuapp.com/auth', {
      ...params,
    });
    localStorage.setItem('token', response.data);
    // console.log(localStorage.getItem('token'));
    return true;
  } catch (error) {
    return rerror.response.data;
  }
};
