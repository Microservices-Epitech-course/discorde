import axios from 'axios';
import { Dispatch } from 'redux';
import { ADD_CONVERSATION, SET_CONVERSATION } from 'store/actions/conversation';
import { SET_SERVER } from 'store/actions/server';
import { User } from 'store/types';
import * as Servers from './apis';

export const getServers = async (dispatch: Dispatch<any>) => {
  try {
    const response = await axios.get(
      `${Servers.jbdm}/users/@me/servers`,
      { headers: { "authorization": localStorage.getItem('token') }},
    );

    dispatch({
      type: SET_SERVER,
      payload: response.data
    });

    return response.data;
  } catch (error) {
    console.error(error);
    return { success: false, data: error.data };
  }
}

export const getConversations = async (dispatch: Dispatch<any>) => {
  try {
    const response = await axios.get(
      `${Servers.jbdm}/users/@me/conversations`,
      { headers: { "authorization": localStorage.getItem('token') }},
    );

    dispatch({
      type: SET_CONVERSATION,
      payload: response.data
    });

    return response.data;
  } catch (error) {
    console.error(error);
    return { success: false, data: error.data };
  }
}

export const getServersAndConversations = async (dispatch: Dispatch<any>) => {
  await getConversations(dispatch);
  await getServers(dispatch);
}

interface CreateConversationParams {
  usersId: Array<number>,
};

export const createConversation = async (dispatch: Dispatch<any>, me: User, params: CreateConversationParams) => {
  try {
    const response = await axios.post(
      `${Servers.jbdm}/users/conversations`,
      { usersId: params.usersId },
      { headers: { "authorization": localStorage.getItem('token') }},
    );

    dispatch({
      type: ADD_CONVERSATION,
      payload: response.data
    });

    return { success: true, data: response };
  } catch (error) {
    console.error(error);
    return { success: false, data: error.response };
  }
}
