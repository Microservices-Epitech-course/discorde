import { ReduxState } from "..";

/* Actions */
export const SET_WS = 'SET_WS';

/* Types */
export interface SetWSAction {
  type: typeof SET_WS;
  payload: WebSocket;
}

export type Actions = SetWSAction;

/* Functions */
export function setWS(state: ReduxState, action: SetWSAction) {
  return {
    ...state,
    ws: action.payload,
  };
}

/* Dispatches */
export const dispatches = [
  {
    action: SET_WS,
    function: setWS,
  },
];