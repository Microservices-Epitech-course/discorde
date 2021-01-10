import { Dispatch } from "redux";
import { ADD_CHANNEL, DEL_CHANNEL } from "store/actions/channels";
import { ADD_CONVERSATION, DEL_CONVERSATION } from "store/actions/conversation";
import { ADD_FRIENDS } from "store/actions/friends";
import { ADD_MEMBER, DEL_MEMBER } from "store/actions/members";
import { ADD_MESSAGE, DEL_MESSAGE } from "store/actions/messages";
import { ADD_PENDING, DEL_PENDING } from "store/actions/pending";
import { ADD_SERVER, DEL_SERVER } from "store/actions/server";
import { ADD_USER } from "store/actions/users";
import { SET_WS } from "store/actions/ws";
import { RequestType, User } from "store/types";
import * as Servers from './apis';

let subscriptions = [];
let waiting_subscriptions = [];

export function subscribe(ws: WebSocket, channel: string, id: number | string) {
  const channelName = `${channel}:${id}`;
  if (!ws) {
    waiting_subscriptions.push(channelName);
    return;
  }
  if (!subscriptions.includes(channelName)) {
    ws.send(`subscribe ${channelName}`);
    subscriptions.push(channelName)
  }
  if (waiting_subscriptions.length !== 0) {
    waiting_subscriptions.forEach((channelName2) => {
      if (!subscriptions.includes(channelName2)) {
        ws.send(`subscribe ${channelName2}`);
        subscriptions.push(channelName2);
      }
    })
    waiting_subscriptions = [];
  }
}
export function unsubscribe(ws: WebSocket, channel: string, id: number | string) {
  const channelName = `${channel}:${id}`;
  if (subscriptions.includes(channelName))
    ws.send(`unsubscribe ${channelName}`);
    subscriptions.filter(e => e === channelName);
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
        const [channelType, channelId] = channel.split(':');
        const message = JSON.parse(json.message)
        const action = message.action;
        const data = message.data;
        if (wsFunctions[action])
          wsFunctions[action](dispatch, data, action, channelType, Number(channelId), me);
        else
          console.log(`Action ${action} not handled`);
      }
    }
  }
}

