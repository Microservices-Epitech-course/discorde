import { getUser } from "api";
import { Dispatch } from "redux";
import * as Actions from "store/actions";

export const getMe = async(dispatch: Dispatch<any>, onError?: (any) => void) => {
  const me = await getUser({id: "@me"});
  
  if (me?.error) {
    onError(me);
  } else {
    dispatch({
      type: Actions.SET_ME,
      payload: me
    });
  }
}