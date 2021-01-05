import React, { useState, useEffect } from 'react';
import styled from "styled-components";

import { getFriends, getPendingFriends, getBlocked } from '../../api/users';
import { AddFriend } from './addFriend';

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

const Button = styled.button`
  background-color: #2f3136;
  border-radius: 100%;
  height: 40px;
  width: 40px;

  &:active {
    background-color: #4f545c3d;
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

const list = [
  {
    username: "tomat",
    icon: "https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg",
    status: "online"
  },
  {
    username: "tomat",
    icon: "https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg",
    status: "online"
  },
  {
    username: "tomat",
    icon: "https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg",
    status: "online"
  },
  {
    username: "tomat",
    icon: "https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg",
    status: "online"
  },
  {
    username: "tomat",
    icon: "https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg",
    status: "online"
  },
  {
    username: "tomat",
    icon: "https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg",
    status: "online"
  },
];

export const FriendList = ({ children }: NoProps) => {
  const [tab, setTab] = useState('online');
  const [pendingFriends, setPendingFriends] = useState([]);
  const [allFriends, setAllFriends] = useState([]);
  const [blocked, setBlocked] = useState([]);

  const friendsLists = {
    online: {
      label: 'Online',
      request: getFriends
    },
    all: {
      label: 'All friends',
      request: getFriends
    },
    pending: {
      label: 'Pending',
      request: getPendingFriends
    },
    blocked: {
      label: 'Blocked',
      request: getBlocked
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await friendsLists[tab].request();
      const pendingFriendsList = result.map(e => e.users[1]);

      setPendingFriends(tab === 'online'
        ? pendingFriendsList.filter(e => status === 'online')
        : pendingFriendsList
      );
    };

    fetchData();
  }, [tab]);

  const handleTabClick = selectedTab => setTab(selectedTab);

  const friendList = (
    pendingFriends.map((user, i) => {
      return (
        <RowContainer key={`${user.username}${i}`}>
          <Row>
            <img src={user.image} alt="profile" />
            <Details>
              <span className="username-bold">{user.username}</span>
              <br />
              <span className="status">{user.status}</span>
            </Details>
            <Space />
            {/* <Button>X</Button> */}
          </Row>
        </RowContainer>
      );
    })
  )

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
          onClick={() => handleTabClick('add')
        }
         add
        >Add Friend</HeaderButton>
      </Header>
      {
        tab !== 'add' && (
          <>
            <label>{friendsLists[tab].label} - {list.length}</label>
            <Ul>
              {friendList}
            </Ul>
          </>
        )
      }
      {
        tab === 'add' && <AddFriend />
      }
    </Container>
  );
};
