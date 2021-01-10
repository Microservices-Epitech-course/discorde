import { subscribe, unsubscribe } from "api/websocket";
import { Channel } from "store/types";
import { ReduxState } from "..";
import { concatOrReplace } from "./utils";

/* Actions */
export const SET_CHANNEL = 'SET_CHANNEL';
export const ADD_CHANNEL = 'ADD_CHANNEL';
export const DEL_CHANNEL = 'DEL_CHANNEL';

/* Types */
export interface SetChannelAction {
  type: typeof SET_CHANNEL;
  payload: {
    channels: Channel[];
    serverId: number;
  }
}
export interface AddChannelAction {
  type: typeof ADD_CHANNEL;
  payload: {
    channel: Channel;
    serverId: number;
  }
}
export interface DelChannelAction {
  type: typeof DEL_CHANNEL;
  payload: {
    channelId: number;
    serverId: number;
  }
}

export type Actions = SetChannelAction | AddChannelAction | DelChannelAction;

/* Functions */
export function setChannel(state: ReduxState, action: SetChannelAction) {
  const server = state.servers.find((e) => e.id === action.payload.serverId);
  const conversation = state.conversations.find((e) => e.id === action.payload.serverId);

  if (!server && !conversation)
    return { ...state };
  const s = server ? server : conversation;
    
  s.channels = action.payload.channels;
  s.channels.forEach((e) => subscribe(state.ws, "channel", e.id));
  if (server) {
    return {
      ...state,
      servers: concatOrReplace(state.servers, s, "id"),
    };
  } else {
    return {
      ...state,
      conversations: concatOrReplace(state.conversations, s, "id"),
    }
  }
}
export function addChannel(state: ReduxState, action: AddChannelAction) {
  const server = state.servers.find((e) => e.id === action.payload.serverId);
  const conversation = state.conversations.find((e) => e.id === action.payload.serverId);

  if (!server && !conversation)
    return { ...state };
  const s = server ? server : conversation;

  s.channels = concatOrReplace(s.channels, action.payload.channel, "id");
  subscribe(state.ws, "channel", action.payload.channel.id);
  if (server) {
    return {
      ...state,
      servers: concatOrReplace(state.servers, s, "id"),
    };
  } else {
    return {
      ...state,
      conversations: concatOrReplace(state.conversations, s, "id"),
    }
  }
}
export function delChannel(state: ReduxState, action: DelChannelAction) {
  const server = state.servers.find((e) => e.id === action.payload.serverId);
  const conversation = state.conversations.find((e) => e.id === action.payload.serverId);

  if (!server && !conversation)
    return { ...state };
  const s = server ? server : conversation;

  s.channels = s.channels.filter((e) => e.id !== action.payload.channelId);
  unsubscribe(state.ws, "channel", action.payload.channelId);
  if (server) {
    return {
      ...state,
      servers: concatOrReplace(state.servers, s, "id"),
    };
  } else {
    return {
      ...state,
      conversations: concatOrReplace(state.conversations, s, "id"),
    }
  }}

/* Dispatches */
export const dispatches = [
  {
    action: SET_CHANNEL,
    function: setChannel,
  },
  {
    action: ADD_CHANNEL,
    function: addChannel,
  },
  {
    action: DEL_CHANNEL,
    function: delChannel,
  },
];