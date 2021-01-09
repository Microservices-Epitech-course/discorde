import { Message } from "store/types";
import { ReduxState } from "..";
import { concatOrReplace, multiConcatOrReplace } from "./utils";

/* Actions */
export const ADD_MESSAGE = 'ADD_MESSAGE';
export const MULTI_ADD_MESSAGE = 'MULTI_ADD_MESSAGE';
export const DEL_MESSAGE = 'DEL_MESSAGE';

/* Types */
export interface AddMessageAction {
  type: typeof ADD_MESSAGE;
  payload: {
    data: Message;
    channelId: number;
  }
}
export interface MultiAddMessageAction {
  type: typeof MULTI_ADD_MESSAGE;
  payload: {
    data: Message[];
    channelId: number;
  }
}
export interface DelMessageAction {
  type: typeof DEL_MESSAGE;
  payload: {
    id: number;
    channelId: number;
  };
}

export type Actions = AddMessageAction | MultiAddMessageAction | DelMessageAction;

/* Functions */
export function addMessage(state: ReduxState, action: AddMessageAction) {
  const message = action.payload.data;
  message.authorId = message.author.id;
  delete message.author;

  const server = state.servers.find((s) => s.channels.find((c) => c.id === action.payload.channelId));
  const conversations = state.conversations.find((s) => s.channels.find((c) => c.id === action.payload.channelId));
  if (server || conversations) {
    const s = server ? server : conversations;
    const channelIndex = s.channels.findIndex((e) => e.id === action.payload.channelId);
    s.channels[channelIndex].messages = s.channels[channelIndex].messages ?
      concatOrReplace((server ? server : conversations).channels[channelIndex].messages, message, "id") :
      [message];
    if (server) {
      return {
        ...state,
        servers: concatOrReplace(state.servers, s, "id")
      }
    } else {
      return {
        ...state,
        conversations: concatOrReplace(state.conversations, s, "id")
      }
    }
  } else {
    return state;
  }
}
export function multiAddMessage(state: ReduxState, action: MultiAddMessageAction) {
  const messages = action.payload.data.map((e) => {
    e.authorId = e.author.id;
    delete e.author;
    return e;
  })

  const server = state.servers.find((s) => s.channels.find((c) => c.id === action.payload.channelId));
  const conversations = state.conversations.find((s) => s.channels.find((c) => c.id === action.payload.channelId));
  if (server || conversations) {
    const s = server ? server : conversations;
    const channelIndex = s.channels.findIndex((e) => e.id === action.payload.channelId);
    s.channels[channelIndex].messages = s.channels[channelIndex].messages ? 
      multiConcatOrReplace(s.channels[channelIndex].messages, messages, "id") :
      messages;
    if (server) {
      return {
        ...state,
        servers: concatOrReplace(state.servers, s, "id")
      }
    } else {
      return {
        ...state,
        conversations: concatOrReplace(state.conversations, s, "id")
      }
    }
  } else {
    return state;
  }
}
export function delMessage(state: ReduxState, action: DelMessageAction) {
  const server = state.servers.find((s) => s.channels.find((c) => c.id === action.payload.channelId));
  const conversations = state.conversations.find((s) => s.channels.find((c) => c.id === action.payload.channelId));

  if (server || conversations) {
    const channelIndex = (server ? server : conversations).channels.findIndex((e) => e.id === action.payload.channelId);
    (server ? server : conversations).channels[channelIndex].messages.filter((e) => e.id === action.payload.id);
    if (server) {
      return {
        ...state,
        servers: concatOrReplace(state.servers, server, "id")
      }
    } else {
      return {
        ...state,
        conversations: concatOrReplace(state.conversations, conversations, "id")
      }
    }
  } else {
    return state;
  }
}

/* Dispatches */
export const dispatches = [
  {
    action: ADD_MESSAGE,
    function: addMessage,
  },
  {
    action: MULTI_ADD_MESSAGE,
    function: multiAddMessage,
  },
  {
    action: DEL_MESSAGE,
    function: delMessage
  }
];