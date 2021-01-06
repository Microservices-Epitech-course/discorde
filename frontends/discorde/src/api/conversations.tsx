import axios from 'axios';
import { Dispatch } from 'redux';
import { SET_CONVERSATION } from 'store/actions/conversation';
import { SET_SERVER } from 'store/actions/server';
import { ServerType } from 'store/types';
import * as Servers from './servers';

interface GetServersParams {
  id: string,
};

export const getServersAndConversations = async (dispatch: Dispatch<any>) => {
  try {
    const response = await axios.get(
      `${Servers.jbdm}/users/@me/conversations`,
      { headers: { "authorization": localStorage.getItem('token') }},
    );
    const allServers = response.data.filter(e => e.type === ServerType.SERVER);
    const allConversations = response.data.filter(e => e.type === ServerType.CONVERSATION);

    dispatch({
      type: SET_SERVER,
      payload: allServers
    });
    dispatch({
      type: SET_CONVERSATION,
      payload: allConversations
    });

    return response.data;
  } catch (error) {
    console.error(error);
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
    console.error(error);
    return { success: false, data: error.response.data };
  }
}
