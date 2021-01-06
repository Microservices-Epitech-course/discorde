import axios from 'axios';
import * as Servers from './servers';

interface GetServersParams {
  id: string,
};

export const getServersAndConversations = async () => {
  try {
    const response = await axios.get(
      `${Servers.jbdm}/users/@me/conversations`,
      { headers: { "authorization": localStorage.getItem('token') }},
    );
    return response.data;
  } catch (error) {
     return { success: false, data: error.data };
  }
}

interface CreateConversationParams {
  usersId: Array<number>,
};

export const createConversation = async (params: CreateConversationParams) => {
  try {
    const response = await axios.post(
      `${Servers.jbdm}/users/conversations`,
      { usersId: params.usersId },
      { headers: { "authorization": localStorage.getItem('token') }},
    );
    return { success: true, data: response };
  } catch (error) {
    return { success: false, data: error.response.data };
  }
}
