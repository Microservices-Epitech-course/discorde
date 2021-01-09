import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import Link from 'next/link'
import { FiX } from 'react-icons/fi';
import { useSelector } from 'react-redux';

import { ConversationSearchInput } from './input';
import { ReduxState } from 'store';
import { getNotMe, getUsersFromIds } from 'store/utils';

const Container = styled.div`
  min-width: 240px;
  background-color: #2f3136;
  overflow-y: auto;

  label {
    margin-left: 1rem;
  }
`;

const Ul = styled.ul`
  list-style-type: none;
  padding-left: 0;
  width: 100%;
  padding: 0 .5rem;
`;

const Button = styled.button`
  padding: .5rem;
  display: none;
  background-color: transparent;
`;

const Row = styled.li`
  display: flex;
  align-items: center;
  height: 3.2rem;;
  padding: .4rem .5rem;
  border-radius: 5px;
  margin-block-start: 2px;

  &:hover {
    background-color: #4f545c29;

    .username-bold {
      color: #dcddde;
    }

    ${Button} {
      display: block;
    }
  }

  img {
    height: 35px;
    width: 35px;
    border-radius: 100%;
  }

  .username-bold {
    color: #fff;
    margin-left: .8rem;
    color: #8e9297;
  }
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
  background-color: #2f3136;
  height: 3.4rem;
  position: sticky;
  top: 0;
`;

export const ConversationList = () => {
  const me = useSelector((state: ReduxState) => state.me);
  const conversationList = useSelector((state: ReduxState) => (
    state.conversations.map((conv) => {
      return ({
      ...conv,
      name: conv.members.length === 2 ?
        getNotMe(getUsersFromIds(state, conv.members.map((mem) => mem.userId)), me).username :
        conv.name,
      image: conv.members.length === 2 ?
        getNotMe(getUsersFromIds(state, conv.members.map((mem) => mem.userId)), me).image :
        undefined
    })
  })
  ));
  const [search, setSearch] = useState('');

  return (
    <Container>
      <Header>
        <ConversationSearchInput value={search} onChange={setSearch} placeholder='Find or start a conversation' />
      </Header>
      <label>Direct messages</label>
      <Ul>
        {conversationList.map((server, i) => {
          return (
            <Link key={i} href={`/channels/@me/${server.id}`}>
              <Row>
                {/*TODO GET IMAGE*/}
                <img src={server.image} alt="profile" />
                <span className="username-bold">{server.name}</span>
                <Space />
                <Button>
                  <FiX className='icon' />
                </Button>
              </Row>
            </Link>
          );
        })}
      </Ul>
    </Container>
  );
};