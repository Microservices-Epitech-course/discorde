import React from 'react';
import styled from 'styled-components';
import { FriendList } from 'components/friendList/friendList';
import { ConversationList } from 'components/conversation/conversationList';
import { ServerList } from 'components/serverList';

const Flex = styled.div`
  display: flex;
  flex-direction: columns;
  height: 100vh;
`;

const Me = (): JSX.Element => {
  return (
    <Flex>
      <ServerList meSelected={true} />
      <ConversationList />
      <FriendList />
    </Flex>
  )
};

export default Me;
