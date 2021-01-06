import { Server } from "store/types";
import { ReduxState } from "..";
import { concatOrReplace } from "./utils";

/* Actions */
export const SET_SERVER = 'SET_SERVER';
export const ADD_SERVER = 'ADD_SERVER';
export const DEL_SERVER = 'DEL_SERVER';

/* Types */
export interface SetServerAction {
  type: typeof SET_SERVER;
  payload: Server[];
}
export interface AddServerAction {
  type: typeof ADD_SERVER;
  payload: Server;
}
export interface DelServerAction {
  type: typeof DEL_SERVER;
  id: number;
}
export type Actions = SetServerAction | AddServerAction | DelServerAction;

/* Functions */
export function setServer(state: ReduxState, action: SetServerAction) {
  return {
    ...state,
    servers: action.payload,
  }
}
export function addServer(state: ReduxState, action: AddServerAction) {
  return {
    ...state,
    servers: concatOrReplace(state.servers, action.payload, "id"),
  };
}
export function delServer(state: ReduxState, action: DelServerAction) {
  return {
    ...state,
    servers: state.servers.filter(e => e.id !== action.id),
  };
}

/* Dispatches */
export const dispatches = [
  {
    action: SET_SERVER,
    function: setServer,
  },
  {
    action: ADD_SERVER,
    function: addServer,
  },
  {
    action: DEL_SERVER,
    function: delServer
  }
];