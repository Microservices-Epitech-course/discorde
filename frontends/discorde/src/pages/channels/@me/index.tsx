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
  const [friendList, setFriendList] = useState([]);
  const [pendingList, setPendingList] = useState([]);
  const dispatch = useDispatch();

  useEffect(async () => {
      const resultGetFriends = await getFriends();
      const resultGetAllFriendRequest = await getAllFriendRequest();

      if (resultGetFriends?.error) {
        setFriendList([]);
        return false;
      }
      if (resultGetAllFriendRequest?.error) {
        setPendingList([]);
        return false;
      }

      const filteredFriendList = resultGetFriends.map(e => {
        const actionUser = e.users.filter(ee => ee.id !== me?.id)[0]
        return actionUser
      });

      setFriendList(filteredFriendList);
      setPendingList(resultGetAllFriendRequest);

      dispatch({
        type: SET_FRIENDS,
        payload: filteredFriendList,
      });
      dispatch({
        type: SET_PENDING,
        payload: resultGetAllFriendRequest,
      });
      // console.log(resultGetAllFriendRequest)
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
