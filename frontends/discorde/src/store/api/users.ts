import * as Api from "api";
import { createWebsocket } from "api/websocket";
import { Dispatch } from "redux";
import { SET_ME } from "store/actions/users";

export const getMe = async(dispatch: Dispatch<any>, ws: WebSocket, onError?: (any) => void, onSuccess?: (any) => void) => {
  const me = await Api.getUser(dispatch, {id: "@me"});
  
  if (!me.success) {
    if (onError)
      onError(me.data);
  } else {
    dispatch({
      type: SET_ME,
      payload: me.data
    });
    createWebsocket(dispatch, me.data, ws);
    if (onSuccess)
      onSuccess(me.data);
  }
}