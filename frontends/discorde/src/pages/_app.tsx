/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useEffect } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { ReduxState, useStore } from '../store/store';
import 'styles/globals.css';
import { getMe } from 'store/api/users';

function Logger({Component, pageProps}) {
  const dispatch = useDispatch();
  const user = useSelector((state: ReduxState) => state.me);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getMe(dispatch, () => {
        localStorage.removeItem("token");
        Router.push('/');
      });
    }
  }, []);

  return (
    <>
      <Component {...pageProps}/>
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
        <Logger {...props}/>
      </Provider>
    </>
  );
}
