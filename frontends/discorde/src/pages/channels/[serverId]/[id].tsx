import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';

import { ServerList } from 'components/serverList';
import { ChannelList } from 'components/channelList';
import { Conversation } from 'components/conversation/conversation';

const Flex = styled.div`
  display: flex;
  flex-direction: columns;
  height: 100vh;
`;

const Channel = (): JSX.Element => {
  const router = useRouter();
  const { serverId, id } = router.query;

  return (
    <Flex>
      <ServerList />
      <ChannelList />

    </Flex>
  );
};

export default Channel;
