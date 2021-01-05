const axios = require('axios');

interface GetUserParams {
  id: string,
};

export const getUser = async (params: GetUserParams) => {
  try {
    const response = await axios.get(
      `https://api-discorde-jbdm.herokuapp.com/users/${params.id}`,
      { headers: { "authorization": localStorage.getItem('token') }},
    );
    return true;
  } catch (error) {
    return error.response;
  }
}

export const getFriends = async () => {
  try {
    const response = await axios.get(
      'https://api-discorde-jbdm.herokuapp.com/users/@me/friends',
      { headers: { "authorization": localStorage.getItem('token') }},
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

export const getAllFriendRequest = async () => {
  const getOutgoing = 'https://api-discorde-jbdm.herokuapp.com/users/@me/invites/sent';
  const getIncoming = 'https://api-discorde-jbdm.herokuapp.com/users/@me/invites/received';

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
    let usersList = [];

    const pushRequests = (array, type) => {
      array.map(e => {
        usersList.push({
          ...e,
          type,
        });
      });
    }

    pushRequests(responseIncoming.data, 'incoming');
    pushRequests(responseOutgoing.data, 'outgoing');


    return usersList;
  } catch (error) {
    return error.response.data;
  }
}

interface ModifyFriendRequestParams {
  id: string,
  action: string,
};

export const modifyFriendRequest = async (params: ModifyFriendRequestParams) => {
  if (params.action === 'deny') {
    try {
      const response = await axios.delete(
        `https://api-discorde-jbdm.herokuapp.com/users/@me/relations/${params.id}`,
        { headers: { "authorization": localStorage.getItem('token') }},
      );

      return true;
    } catch (error) {
      return error.response;
    }
  }
  else {
    try {
      const response = await axios.patch(
        `https://api-discorde-jbdm.herokuapp.com/users/@me/relations/${params.id}/${params.action}`,
        {},
        { headers: { "authorization": localStorage.getItem('token') }},
      );
      return true;
    } catch (error) {
      return error.response;
    }
  }


}

export const getBlocked = async () => {
  try {
    const response = await axios.get(
      'https://api-discorde-jbdm.herokuapp.com/users/@me/blocked',
      { headers: { "authorization": localStorage.getItem('token') }},
    );

    return response.data;
  } catch (error) {
    return error.response.data;
  }
}

interface AddfriendParams {
  username: string,
};

export const addFriend = async (params: AddfriendParams) => {
  try {
    const response = await axios.post(
      `https://api-discorde-jbdm.herokuapp.com/users/@me/relations/username/${params.username}`,
      {},
      { headers: { "authorization": localStorage.getItem('token') }},
    );
    return true;
  } catch (error) {
    return error.response.data;
  }
}
