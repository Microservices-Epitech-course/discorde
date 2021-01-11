import { useEffect, useState } from 'react';
import { ReduxState } from 'store';
import styled from 'styled-components';
import Router, { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import { ServerList } from 'components/serverList';
import { ConversationList } from 'components/conversation/conversationList';
import ChannelDisplay from 'components/channel';
import { loadMessages } from 'api/servers';

const Flex = styled.div`
  display: flex;
  flex-direction: columns;
  height: 100vh;
`;

const PrivateMessage = (): JSX.Element => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const conversation = useSelector((state: ReduxState) => state.conversations.find((e) => e.id === Number(id)));
  const [_, setLoaded] = useState(false);

  const load = async () => {
    if (conversation?.channels?.[0]) {
      setLoaded(false);
      const response = await loadMessages(dispatch, conversation.channels[0].id);
      if (response.success) {
        setLoaded(true);
      }
    }
  }

  useEffect(() => {
    load();

    if (!conversation) {
      Router.push('/channels/@me');
    }
  }, [id, conversation?.channels?.[0]]);

  return (
    <Flex>
      <ServerList />
      <ConversationList />
      {
        conversation?.channels?.[0].messages && (
          <ChannelDisplay
            server={conversation}
            channelId={conversation.channels[0].id}
          />
        )
      }
    </Flex>
  );
};

export default PrivateMessage;
