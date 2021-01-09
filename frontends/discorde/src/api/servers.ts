import axios from 'axios';
import { Dispatch } from 'redux';
import { ADD_MESSAGE, MULTI_ADD_MESSAGE } from 'store/actions/messages';
import { ADD_SERVER } from 'store/actions/server';
import * as Servers from './apis';

export const loadMessages = async (dispatch: Dispatch<any>, channelId: number) => {
  try {
    const response = await axios.get(
      `${Servers.hermes}/channels/${channelId}/messages`,
      { headers: { authorization: localStorage.getItem("token") }}
    );

    dispatch({
      type: MULTI_ADD_MESSAGE,
      payload: {
        data: response.data,
        channelId: channelId
      }
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error(error);
    return { success: false, data: error.data };
  }
}
export const sendMessages = async (dispatch: Dispatch<any>, content: string, channelId: number) => {
  try {
    const response = await axios.post(
      `${Servers.hermes}/channels/${channelId}/messages`,
      { content },
      { headers: { authorization: localStorage.getItem("token") }}
    );

    dispatch({
      type: ADD_MESSAGE,
      payload: {
        data: response.data,
        channelId: channelId
      }
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error(error);
    return { success: false, data: error.data };
  }
}

interface CreateServerParams {
  name: string,
};

export const createServer = async (dispatch: Dispatch<any>, params: CreateServerParams) => {
  try {
    const response = await axios.post(
      `${Servers.marine}/servers`,
      { name: params.name },
      { headers: { "authorization": localStorage.getItem('token') }},
    );

    dispatch({
      type: ADD_SERVER,
      payload: response.data,
    });
    return { success: true, data: response };
  } catch (error) {
    console.error(error);
    return { success: false, data: error.response.data };
  }
}
