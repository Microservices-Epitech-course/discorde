import axios from 'axios';
import * as Servers from './servers';

interface GetServersParams {
  id: string,
};

export const getServers = async (params: GetServersParams) => {
  try {
    const response = await axios.get(
      `${Servers.jbdm}/users/@me/conversations`,
      { headers: { "authorization": localStorage.getItem('token') }},
    );
    return true;
  } catch (error) {
    return error.response;
  }
}
