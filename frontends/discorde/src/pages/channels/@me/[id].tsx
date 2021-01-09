import { useRouter } from 'next/router';
import styled from 'styled-components';

import { ServerList } from '../../../components/serverList';
import { ConversationList } from '../../../components/conversationList';
import { Conversation } from '../../../components/conversation/conversation';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadMessages } from 'api/servers';
import { ReduxState } from 'store';

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

  const load = async () => {
    if (conversation?.channels?.[0])
      await loadMessages(dispatch, conversation.channels[0].id);
  }

  useEffect(() => {
    load();
  }, [id, conversation?.channels?.[0]]);

  return (
    <Flex>
      <ServerList />
      <ConversationList />
      {
        conversation && (
          <Conversation id={Number(id)} conversation={conversation}/>
        )
      }
    </Flex>
  );
};

export default PrivateMessage;
