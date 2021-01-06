import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { HiAtSymbol } from 'react-icons/hi';

import { getUser } from 'api/users';
import { MessageInput } from '../input';
import { Message } from './message';

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
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;
  border-top: 2px solid #26282c;
  border-bottom: 2px solid #26282c;
  height: 3.4rem;
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

interface ConversationProps {
  id: string,
};

export const Conversation = ({ id }: ConversationProps): JSX.Element => {
  const [message, setMessage] = useState('');
  const [user, setUser] = useState({});

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     setUser(user);
  //   }

  //   fetchUser();
  // }, []);

  const handleSubmit = e => {
    e.preventDefault();

    if (message === '') return false

    console.log(message);
    setMessage('');
  }

  const fakeMessage = {
    id: 35,
    author: {
      user: {
        username: 'Tati',
        image: 'https://ih1.redbubble.net/image.1664238575.2193/st,small,507x507-pad,600x600,f8f8f8.jpg',
      }
    },
    content: 'tomat de chips',
    createdAt: new Date('January 6, 2021 14:15:30'),
  }

  return (
    <Container>
      <Header>
        <HiAtSymbol className='icon' />
        {user.username}
      </Header>
      <Content>
        <MessagesContainer>
          <Message first info={fakeMessage} />
          <Message info={fakeMessage} />
          <Message info={fakeMessage} />
          <Message first info={fakeMessage} />
          <Message info={fakeMessage} />
          <Message info={fakeMessage} />
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
