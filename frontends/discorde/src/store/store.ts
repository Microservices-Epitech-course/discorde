import { useMemo } from 'react';
import { createStore, applyMiddleware, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { ActionTypes, SET_ME, SET_FRIENDS, SET_PENDING } from './actions';
import * as DataModel from './types';

export interface ReduxState {
  me: DataModel.User | null;
  friends: DataModel.User[];
  invites: {
    incoming: DataModel.User[];
    outgoing: DataModel.User[];
  };
}

let store: Store<ReduxState, ActionTypes> | undefined;

const initialState: ReduxState = {
  me: null,
  friends: [],
  invites: {
    incoming: [],
    outgoing: [],
  },
};

const reducer = (state = initialState, action: ActionTypes) => {
  switch (action.type) {
    case SET_ME:
      return {
        ...state,
        me: action.payload,
      };
    case SET_FRIENDS:
      return {
        ...state,
        friends: action.payload,
      };
    case SET_PENDING:
      return {
        ...state,
        invites: action.payload,
      };
    default:
      return state;
  }
};

function initStore(preloadedState = initialState) {
  return createStore(reducer, preloadedState, composeWithDevTools(applyMiddleware()));
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
