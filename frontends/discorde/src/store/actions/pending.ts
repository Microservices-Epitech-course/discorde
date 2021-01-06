import { ReduxState } from '..';
import * as DataModel from '../types';
import { concatOrReplace } from './utils';

/* Actions */
export const SET_PENDING = 'SET_PENDING';
export const ADD_PENDING = 'ADD_PENDING';
export const DEL_PENDING = 'DEL_PENDING';

/* Types */
export interface SetPendingsAction {
  type: typeof SET_PENDING;
  payload: DataModel.Pending[];
}
export interface AddPendingsAction {
  type: typeof ADD_PENDING;
  payload: DataModel.Pending;
}
export interface DelPendingsAction {
  type: typeof DEL_PENDING;
  payload: number;
}
export type Actions = SetPendingsAction | AddPendingsAction | DelPendingsAction;

/* Functions */
export function setPendings(state: ReduxState, action: SetPendingsAction) {
  return {
    ...state,
    invites: action.payload,
  };
}
export function addPendings(state: ReduxState, action: AddPendingsAction) {
  return {
    ...state,
    invites: concatOrReplace(state.invites, action.payload, "relationId")
  };
}
export function delPendings(state: ReduxState, action: DelPendingsAction) {
  return {
    ...state,
    invites: state.invites.filter(e => e.relationId !== action.payload)
  };
}


/* Dispatches */
export const dispatches = [
  {
    action: SET_PENDING,
    function: setPendings,
  },
  {
    action: ADD_PENDING,
    function: addPendings,
  },
  {
    action: DEL_PENDING,
    function: delPendings,
  },
];