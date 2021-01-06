import axios from 'axios';
import { Dispatch } from 'react';
import { ADD_SERVER } from 'store/actions/server';

// export const chaussettes = "ws://localhost:3006";
// export const hermes = "http://localhost:3007";
// export const jbdm = "http://localhost:3001";
// export const kamoulox = "http://localhost:3002";
// export const marine = "http://localhost:3003";
// export const sven = "http://localhost:3004";
// export const yahoo = "http://localhost:3005";

export const chaussettes = "wss://api-discorde-chaussettes.herokuapp.com";
export const hermes = "https://api-discorde-hermes.herokuapp.com";
export const jbdm = "https://api-discorde-jbdm.herokuapp.com";
export const kamoulox = "https://api-discorde-kamoulox.herokuapp.com";
export const marine = "https://api-discorde-marine.herokuapp.com";
export const sven = "https://api-discorde-sven.herokuapp.com";
export const yahoo = "https://api-discorde-yahoo.herokuapp.com";

interface CreateServerParams {
  name: string,
};

export const createServer = async (dispatch: Dispatch<any>, params: CreateServerParams) => {
  try {
    const response = await axios.post(
      `${marine}/servers`,
      { name: params.name },
      { headers: { "authorization": localStorage.getItem('token') }},
    );

    dispatch({
      type: ADD_SERVER,
      payload: response.data,
    });
    return { success: true, data: response };
  } catch (error) {
    console.error(error);
    return { success: false, data: error.response.data };
  }
}
