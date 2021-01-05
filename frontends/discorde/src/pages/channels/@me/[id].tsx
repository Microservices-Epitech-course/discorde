import { useRouter } from 'next/router';
import styled from 'styled-components';

import { ServerList } from '../../../components/serverList';
import { ConversationList } from '../../../components/conversationList';
import { Conversation } from '../../../components/conversation/conversation';

const Flex = styled.div`
  display: flex;
  flex-direction: columns;
  height: 100vh;
`;

const PrivateMessage = (): JSX.Element => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Flex>
      <ServerList />
      <ConversationList />
      <Conversation />
    </Flex>
  );
};

export default PrivateMessage;
