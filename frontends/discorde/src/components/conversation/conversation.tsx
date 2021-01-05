import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { HiAtSymbol } from 'react-icons/hi';

import { MessageInput } from '../input';
import { getUser } from '../../api/users';
import { getServers } from '../../api/conversations';

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
  padding: 1.4rem 1rem;
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
`;

interface ConversationProps {
  id: string,
};

export const Conversation = ({ id }: ConversationProps): JSX.Element => {
  const [message, setMessage] = useState('');
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      const result = await getServers(id);
      console.log(result);
      setUser(user);
    }

    fetchUser();
  }, []);

  const handleSubmit = e => {
    e.preventDefault();

    if (message === '') return false

    console.log(message);
    setMessage('');
  }

  return (
    <Container>
      <Header>
        <HiAtSymbol className='icon' />
        {user.username}
      </Header>
      <Content>
        <MessagesContainer>
          <div>tomat</div>
          <div>tomat</div>
          <div>tomat</div>
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
