import { subscribe, unsubscribe } from "api/websocket";
import { Server } from "store/types";
import { ReduxState } from "..";
import { cleanServer, concatOrReplace, multiConcatOrReplace, removeDuplicates } from "./utils";

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
  payload: number;
}

export type Actions = SetServerAction | AddServerAction | DelServerAction;

/* Functions */
export function setServer(state: ReduxState, action: SetServerAction) {
  const users = action.payload.map((e) => e.members.map((e2) => e2.user)).flat();
  
  action.payload.forEach((e) => {
    subscribe(state.ws, "server", e.id);
    e.channels.forEach((e2) => {
      subscribe(state.ws, "channel", e2.id);
    })
  });
  users.forEach((e) => subscribe(state.ws, "user", e.id));
  return {
    ...state,
    servers: action.payload.map((s) => cleanServer(s)),
    users: multiConcatOrReplace(state.users, removeDuplicates(users, "id"), "id"),
  }
}
export function addServer(state: ReduxState, action: AddServerAction) {
  const users = action.payload.members.map((e) => e.user).filter((e) => e !== undefined);

  subscribe(state.ws, "server", action.payload.id);
  action.payload.channels.forEach((e) => {
    subscribe(state.ws, "channel", e.id);
  })
  users.forEach((e) => subscribe(state.ws, "user", e.id));
  return {
    ...state,
    servers: concatOrReplace(state.servers, cleanServer(action.payload), "id"),
    users: multiConcatOrReplace(state.users, removeDuplicates(users, "id"), "id"),
  };
}
export function delServer(state: ReduxState, action: DelServerAction) {
  const server = state.servers.find((e) => e.id === action.payload);

  unsubscribe(state.ws, "server", server.id);
  server.channels.forEach((e) => unsubscribe(state.ws, "channel", e.id));  
  return {
    ...state,
    servers: state.servers.filter(e => e.id !== action.payload),
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
    function: delServer,
  },
];