import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { ReduxState } from 'store';
import { useRouter } from 'next/router';

import { createChannel } from 'api/servers';
import { ChannelList } from 'components/channel/channelList';
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
  const router = useRouter();
  const [channelName, setChannelName] = useState('');
  const { serverId } = router.query;
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(channelName);
    console.log(serverId);

    const response = await createChannel(dispatch, {
      name: channelName,
      serverId: Number(serverId)
    });
    if (!response.success) {
      setError(response.data);
    } else {
      setError(null);
      setSuccess(true);
    };
  }
  const handleChange = e => {
    if (success === true) setSuccess(false);
    setChannelName(e);
  }

  return (
    <Flex>
      <ServerList />
      <ChannelList />
      <Container>
        <label>Create a text channel</label>
        {
          success &&
          <Success>Success! The channel {channelName} was created.</Success>
        }
        <ButtonInput
          onSubmit={handleSubmit}
          placeholder='Enter a channel name'
          value={channelName}
          onChange={handleChange}
          buttonText='Create a channel'
        />
        {
          error && <Error>{error}</Error>
        }
      </Container>
    </Flex>
  )
};

export default Me;