const wsFunctions = {
  'messageAdd': (dispatch: Dispatch<any>, data: any, action: any, channelType: string, channelId: number, me: User) => {
    console.log(data);
    dispatch({
      type: ADD_MESSAGE,
      payload: {
        data,
        channelId: channelId,
      }
    });
  },
  'messageUpdate': (dispatch: Dispatch<any>, data: any, action: any, channelType: string, channelId: number, me: User) => {
    dispatch({
      type: ADD_MESSAGE,
      payload: {
        data,
        channelId: channelId,
      }
    });
  },
  'messageDelete': (dispatch: Dispatch<any>, data: any, action: any, channelType: string, channelId: number, me: User) => {
    dispatch({
      type: DEL_MESSAGE,
      payload: {
        data,
        channelId: channelId,
      }
    });
  },
  'channelRoleAdd': (dispatch: Dispatch<any>, data: any, action: any, channelType: string, channelId: number, me: User) => {
  },
  'channelRoleUpdate': (dispatch: Dispatch<any>, data: any, action: any, channelType: string, channelId: number, me: User) => {
  },
  'reactionAdd': (dispatch: Dispatch<any>, data: any, action: any, channelType: string, channelId: number, me: User) => {
  },
  'reactionUpdate': (dispatch: Dispatch<any>, data: any, action: any, channelType: string, channelId: number, me: User) => {
  },
  'reactionDelete': (dispatch: Dispatch<any>, data: any, action: any, channelType: string, channelId: number, me: User) => {
  },
  'relationAdd': (dispatch: Dispatch<any>, data: any, action: any, channelType: string, channelId: number, me: User) => {
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
        request: data.actionUserId === me.id ? RequestType.OUTGOING : RequestType.INCOMING
      })
    });
  },
  'relationUpdate': (dispatch: Dispatch<any>, data: any, action: any, channelType: string, channelId: number, me: User) => {
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
  'relationDelete': (dispatch: Dispatch<any>, data: any, action: any, channelType: string, channelId: number, me: User) => {
    dispatch({
      type: DEL_PENDING,
      payload: data
    })
  },
  'conversationAdd': (dispatch: Dispatch<any>, data: any, action: any, channelType: string, channelId: number, me: User) => {
    dispatch({
      type: ADD_CONVERSATION,
      payload: data
    })
  },
  'serverAdd': (dispatch: Dispatch<any>, data: any, action: any, channelType: string, channelId: number, me: User) => {
    dispatch({
      type: ADD_SERVER,
      payload: data
    })
  },
  'friendAdd': (dispatch: Dispatch<any>, data: any, action: any, channelType: string, channelId: number, me: User) => {
    dispatch({
      type: ADD_FRIENDS,
      payload: data.id
    })
  },
  'userUpdate': (dispatch: Dispatch<any>, data: any, action: any, channelType: string, channelId: number, me: User) => {
    dispatch({
      type: ADD_USER,
      payload: data
    })
  },
  'userDelete': (dispatch: Dispatch<any>, data: any, action: any, channelType: string, channelId: number, me: User) => {
    dispatch({
      type: ADD_USER,
      payload: data
    })
  },
  'serverUpdate': (dispatch: Dispatch<any>, data: any, action: any, channelType: string, channelId: number, me: User) => {
    dispatch({
      type: ADD_SERVER,
      payload: data
    })
  },
  'serverDelete': (dispatch: Dispatch<any>, data: any, action: any, channelType: string, channelId: number, me: User) => {
    dispatch({
      type: DEL_SERVER,
      payload: data
    })
  },
  'conversationDelete': (dispatch: Dispatch<any>, data: any, action: any, channelType: string, channelId: number, me: User) => {
    dispatch({
      type: DEL_CONVERSATION,
      payload: data
    })
  },
  'memberAdd': (dispatch: Dispatch<any>, data: any, action: any, channelType: string, channelId: number, me: User) => {
    dispatch({
      type: ADD_MEMBER,
      payload: {
        member: data,
        serverId: channelId,
      }
    })
  },
  'memberUpdate': (dispatch: Dispatch<any>, data: any, action: any, channelType: string, channelId: number, me: User) => {
    dispatch({
      type: ADD_MEMBER,
      payload: {
        member: data,
        serverId: channelId,
      }
    })
  },
  'memberDelete': (dispatch: Dispatch<any>, data: any, action: any, channelType: string, channelId: number, me: User) => {
    dispatch({
      type: DEL_MEMBER,
      payload: {
        memberId: data,
        serverId: channelId
      }
    })
  },
  'channelAdd': (dispatch: Dispatch<any>, data: any, action: any, channelType: string, channelId: number, me: User) => {
    dispatch({
      type: ADD_CHANNEL,
      payload: {
        channel: data,
        serverId: channelId,
      }
    })
  },
  'channelUpdate': (dispatch: Dispatch<any>, data: any, action: any, channelType: string, channelId: number, me: User) => {
    dispatch({
      type: ADD_CHANNEL,
      payload: {
        channel: data,
        serverId: channelId,
      }
    });
  },
  'channelDelete': (dispatch: Dispatch<any>, data: any, action: any, channelType: string, channelId: number, me: User) => {
    dispatch({
      type: DEL_CHANNEL,
      payload: {
        channelId: data,
        serverId: channelId,
      }
    });
  },
  'roleAdd': (dispatch: Dispatch<any>, data: any, action: any, channelType: string, channelId: number, me: User) => {
  },
  'roleUpdate': (dispatch: Dispatch<any>, data: any, action: any, channelType: string, channelId: number, me: User) => {
  },
  'roleDelete': (dispatch: Dispatch<any>, data: any, action: any, channelType: string, channelId: number, me: User) => {
  },
}