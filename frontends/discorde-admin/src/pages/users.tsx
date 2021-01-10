import React from 'react';
import { NextPage } from 'next';
import Page from 'components/Page';

const Users: NextPage = (): JSX.Element => (
  <Page protectedResources title="Users">
    <h1>Users</h1>
  </Page>
);

export default Users;
