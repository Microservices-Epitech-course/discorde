import styled from 'styled-components';

import { FriendList } from '../../../components/friendList/friendList';
import { ConversationList } from '../../../components/conversationList';
import { ServerList } from '../../../components/serverList';

const Flex = styled.div`
  display: flex;
  flex-direction: columns;
  height: 100vh;
`;

const Me = (): JSX.Element => {
  return (
    <Flex>
      <ServerList />
      <ConversationList />
      <FriendList />
    </Flex>
  )
};

export default Me;
