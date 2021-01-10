import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';

import { ServerList } from 'components/serverList';
import { ChannelList } from 'components/channel/channelList';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxState } from 'store';
import { loadMessages } from 'api/servers';
import ChannelDisplay from 'components/channel';

const Flex = styled.div`
  display: flex;
  flex-direction: columns;
  height: 100vh;
`;

const Channel = (): JSX.Element => {
  const router = useRouter();
  const { serverId, id } = router.query;
  const dispatch = useDispatch();
  const server = useSelector((state: ReduxState) => state.servers.find((e) => e.id === Number(serverId)));
  const channelIndex = server?.channels?.findIndex((e) => e.id === Number(id));
  const [_, setLoaded] = useState(false);

  const load = async () => {
    if (channelIndex !== -1 && channelIndex !== undefined) {
      const response = await loadMessages(dispatch, server.channels[channelIndex].id);
      if (response.success) {
        setLoaded(true);
      }
    }
  }

  useEffect(() => {
    load();
  }, [id, server]);

  return (
    <Flex>
      <ServerList />
      <ChannelList />
      {
        server?.channels?.[channelIndex]?.messages && (
          <ChannelDisplay
            server={server}
            channelId={Number(id)}
          />
        )
      }
    </Flex>
  );
};

export default Channel;
