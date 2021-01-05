const axios = require('axios');

interface GetServersParams {
  id: string,
};

export const getServers = async (params: GetServersParams) => {
  try {
    const response = await axios.get(
      `https://api-discorde-jbdm.herokuapps.com/users/@me/conversations`,
      { headers: { "authorization": localStorage.getItem('token') }},
    );
    return true;
  } catch (error) {
    return error.response;
  }
}
