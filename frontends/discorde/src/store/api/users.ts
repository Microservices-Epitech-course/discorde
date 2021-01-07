import { createWebsocket } from "api/websocket";
import axios from "axios";
import Router from "next/router";
import { Dispatch } from "redux";
import { SET_ME } from "store/actions/users";
import { User } from "store/types";
import * as Servers from '../../api/apis';

export const getMe = async(dispatch: Dispatch<any>, ws: WebSocket) => {
  try {
    const response = await axios.get(
      `${Servers.jbdm}/users/@me`,
      { headers: {authorization: localStorage.getItem("token") }}
    );

    const me: User = response.data;

    createWebsocket(dispatch, me, ws);
    dispatch({
      type: SET_ME,
      payload: me
    });
    if (Router.asPath === '/' || Router.asPath == '/auth/login')
      Router.push('/channels/@me');
    return { success: true, data: response.data};
  } catch (e) {
    console.error(e);
    localStorage.removeItem("token");
    Router.push('/');
    return { success: false, data: e.data }
  }
}