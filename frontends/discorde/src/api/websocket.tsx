import { Dispatch } from "redux";
import { ADD_CONVERSATION } from "store/actions/conversation";
import { ADD_FRIENDS } from "store/actions/friends";
import { ADD_MESSAGE } from "store/actions/messages";
import { ADD_PENDING, DEL_PENDING } from "store/actions/pending";
import { ADD_USER } from "store/actions/users";
import { SET_WS } from "store/actions/ws";
import { RequestType, User } from "store/types";
import * as Servers from './apis';

let subscriptions = [];

export function subscribe(ws: WebSocket, channel: string, id: number | string) {
  if (!subscriptions.includes(`${channel}:${id}`)) {
    ws.send(`subscribe ${channel}:${id}`);
    subscriptions.push(`${channel}:${id}`)
  }
}
export function unsubscribe(ws: WebSocket, channel: string, id: number | string) {
  if (subscriptions.includes(`${channel}:${id}`))
    ws.send(`unsubscribe ${channel}:${id}`);
    subscriptions.filter(e => e === `${channel}:${id}`);
}

export function createWebsocket(dispatch: Dispatch<any>, me: User, stateWs: WebSocket) {
  const ws = stateWs ? stateWs : new WebSocket(Servers.chaussettes);

  ws.onopen = () => {
    subscribe(ws, 'user', me.id);
    dispatch({
      type: SET_WS,
      payload: ws
    });
  };
  ws.onmessage = (mess) => {
    if (mess.data[0] === '{') {
      const json = JSON.parse(mess.data);
      if (json.message[0] === '{') {
        const channel = json.channel;
        const message = JSON.parse(json.message)
        const action = message.action;
        const data = message.data;
        console.log(action);
        if (wsFunctions[action])
          wsFunctions[action](dispatch, data, action, channel, me);
        else
          console.log(`Action ${action} not handled`);
      }
    }
  }
}

const wsFunctions = {
  'userUpdate': (dispatch: Dispatch<any>, data: any, action: any, channel: string, me: User) => {
    dispatch({
      type: ADD_USER,
      payload: data
    })
  },
  'relationAdd': (dispatch: Dispatch<any>, data: any, action: any, channel: string, me: User) => {
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
  },
  'relationUpdate': (dispatch: Dispatch<any>, data: any, action: any, channel: string, me: User) => {
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
  },
  'relationDelete': (dispatch: Dispatch<any>, data: any, action: any, channel: string, me: User) => {
    dispatch({
      type: DEL_PENDING,
      payload: data
    })
  },
  'conversationAdd': (dispatch: Dispatch<any>, data: any, action: any, channel: string, me: User) => {
    dispatch({
      type: ADD_CONVERSATION,
      payload: data
    })
  },
  'messageAdd': (dispatch: Dispatch<any>, data: any, action: any, channel: string, me: User) => {
    console.log(channel);
    dispatch({
      type: ADD_MESSAGE,
      payload: {
        data,
        channelId: Number(channel.split(':')[1])
      }
    });
  },
  'messageUpdate': (dispatch: Dispatch<any>, data: any, action: any, channel: string, me: User) => {
  },
  'messageDelete': (dispatch: Dispatch<any>, data: any, action: any, channel: string, me: User) => {
  },
  'channelDelete': (dispatch: Dispatch<any>, data: any, action: any, channel: string, me: User) => {
  },
}