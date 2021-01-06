import { useMemo } from 'react';
import { createStore, applyMiddleware, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import * as Actions from './actions';
import { ActionTypes } from './actions';
import * as DataModel from './types';

export interface ReduxState {
  me: DataModel.User | null;
  friends: DataModel.User[];
  invites: DataModel.Relation[];
}

let store: Store<ReduxState, ActionTypes> | undefined;

const initialState: ReduxState = {
  me: null,
  friends: [],
  invites: [],
};

const reducer = (state = initialState, action: ActionTypes) => {
  switch (action.type) {
    case Actions.SET_ME:
      return {
        ...state,
        me: action.payload,
      };

    case Actions.SET_FRIENDS:
      return {
        ...state,
        friends: action.payload.sort((a, b) => a.username.localeCompare(b.username)),
      };
    case Actions.ADD_FRIENDS:
      return {
        ...state,
        friends: state.friends.concat(action.payload).sort((a, b) => a.username.localeCompare(b.username)),
      };
    case Actions.DEL_FRIENDS:
      return {
        ...state,
        friends: state.friends.filter(e => e.id !== action.id),
      };

    case Actions.SET_PENDING:
      return {
        ...state,
        invites: action.payload,
      };
    case Actions.ADD_PENDING:
      return {
        ...state,
        invites: state.invites.concat(action.payload)
      };
    case Actions.DEL_PENDING:
      return {
        ...state,
        invites: state.invites.filter(e => e.id !== action.id)
      };
    default:
      return state;
  }
};

function initStore(preloadedState = initialState): Store<ReduxState, ActionTypes> {
  return createStore(reducer, preloadedState, composeWithDevTools(applyMiddleware())) as Store<ReduxState, ActionTypes>;
}

export const initializeStore = (preloadedState: ReduxState): Store<ReduxState, ActionTypes> => {
  let newStore = store ?? initStore(preloadedState);

  if (preloadedState && store) {
    newStore = initStore({
      ...store.getState(),
      ...preloadedState,
    });
    store = undefined;
  }

  if (typeof window === 'undefined') return newStore;
  if (!store) store = newStore;

  return newStore;
};

export function useStore(newInitialState: ReduxState): Store<ReduxState, ActionTypes> {
  const newStore = useMemo(() => initializeStore(newInitialState), [newInitialState]);
  return newStore;
}
