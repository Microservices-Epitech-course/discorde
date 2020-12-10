/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import 'styles/globals.css';

class MyApp extends App {
  render(): JSX.Element {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Head>
          <title>Discorde</title>
          <meta charSet="utf-8" />
          <link rel="icon" href="https://placekitten.com/40/40" />
        </Head>

        <Component {...pageProps} />
      </>
    );
  }
}

export default MyApp;
