import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { ReduxState } from 'store';

import { getFriends, getAllFriendRequest } from 'api/users';

import { getServersAndConversations } from 'api/conversations';
import { FriendList } from 'components/friendList/friendList';
import { ConversationList } from 'components/conversationList';
import { ServerList } from 'components/serverList';

const Flex = styled.div`
  display: flex;
  flex-direction: columns;
  height: 100vh;
`;

const Me = (): JSX.Element => {
  const me = useSelector((state: ReduxState) => state.me);
  const serverList = useSelector((state: ReduxState) => state.servers);
  const dispatch = useDispatch();

  const load = async () => {
    await getFriends(dispatch, me);
    await getAllFriendRequest(dispatch, me);
    await getServersAndConversations(dispatch);
  }
  useEffect(() => {
    load();
  }, []);

  return (
    <Flex>
      <ServerList />
      <ConversationList />
      <FriendList />
    </Flex>
  )
};

export default Me;
