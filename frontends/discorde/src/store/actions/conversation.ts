import { Server } from "store/types";
import { ReduxState } from "..";
import { concatOrReplace } from "./utils";

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
  id: number;
}
export type Actions = SetConversationAction | AddConversationAction | DelConversationAction;

/* Functions */
export function setConversation(state: ReduxState, action: SetConversationAction) {
  return {
    ...state,
    conversations: action.payload,
  }
}
export function addConversation(state: ReduxState, action: AddConversationAction) {
  return {
    ...state,
    conversations: concatOrReplace(state.conversations, action.payload, "id"),
  };
}
export function delConversation(state: ReduxState, action: DelConversationAction) {
  return {
    ...state,
    conversations: state.conversations.filter(e => e.id !== action.id),
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