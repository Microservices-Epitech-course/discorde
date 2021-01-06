import { ADD_FRIENDS } from "store/actions/friends";
import { ADD_PENDING, DEL_PENDING } from "store/actions/pending";
import { ADD_USER } from "store/actions/users";
import { SET_WS } from "store/actions/ws";
import { RequestType } from "store/types";
import * as Servers from './servers';

export function createWebsocket(dispatch, me, stateWs) {
  const ws = stateWs ? stateWs : new WebSocket(Servers.chaussettes);

  ws.onopen = () => {
    ws.send(`subscribe user:${me.id}`);
    dispatch({
      type: SET_WS,
      payload: ws
    });
  };
  ws.onmessage = (mess) => {
    if (mess.data[0] === '{') {
      const json = JSON.parse(mess.data);
      if (json.message[0] === '{') {
        const message = JSON.parse(json.message)
        const action = message.action;
        const data = message.data;
        switch (action) {
          case 'userUpdate':
            return;
          case 'relationAdd': {
            const actionUser = data.users.find(e => e.id !== me?.id);
            dispatch({
              type: ADD_USER,
              payload: actionUser
            });
            dispatch({
              type: ADD_PENDING,
              payload: ({
                relationId: data.id,
                userId: actionUser.id,
                request: RequestType.INCOMING
              })
            });
            return;
          }
          case 'relationUpdate': {
            const actionUser = data.users.find(e => e.id !== me?.id);
            dispatch({
              type: ADD_USER,
              payload: actionUser
            });
            if (data.status === 'accepted') {
              dispatch({
                type: DEL_PENDING,
                payload: data.id
              });
              dispatch({
                type: ADD_FRIENDS,
                payload: actionUser.id
              });
            } else {
              dispatch({
                type: ADD_PENDING,
                payload: ({
                  relationId: data.id,
                  userId: actionUser.id,
                  request: RequestType.INCOMING
                })
              });
            }
            return;
          }
          case 'relationDelete':
            dispatch({
              type: DEL_PENDING,
              payload: data
            })
            return
          
          case 'messageAdd':
          case 'messageUpdate':
          case 'messageDelete':
          case 'channelDelete':

          default:
            console.log(`Action ${action} not handled`);
            return
        }
      }
    }
  }
}