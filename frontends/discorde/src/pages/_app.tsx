/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import { Provider, useDispatch, useSelector } from 'react-redux';

import 'styles/globals.css';

import { ReduxState, useStore } from '../store';
import { getMe } from 'store/api/users';
import { getAllFriendRequest, getFriends, getServersAndConversations } from 'api';

enum Loading {
  NOT_LOADED = 0,
  ME_LOADED = 1,
  LOADED = 2,
  ALL_LOADED = 3,
}

function Loader({Component, pageProps}) {
  const dispatch = useDispatch();
  const ws = useSelector((state: ReduxState) => state.ws);
  const me = useSelector((state: ReduxState) => state.me);
  const [loaded, setLoaded] = useState(Loading.NOT_LOADED);

  const load = async () => {
    if (localStorage.getItem("token")) {
      await getMe(dispatch, ws);
      setLoaded(Loading.ME_LOADED);
    } else {
      localStorage.removeItem("token");
      Router.push('/');
      setLoaded(Loading.LOADED);
    }
  }
  const loadAssets = async () => {
    await getFriends(dispatch, me);
    await getAllFriendRequest(dispatch, me);
    await getServersAndConversations(dispatch);
    setLoaded(Loading.ALL_LOADED)
  }

  useEffect(() => {
    load();
    return () => {
      if (ws)
        ws.close();
    }
  }, []);

  useEffect(() => {
    if (loaded <= Loading.LOADED && me && ws)
      loadAssets();
  }, [loaded, ws, me]);

  return (
    <>
      {loaded >= Loading.LOADED && (
        <Component {...pageProps}/>
      )}
    </>
  )
}

export default function App(props) {
  const store = useStore(props.pageProps.initialReduxState);

  return (
    <>
      <Head>
        <title>Discorde</title>
        <meta charSet="utf-8" />
        <link rel="icon" href="https://placekitten.com/40/40" />
      </Head>

      <Provider store={store}>
        <Loader {...props}/>
      </Provider>
    </>
  );
}
