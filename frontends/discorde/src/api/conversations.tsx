import axios from 'axios';
import Router from "next/router";
import { Dispatch } from 'redux';
import { ADD_CONVERSATION, DEL_CONVERSATION, SET_CONVERSATION } from 'store/actions/conversation';
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

    return { success: true, data: response.data };
  } catch (error) {
    console.error(error);
    return { success: false, data: error.response };
  }
}

interface QuitConversation {
  id: number,
}

export const QuitConversation = async (dispatch: Dispatch<any>, params: QuitConversation) => {
  try {
    const response = await axios.delete(
      `${Servers.marine}/servers/${params.id}/members/@me`,
      { headers: { "authorization": localStorage.getItem("token") }},
    );

    if (Router.asPath === `/channels/@me/${params.id}`)
      Router.replace('/channels/@me');
    dispatch({
      type: DEL_CONVERSATION,
      payload: params.id
    });

    return { success: true, data: response };
  } catch (error) {
    console.error(error);
    return { success: false, data: error.data };
  }
}
