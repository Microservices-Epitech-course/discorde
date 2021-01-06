import * as Api from "api";
import { Dispatch } from "redux";
import * as Actions from "store/actions";

export const getMe = async(dispatch: Dispatch<any>, onError?: (any) => void, onSuccess?: (any) => void) => {
  const me = await Api.getUser({id: "@me"});
  
  if (me?.error) {
    if (onError)
      onError(me);
  } else {
    dispatch({
      type: Actions.SET_ME,
      payload: me
    });
    if (onSuccess)
      onSuccess(me);
  }
}