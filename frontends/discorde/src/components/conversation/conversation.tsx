import React, { useState } from 'react';
import styled from 'styled-components';
import { HiAtSymbol } from 'react-icons/hi';

import { MessageInput } from '../input';
import { Message } from './message';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxState } from 'store';
import { getNotMe, getUserFromId, getUsersFromIds } from 'store/utils';
import { Server } from 'store/types';
import { sendMessages } from 'api/servers';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 0;
  flex-grow: 1;

  form {
    margin: 1rem;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;
  border-top: 2px solid #26282c;
  border-bottom: 2px solid #26282c;
  height: 3.4rem;
  min-height: 3.4rem;
  position: sticky;
  top: 0;
  padding-left: 1rem;

  .icon {
    color: #72767d;
  }
`;

const MessagesContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Name = styled.span`
  margin-left: 8px;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
`;

interface ConversationProps {
  id: number,
  conversation: Server,
};

export const Conversation = ({ id, conversation }: ConversationProps): JSX.Element => {
  const [message, setMessage] = useState('');
  const user = useSelector((state: ReduxState) => getNotMe(getUsersFromIds(state, conversation.members.map((e) => e.userId)), state.me));
  const memberUsers = useSelector((state: ReduxState) => {
    const authors = conversation.channels[0].messages?.map((e) => e.authorId);
    const members = conversation.members.filter((mem) => authors?.includes(mem.id));
    return members.map((mem) => ({...mem, user: getUserFromId(state, mem.userId)}));
  })
  const dispatch = useDispatch();

  const handleSubmit = e => {
    e.preventDefault();
    if (message === '') return false
    sendMessages(dispatch, message, conversation.channels[0].id);
    setMessage('');
  }

  return (
    <Container>
      <Header>
        <HiAtSymbol className='icon' />
        <Name>
          {user.username}
        </Name>
      </Header>
      <Content>
        <MessagesContainer>
          {
            conversation.channels[0].messages?.map((message, i) => {
              const isFirst = i === 0 || conversation.channels[0].messages[i - 1].authorId !== message.authorId;
              if (isFirst) {
                const member = memberUsers.find((e) => e.id === message.authorId);
                message.author = member;
              }
              return (
                <Message key={i} first={isFirst} info={message} />
              );
            })
          }
        </MessagesContainer>
        <form onSubmit={handleSubmit}>
          <MessageInput
            value={message}
            onChange={setMessage}
          />
        </form>
      </Content>
    </Container>
  )
};
