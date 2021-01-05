import styled from 'styled-components';

import { FriendList } from '../../../components/friendList';
import { ConversationList } from '../../../components/conversationList';
import { ServerList } from '../../../components/serverList';

const Container = styled.div`

`;

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
