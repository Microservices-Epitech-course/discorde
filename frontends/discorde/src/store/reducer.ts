import { ReduxState } from 'store';
import * as Friends from './actions/friends';
import * as Users from './actions/users';
import * as WS from './actions/ws';
import * as Pending from './actions/pending';
import * as Server from './actions/server';
import * as Conversation from './actions/conversation';

export type ActionTypes = 
  WS.Actions |
  Users.Actions |
  Friends.Actions |
  Pending.Actions |
  Server.Actions |
  Conversation.Actions;

interface Dispatch {
  action: string,
  function: (state: ReduxState, action: ActionTypes) => ReduxState
};

const allDispatches: Array<Dispatch> = [
  WS.dispatches,
  Users.dispatches,
  Friends.dispatches,
  Pending.dispatches,
  Server.dispatches,
  Conversation.dispatches,
].flat();

export function reducer(state: ReduxState, action: ActionTypes) {
  const dispatchAction = allDispatches.find((e) => e.action === action.type);

  if (dispatchAction)
    return dispatchAction.function(state, action);
  else
    return state;
}