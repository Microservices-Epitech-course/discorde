/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import { Provider, useDispatch, useSelector } from 'react-redux';

import 'styles/globals.css';

import { ReduxState, useStore } from '../store';
import { getMe } from 'store/api/users';

function Loader({Component, pageProps}) {
  const dispatch = useDispatch();
  const ws = useSelector((state: ReduxState) => state.ws);
  const [loaded, setLoaded] = useState(false);

  const load = async () => {
    const initialPath = Router.asPath;
    if (localStorage.getItem("token")) {
      await getMe(dispatch, ws, () => {
        localStorage.removeItem("token");
        Router.push('/');
      }, () => {
        if (initialPath === '/')
          Router.push('/channels/@me');
      });
    }
    setLoaded(true);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      {loaded && (
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
