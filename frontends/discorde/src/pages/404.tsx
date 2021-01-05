import React from 'react';
import { NextPage } from 'next';

import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { ReduxState } from 'store/store';
import { SET_ME } from 'store/actions';

const TestComp = (): JSX.Element => {
  const user = useSelector((state: ReduxState) => state.me);
  const dispatch = useDispatch();
  const increment = () =>
    dispatch({
      type: SET_ME,
      payload: {
        username: 'Henri',
      },
    });

  return (
    <div>
      <h3>Test</h3>
      <h3>User: {user ? user.username : 'N/A'}</h3>
      <a onClick={increment}>Click here</a>
      <Link href="/">to login</Link>
    </div>
  );
};

const Error: NextPage = (): JSX.Element => (
  <div>
    <h1>404</h1>
    <h2>This page could not be found</h2>
    <TestComp />
  </div>
);

export default Error;
