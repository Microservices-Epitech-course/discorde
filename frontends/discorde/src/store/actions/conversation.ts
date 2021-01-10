import { subscribe, unsubscribe } from "api/websocket";
import { Server } from "store/types";
import { ReduxState } from "..";
import { cleanServer, concatOrReplace, multiConcatOrReplace, removeDuplicates } from "./utils";

/* Actions */
export const SET_CONVERSATION = 'SET_CONVERSATION';
export const ADD_CONVERSATION = 'ADD_CONVERSATION';
export const DEL_CONVERSATION = 'DEL_CONVERSATION';

/* Types */
export interface SetConversationAction {
  type: typeof SET_CONVERSATION;
  payload: Server[];
}
export interface AddConversationAction {
  type: typeof ADD_CONVERSATION;
  payload: Server;
}
export interface DelConversationAction {
  type: typeof DEL_CONVERSATION;
  payload: number;
}

export type Actions = SetConversationAction | AddConversationAction | DelConversationAction;

/* Functions */
export function setConversation(state: ReduxState, action: SetConversationAction) {
  const users = action.payload.map((e) => e.members.map((e2) => e2.user)).flat();

  action.payload.map((e) => {
    subscribe(state.ws, "server", e.id);
    e.channels.forEach((e2) => {
      subscribe(state.ws, "channel", e2.id);
    })
  });
  users.map((e) => subscribe(state.ws, "user", e.id));
  return {
    ...state,
    conversations: action.payload.map((s) => cleanServer(s)),
    users: multiConcatOrReplace(state.users, removeDuplicates(users, "id"), "id"),
  }
}
export function addConversation(state: ReduxState, action: AddConversationAction) {
  const users = action.payload.members.map((e) => e.user);
  
  subscribe(state.ws, "server", action.payload.id);
  action.payload.channels.forEach((e) => {
    subscribe(state.ws, "channel", e.id);
  })
  users.map((e) => subscribe(state.ws, "user", e.id));
  return {
    ...state,
    conversations: concatOrReplace(state.conversations, cleanServer(action.payload), "id"),
    users: multiConcatOrReplace(state.users, removeDuplicates(users, "id"), "id"),
  };
}
export function delConversation(state: ReduxState, action: DelConversationAction) {
  const server = state.conversations.find((e) => e.id === action.payload);

  unsubscribe(state.ws, "server", action.payload);
  server.channels.forEach((e) => unsubscribe(state.ws, "channel", e.id));  
  return {
    ...state,
    conversations: state.conversations.filter(e => e.id !== action.payload),
  };
}

/* Dispatches */
export const dispatches = [
  {
    action: SET_CONVERSATION,
    function: setConversation,
  },
  {
    action: ADD_CONVERSATION,
    function: addConversation,
  },
  {
    action: DEL_CONVERSATION,
    function: delConversation
  }
];