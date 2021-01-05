const axios = require('axios');

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

export const getPendingFriends = async () => {
  try {
    const response = await axios.get(
      'https://api-discorde-jbdm.herokuapp.com/users/@me/invites/sent',
      { headers: { "authorization": localStorage.getItem('token') }},
    );
    return response.data;
  } catch (error) {
    return error.response.data;
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
    console.log(localStorage.getItem('token'));
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
