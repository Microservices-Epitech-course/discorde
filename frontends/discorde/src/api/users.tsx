import axios from 'axios';
import { Dispatch } from 'react';
import { ADD_FRIENDS, SET_FRIENDS } from 'store/actions/friends';
import { ADD_PENDING, DEL_PENDING, SET_PENDING } from 'store/actions/pending';
import { ADD_USER, MULTI_ADD_USER } from 'store/actions/users';
import { Relation, RequestType, User } from 'store/types';
import * as Servers from './servers';

export interface GetUserParams {
  id: string,
};

export const getUser = async (dispatch: Dispatch<any>, params: GetUserParams) => {
  try {
    const response = await axios.get(
      `${Servers.jbdm}/users/${params.id}`,
      { headers: { "authorization": localStorage.getItem('token') }},
    );
    dispatch({
      type: ADD_USER,
      payload: response.data
    });

    return {success: true, data: response.data};
  } catch (error) {
    return {success: true, data: error.response};
  }
}

export const getFriends = async (dispatch: Dispatch<any>, me: User) => {
  try {
    const response = await axios.get(
      `${Servers.jbdm}/users/@me/friends`,
      { headers: { "authorization": localStorage.getItem('token') }},
    );

    const friends: Array<User> = response.data.map((e: Relation) => e.users.find((e2) => e2.id !== me.id));
    dispatch({
      type: SET_FRIENDS,
      payload: friends.map((e) => e.id),
    });
    dispatch({
      type: MULTI_ADD_USER,
      payload: friends,
    })

    return {success: true, data: response.data};
  } catch (error) {
    return {success: false, data: error.response};
  }
}

export const getAllFriendRequest = async (dispatch: Dispatch<any>, me: User) => {
  const getOutgoing = `${Servers.jbdm}/users/@me/invites/sent`;
  const getIncoming = `${Servers.jbdm}/users/@me/invites/received`;

  const requestOutgoing = axios.get(
    getOutgoing,
    { headers: { "authorization": localStorage.getItem('token') }},
  );
  const requestIncoming = axios.get(
    getIncoming,
    { headers: { "authorization": localStorage.getItem('token') }},
  );

  try {
    const [responseOutgoing, responseIncoming] = await axios.all([
      requestOutgoing,
      requestIncoming
    ]);

    const outgoingUsers = responseIncoming.data.map((e: Relation) => (
      {
        user: e.users.find((e2) => e2.id !== me.id),
        type: RequestType.OUTGOING,
        relationId: e.id
      }
    ));
    const incomingUsers = responseOutgoing.data.map((e: Relation) => (
      {
        user: e.users.find((e2) => e2.id !== me.id),
        type: RequestType.INCOMING,
        relationId: e.id
      }
    ));
    const pendings = outgoingUsers.concat(incomingUsers);

    dispatch({
      type: MULTI_ADD_USER,
      payload: pendings.map((e) => e.user)
    });
    dispatch({
      type: SET_PENDING,
      payload: pendings.map((e) => ({userId: e.user.id, request: e.type, relationId: e.relationId}))
    });

    return {success: true, data: pendings};
  } catch (error) {
    return {success: false, data: error.response};
  }
}

interface ModifyFriendRequestParams {
  id: string,
  action: string,
  relationId: number
};

export const modifyFriendRequest = async (dispatch: Dispatch<any>, me: User, params: ModifyFriendRequestParams) => {
  if (params.action === 'deny') {
    try {
      const response = await axios.delete(
        `${Servers.jbdm}/users/@me/relations/${params.id}`,
        { headers: { "authorization": localStorage.getItem('token') }},
      );

      dispatch({
        type: DEL_PENDING,
        payload: params.relationId
      });  
      return {success: true, data: response.data};
    } catch (error) {
      return {success: false, data: error.response};
    }
  } else {
    try {
      const response = await axios.patch(
        `${Servers.jbdm}/users/@me/relations/${params.id}/${params.action}`,
        {},
        { headers: { "authorization": localStorage.getItem('token') }},
      );
      if (params.action === "accept") {
        const actionUser = response.data.users.find((e) => e.id !== me.id);
        dispatch({
          type: DEL_PENDING,
          payload: params.relationId
        });  
        dispatch({
          type: ADD_USER,
          payload: actionUser,
        });
        dispatch({
          type: ADD_FRIENDS,
          payload: actionUser.id
        });
      }
      return {success: true, data: response.data};
    } catch (error) {
      return {success: false, data: error.response};
    }
  }
}

export const getBlocked = async () => {
  try {
    const response = await axios.get(
      `${Servers.jbdm}/users/@me/blocked`,
      { headers: { "authorization": localStorage.getItem('token') }},
    );

    return {success: true, data: response.data};
  } catch (error) {
    return {success: false, data: error.response.data};
  }
}

interface AddfriendParams {
  username: string,
};

export const addFriend = async (dispatch: Dispatch<any>, params: AddfriendParams, me: User) => {
  try {
    const response = await axios.post(
      `${Servers.jbdm}/users/@me/relations/username/${params.username}`,
      {},
      { headers: { "authorization": localStorage.getItem('token') }},
    );

    const actionUser = response.data.users.find(e => e.id !== me?.id);

    dispatch({
      type: ADD_USER,
      payload: actionUser,
    });
    dispatch({
      type: ADD_PENDING,
      payload: ({
        userId: actionUser.id,
        relationId: response.data.id,
        request: RequestType.OUTGOING
      })
    });

    return {success: true, data: response};
  } catch (error) {
    return { success: false, data: error.response.data };
  }
}
