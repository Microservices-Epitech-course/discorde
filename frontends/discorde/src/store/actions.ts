import { User, Relation } from './types';

export const SET_ME = 'SET_ME';
export const SET_FRIENDS = 'SET_FRIENDS';
export const ADD_FRIENDS = 'ADD_FRIENDS';
export const DEL_FRIENDS = 'DEL_FRIENDS';
export const SET_PENDING = 'SET_PENDING';
export const ADD_PENDING = 'ADD_PENDING';
export const DEL_PENDING = 'DEL_PENDING';

interface SetMeAction {
  type: typeof SET_ME;
  payload: User;
}
interface SetFriendsAction {
  type: typeof SET_FRIENDS;
  payload: User[];
}
interface AddFriendsAction {
  type: typeof ADD_FRIENDS;
  payload: User[];
}
interface DelFriendsAction {
  type: typeof DEL_FRIENDS;
  id: number;
}
interface SetPendingsAction {
  type: typeof SET_PENDING;
  payload: Relation[];
}
interface AddPendingsAction {
  type: typeof ADD_PENDING;
  payload: Relation[];
}
interface DelPendingsAction {
  type: typeof DEL_PENDING;
  id: number;
}

export type ActionTypes = 
  SetMeAction |
  SetFriendsAction | AddFriendsAction | DelFriendsAction |
  SetPendingsAction | AddPendingsAction | DelPendingsAction;
