/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react';
import Head from 'next/head';
import { Provider } from 'react-redux';
import { useStore } from '../store/store';
import 'styles/globals.css';

export default function App({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState);

  return (
    <>
      <Head>
        <title>Discorde</title>
        <meta charSet="utf-8" />
        <link rel="icon" href="https://placekitten.com/40/40" />
      </Head>

      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}
