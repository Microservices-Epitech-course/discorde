import React from 'react';
import { NextPage } from 'next';
import Page from 'components/Page';
import UsersSelector from 'components/Users';

const Users: NextPage = (): JSX.Element => {
  return (
    <Page protectedResources title="Users">
      <UsersSelector />
    </Page>
  );
};

export default Users;
