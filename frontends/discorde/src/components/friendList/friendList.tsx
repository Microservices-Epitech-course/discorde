import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiCheck, FiX } from 'react-icons/fi';
import { BiMessage } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxState } from 'store/store';

import {
  modifyFriendRequest,
} from '../../api/users';
import { Error } from '../text';
import { AddFriend } from './addFriend';
import { ADD_FRIENDS, DEL_PENDING } from 'store/actions';
import { User } from 'store/types';

const Container = styled.div`
  width: 100%;
  overflow-y: auto;

  label {
    margin-left: 2rem;
  }
`;

const RowContainer = styled.li`
  border-top: 1px solid #ffffff0f;

  &:hover {
    border-top-color: transparent;

    button {
      background-color: #202225;
    }
  }
`;

const Ul = styled.ul`
  width: 100%;
  padding: 0 1.5rem;

  ${RowContainer}:hover + ${RowContainer} {
    border-top-color: transparent;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  padding: .8rem;
  border-radius: 10px;

  &:hover {
    background-color: #4f545c29;
  }

  img {
    height: 40px;
    width: 40px;
    border-radius: 100%;
  }

  .username-bold {
    color: #fff;
    font-weight: 600;
  }

  .status {
    font-size: .85rem;
    text-transform: capitalize;
  }
`;

const Button = styled.button<{ positive: boolean, negative: boolean }>`
  background-color: #2f3136;
  border-radius: 100%;
  height: 40px;
  width: 40px;

  &:nth-of-type(2) {
    margin-left: .5rem;
  }

  &:hover {
    .icon {
      ${({ positive }) => positive ? 'color: var(--success);' : ''}
      ${({ negative }) => negative ? 'color: var(--alert);' : ''}
    }
  }

  &:active {
    background-color: #4f545c3d !important;
  }
`;

const Details = styled.div`
  text-align: left;
  margin-left: .8rem;
`;

const Label = styled.label`
  color: #b9bbbe;
`

const Space = styled.div`
  flex-grow: 1;
`;

const Header = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 1rem;
  border-top: 2px solid #26282c;
  border-bottom: 2px solid #26282c;
  height: 3.4rem;
  position: sticky;
  top: 0;
`;

const HeaderButton = styled.button<{ selected: boolean, add: boolean }>`
  margin: .8rem;
  padding: .4rem;
  border-radius: 5px;
  font-weight: 600;
  font-size: .9rem;
  color: ${({ add, selected }) => {
    if (selected || add) return '#fff';
    return '#b9bbbe';
  }};
  background-color: ${({ add, selected }) => {
    if (add) return '#43b581';
    if (selected) return '#4f545c52';
    return 'transparent';
  }};

  &:hover {
    background-color: ${({ add }) => add ? '#43b581' : '#4f545c29'};
  }

  &:first-child {
    margin-left: 1.5rem;
  }
`;

interface UserRowProps {
  tab: string,
  user: User & {request: string},
};

const UserRow = ({tab, user}: UserRowProps) => {
  const dispatch = useDispatch();
  const me = useSelector((state: ReduxState) => state.me);

  const handleClick = async (action) => {
    const response = await modifyFriendRequest({ id: user.id.toString(), action });
    
    if (response.success) {
      dispatch({
        type: DEL_PENDING,
        id: response.data.id
      });
      if (action === "accept") {
        const actionUser = response.data.users.filter(ee => ee.id !== me?.id)[0]
        dispatch({
          type: ADD_FRIENDS,
          payload: actionUser
        });
      }
    }
  }

  const buttons = () => {
    if (!user?.request) {
      return (
        <Button positive>
          <BiMessage className='icon' onClick={() => {}} />
        </Button>
      )
    }

    if (user?.request === 'incoming') {
      return (
        <>
          <Button positive>
            <FiCheck className='icon' onClick={() => handleClick('accept')} />
          </Button>
          <Button negative onClick={() => handleClick('deny')}>
            <FiX className='icon' />
          </Button>
        </>
      )
    }

    return (
      <Button negative onClick={() => handleClick('deny')}>
        <FiX className='icon' />
      </Button>
    )
  }

  const description = () => {
    if (tab === 'pending')
      return user?.request === 'incoming'
        ? 'Incoming Friend Request'
        : 'Outgoing Friend Request'
    if (tab === 'online' || tab === 'all')
      return user.status
  }

  return (
    <RowContainer>
      <Row>
        <img src={user.image} alt="profile" />
        <Details>
          <span className="username-bold">{user.username}</span>
          <br />
          <span className="status">
            {description()}
          </span>
        </Details>
        <Space />
        {buttons()}
      </Row>
    </RowContainer>
  )
}

interface FriendListProps {
  allFriendList: array;
  allPendingList: array;
};

export const FriendList = ({ children, allFriendList, allPendingList }: FriendListProps) => {
  const [tab, setTab] = useState('online');
  const [currentList, setCurrentList] = useState([]);
  const [error, setError] = useState(null);
  const currentUser = useSelector((state: ReduxState) => state.me);

  // console.log(allFriendList)
  const friendsLists = {
    online: {
      label: 'Online',
    },
    all: {
      label: 'All friends',
    },
    pending: {
      label: 'Pending',
    },
    blocked: {
      label: 'Blocked',
    },
  };

  const handleTabClick = selectedTab => {
    let list = [];

    if (selectedTab === 'all') list = allFriendList
    if (selectedTab === 'online') list = allFriendList.filter(e => status === 'online')
    if (selectedTab === 'pending') {
      const cleanPendingList = allPendingList.map(e => {
        const actionUser = e.users.filter(ee => ee.id !== currentUser?.id)[0]

        return {
          ...actionUser,
          request: e.type,
        }
      });

      list = cleanPendingList
    }

    setTab(selectedTab);
    setCurrentList(list);
  }

  useEffect(() => {
    handleTabClick(tab);
  }, [allFriendList, allPendingList]);

  const friendList = currentList.map((user, i) =>
    <UserRow tab={tab} user={user} key={`${user.username}${i}`} />
  );

  return (
    <Container>
      <Header>
        <HeaderButton
          selected={tab === 'online'}
          onClick={() => handleTabClick('online')}
        >
          Online
        </HeaderButton>
        <HeaderButton
          selected={tab === 'all'}
          onClick={() => handleTabClick('all')}
        >
          All
        </HeaderButton>
        <HeaderButton
          selected={tab === 'pending'}
          onClick={() => handleTabClick('pending')}
        >
          Pending
        </HeaderButton>
        <HeaderButton
          selected={tab === 'blocked'}
          onClick={() => handleTabClick('blocked')}
        >
          Blocked
        </HeaderButton>
        <HeaderButton
          selected={tab === 'add'}
          onClick={() => handleTabClick('add')}
          add
        >Add Friend</HeaderButton>
      </Header>
      {
        tab !== 'add' && (
          <>
            <label>{friendsLists[tab].label} - {currentList.length}</label>
            <Ul>
              {friendList}
            </Ul>
            {
              error && <Error style={{ marginLeft: '2rem' }}>{error}</Error>
            }
          </>
        )
      }
      {
        tab === 'add' && <AddFriend />
      }
    </Container>
  );
};
