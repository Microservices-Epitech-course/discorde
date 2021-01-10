import React from 'react';
import { NextPage } from 'next';
import Page from 'components/Page';
import ServersSelector from 'components/Servers';

const Servers: NextPage = (): JSX.Element => (
  <Page protectedResources title="Servers">
    <ServersSelector />
  </Page>
);

export default Servers;
