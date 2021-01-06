import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { ReduxState } from 'store';

import { getFriends, getAllFriendRequest } from 'api/users';

import { getUserFromId, getUsersFromIds } from 'store/utils';
import { getServersAndConversations } from 'api/conversations';
import { FriendList } from 'components/friendList/friendList';
import { ConversationList } from 'components/conversationList';
import { ServerList } from 'components/serverList';
import { SET_SERVER } from 'store/actions/server';
import { SET_CONVERSATION } from 'store/actions/conversation';

const Flex = styled.div`
  display: flex;
  flex-direction: columns;
  height: 100vh;
`;

const Me = (): JSX.Element => {
  const state = useSelector((state: ReduxState) => state);
  const me = useSelector((state: ReduxState) => state.me);
  const conversationList = useSelector((state: ReduxState) => state.conversations);
  const serverList = useSelector((state: ReduxState) => state.servers);
  const friendList = useSelector((state: ReduxState) => getUsersFromIds(state, state.friends));
  const pendingList = useSelector((state: ReduxState) => state.invites.map((e) => ({...getUserFromId(state, e.userId), ...e})));
  const dispatch = useDispatch();

  const load = async () => {
    await getFriends(dispatch, me);
    await getAllFriendRequest(dispatch, me);
    const resultGetServersAndConversations = await getServersAndConversations();
    const allServers = resultGetServersAndConversations.filter(e => e.server.type === 'server');
    const allConversations = resultGetServersAndConversations.filter(e => e.server.type === 'conversation');

    dispatch({
      type: SET_SERVER,
      payload: allServers
    });
    dispatch({
      type: SET_CONVERSATION,
      payload: allConversations
    });
    console.log(allServers, allConversations)
  }
  useEffect(() => {
    load();
    console.log(state)
  }, []);

  return (
    <Flex>
      <ServerList />
      <ConversationList allConversations={conversationList} />
      <FriendList
        allFriendList={friendList}
        allPendingList={pendingList}
      />
    </Flex>
  )
};

export default Me;
