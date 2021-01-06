import axios from 'axios';
import * as Servers from './servers';

interface RegisterParams {
  email: string,
  username: string,
  password: string,
};

export const register = async (params: RegisterParams) => {
  try {
    const response = await axios.post(`${Servers.sven}/register`, {
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
    const response = await axios.post(`${Servers.sven}/auth`, {
      ...params,
    });
    localStorage.setItem('token', response.data);
    return true;
  } catch (error) {
    return error.response.data;
  }
};
