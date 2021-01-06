import { ReduxState } from "..";
import { maybeConcatId } from "./utils";

/* Actions */
export const SET_FRIENDS = 'SET_FRIENDS';
export const ADD_FRIENDS = 'ADD_FRIENDS';
export const DEL_FRIENDS = 'DEL_FRIENDS';

/* Types */
export interface SetFriendsAction {
  type: typeof SET_FRIENDS;
  payload: number[];
}
export interface AddFriendsAction {
  type: typeof ADD_FRIENDS;
  payload: number;
}
export interface DelFriendsAction {
  type: typeof DEL_FRIENDS;
  id: number;
}
export type Actions = SetFriendsAction | AddFriendsAction | DelFriendsAction;

/* Functions */
export function setFriends(state: ReduxState, action: SetFriendsAction) {
  return {
    ...state,
    friends: action.payload,
  }
}
export function addFriends(state: ReduxState, action: AddFriendsAction) {
  return {
    ...state,
    friends: maybeConcatId(state.friends, action.payload),
  };
}
export function delFriends(state: ReduxState, action: DelFriendsAction) {
  return {
    ...state,
    friends: state.friends.filter(e => e !== action.id),
  };
}

/* Dispatches */
export const dispatches = [
  {
    action: SET_FRIENDS,
    function: setFriends,
  },
  {
    action: ADD_FRIENDS,
    function: addFriends,
  },
  {
    action: DEL_FRIENDS,
    function: delFriends
  }
];