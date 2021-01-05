import { User, Relation } from './types';

export const SET_ME = 'SET_ME';
export const SET_FRIENDS = 'SET_FRIENDS';
export const SET_PENDING = 'SET_PENDING';

interface SetMeAction {
  type: typeof SET_ME;
  payload: User;
}
interface SetFriendsAction {
  type: typeof SET_FRIENDS;
  payload: User[];
}
interface SetPendingsAction {
  type: typeof SET_PENDING;
  payload: Relation[];
}

export type ActionTypes = SetMeAction | SetFriendsAction | SetPendingsAction;
