import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { ReduxState } from 'store';

import { ChannelList } from 'components/server/channelList';
import { ServerList } from 'components/serverList';
import { Error, Success } from 'components/text';
import { ButtonInput } from 'components/input';
import { createInvitation } from 'api/servers';

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

const InviteUser = (): JSX.Element => {
  const [inviteLink, setInviteLink] = useState('');
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const router = useRouter();
  const { serverId, id } = router.query;
  const server = useSelector((state: ReduxState) => state.servers.find((e) => e.id === Number(serverId)));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await createInvitation(dispatch, {serverId: Number(serverId)});
    if (res.success) {
      setInviteLink(res.data.url);
    }
  }

  return (
    <Flex>
      <ServerList />
      <ChannelList />
      <Container>
        <label>Invite</label>
        <span>Invite friends to {server.name}.</span>
        <ButtonInput
          allowEmpty
          readOnly
          onSubmit={handleSubmit}
          placeholder='Invite link will appear here'
          value={inviteLink}
          onChange={() => {}}
          buttonText='Generate invite link'
        />
        {
          error && <Error>{error}</Error>
        }
      </Container>
    </Flex>
  )
};

export default InviteUser;
