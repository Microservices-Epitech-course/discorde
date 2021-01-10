import axios, { AxiosRequestConfig } from 'axios';

const authToken = (config: AxiosRequestConfig): AxiosRequestConfig => {
  // eslint-disable-next-line
  config.headers.Authorization = window.localStorage.getItem('token') || '';
  return config;
};

export const sven = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SVEN_URL || 'not_set',
});
sven.interceptors.request.use(authToken);

export const jbdm = axios.create({
  baseURL: process.env.NEXT_PUBLIC_JBDM_URL || 'not_set',
});
jbdm.interceptors.request.use(authToken);
