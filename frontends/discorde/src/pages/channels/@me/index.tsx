import styled from 'styled-components';

import { FriendList } from '../../../components/friendList/friendList';
import { ConversationList } from '../../../components/conversationList';
import { ServerList } from '../../../components/serverList';
import { useSelector } from 'react-redux';
import { ReduxState } from 'store/store';

const Flex = styled.div`
  display: flex;
  flex-direction: columns;
  height: 100vh;
`;

const Me = (): JSX.Element => {
  const user = useSelector((state: ReduxState) => state.me);

  return (
    <Flex>
      Hello {user?.username} !
      <ServerList />
      <ConversationList />
      <FriendList />
    </Flex>
  )
};

export default Me;
