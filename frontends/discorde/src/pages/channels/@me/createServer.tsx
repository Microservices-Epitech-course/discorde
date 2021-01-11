import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import { createServer } from 'api/servers';
import { ConversationList } from 'components/conversation/conversationList';
import { ServerList } from 'components/serverList';
import { ButtonInput } from 'components/input';
import { Error, Success } from 'components/text';

const Flex = styled.div`
  display: flex;
  flex-direction: columns;
  height: 100vh;
`;

const Container = styled.div`
  padding: 0 2rem;
  margin-top: 50px;
  width: 100%;

  label {
    color: #fff;
    font-size: 1rem;
    margin-left: 0 !important;
  }

  span {
    font-size: .8rem;
  }
`;


const Me = (): JSX.Element => {
  const [serverName, setServerName] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await createServer(dispatch, { name: serverName });
    if (!response.success) {
      setError(response.data);
    } else {
      setError(null);
      setSuccess(true);
    };
  }
  const handleChange = e => {
    if (success === true) setSuccess(false);
    setServerName(e);
  }

  return (
    <Flex>
      <ServerList createServerSelected={true} />
      <ConversationList />
      <Container>
        <label>Create a server</label>
        {
          success
            ? <Success>Success! The server {serverName} was created.</Success>
            : <span>Your server is where you and your friends hang out. Make yours and start talking.</span>
        }
        <ButtonInput
          onSubmit={handleSubmit}
          placeholder='Enter a server name'
          value={serverName}
          onChange={handleChange}
          buttonText='Create a server'
        />
        {
          error && <Error>{error}</Error>
        }
      </Container>
    </Flex>
  )
};

export default Me;
