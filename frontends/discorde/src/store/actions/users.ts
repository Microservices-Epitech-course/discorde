import { subscribe } from "api/websocket";
import { ReduxState } from "..";
import * as DataModel from '../types';
import { concatOrReplace, multiConcatOrReplace } from "./utils";

/* Actions */
export const SET_ME = 'SET_ME';
export const SET_USER = 'SET_USER';
export const ADD_USER = 'ADD_USER';
export const MULTI_ADD_USER = 'MULTI_ADD_USER';
export const DEL_USER = 'DEL_USER';

/* Types */
export interface SetMeAction {
  type: typeof SET_ME;
  payload: DataModel.User;
}
export interface SetUserAction {
  type: typeof SET_USER;
  payload: DataModel.User[];
}
export interface AddUserAction {
  type: typeof ADD_USER;
  payload: DataModel.User;
}
export interface MultiAddUserAction {
  type: typeof MULTI_ADD_USER;
  payload: DataModel.User[];
}
export interface DelUserAction {
  type: typeof DEL_USER;
  payload: number
}

export type Actions = SetMeAction | SetUserAction | AddUserAction | MultiAddUserAction | DelUserAction;

/* Functions */
export function setMe(state: ReduxState, action: SetMeAction) {
  return {
    ...state,
    me: action.payload,
  };
}
export function setUser(state: ReduxState, action: SetUserAction) {
  action.payload.map((e) => subscribe(state.ws, "user", e.id));
  return {
    ...state,
    users: action.payload,
  };
}
export function addUser(state: ReduxState, action: AddUserAction) {
  subscribe(state.ws, "user", action.payload.id);
  return {
    ...state,
    users: concatOrReplace(state.users, action.payload, "id"),
  };
}
export function multiAddUser(state: ReduxState, action: MultiAddUserAction) {
  action.payload.map((e) => subscribe(state.ws, "user", e.id));
  return {
    ...state,
    users: multiConcatOrReplace(state.users, action.payload, "id"),
  };
}
export function delUser(state: ReduxState, action: DelUserAction) {
  subscribe(state.ws, "user", action.payload);
  return {
    ...state,
    users: state.users.filter(e => e.id !== action.payload),
  };
}

/* Dispatches */
export const dispatches = [
  {
    action: SET_ME,
    function: setMe,
  },
  {
    action: SET_USER,
    function: setUser,
  },
  {
    action: ADD_USER,
    function: addUser,
  },
  {
    action: MULTI_ADD_USER,
    function: multiAddUser,
  },
  {
    action: DEL_USER,
    function: delUser,
  }
];