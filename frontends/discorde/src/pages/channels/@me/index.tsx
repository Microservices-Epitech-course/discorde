import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { ReduxState } from 'store/store';

import { FriendList } from '../../../components/friendList/friendList';
import { ConversationList } from '../../../components/conversationList';
import { ServerList } from '../../../components/serverList';

import { getFriends, getAllFriendRequest } from 'api/users';

import { SET_FRIENDS, SET_PENDING } from 'store/actions';
import { useDispatch } from 'react-redux';

const Flex = styled.div`
  display: flex;
  flex-direction: columns;
  height: 100vh;
`;

const Me = (): JSX.Element => {
  const me = useSelector((state: ReduxState) => state.me);
  const friendList = useSelector((state: ReduxState) => state.friends);
  const pendingList = useSelector((state: ReduxState) => state.invites)
  const dispatch = useDispatch();

  const load = async () => {
    const resultGetFriends = await getFriends();
    const resultGetAllFriendRequest = await getAllFriendRequest();

    const filteredFriendList = resultGetFriends.map(e => {
      const actionUser = e.users.filter(ee => ee.id !== me?.id)[0]
      return actionUser
    });

    dispatch({
      type: SET_FRIENDS,
      payload: filteredFriendList,
    });
    dispatch({
      type: SET_PENDING,
      payload: resultGetAllFriendRequest,
    });
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <Flex>
      <ServerList />
      <ConversationList />
      <FriendList
        allFriendList={friendList}
        allPendingList={pendingList}
      />
    </Flex>
  )
};

export default Me;
