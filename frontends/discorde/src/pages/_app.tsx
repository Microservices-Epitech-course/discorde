/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import { Provider, useDispatch } from 'react-redux';

import 'styles/globals.css';

import { useStore } from '../store/store';
import { getMe } from 'store/api/users';

function Loader({Component, pageProps}) {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);

  const load = async () => {
    const initialPath = Router.asPath;
    if (localStorage.getItem("token")) {
      await getMe(dispatch, () => {
        localStorage.removeItem("token");
        Router.push('/');
      }, () => {
        Router.push(initialPath === '/' ? 'channels/@me' : initialPath);
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
