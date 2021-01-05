import { User } from './types';

export const SET_ME = 'SET_ME';
export const SET_FRIENDS = 'SET_FRIENDS';

interface SetMeAction {
  type: typeof SET_ME;
  payload: User;
}
interface SetFriendsAction {
  type: typeof SET_FRIENDS;
  payload: User[];
}
interface SetPendingsAction {
  type: typeof SET_FRIENDS;
  payload: {
    incoming: User[];
    outgoin: User[];
  };
}

export type ActionTypes = SetMeAction | SetFriendsAction | SetPendingsAction;
