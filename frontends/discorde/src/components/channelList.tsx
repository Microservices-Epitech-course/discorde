import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import Link from 'next/link'
import { BiHash } from 'react-icons/bi';
import { IoMdPersonAdd } from 'react-icons/io';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Router from 'next/router';

import { ReduxState } from 'store';
import LeftList from './leftList';

const Container = styled.div`
  min-width: 240px;
  background-color: #2f3136;
  overflow-y: auto;

  label {
    margin-left: 1rem;
    margin-top: 1rem;
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

const Row = styled.li<{ selected: boolean }>`
  display: flex;
  align-items: center;
  padding: .4rem .5rem;
  border-radius: 5px;
  margin-block-start: 2px;

  &:hover {
    background-color: #4f545c29;

    .channel-name {
      color: #fff;
    }

    ${Button} {
      display: block;
    }
  }

  .icon {
    color: #72767d;
  }

  .channel-name {
    color: ${({ selected }) => selected ? '#fff' : '#72767d'};
    margin-left: .8rem;
    font-size: 1rem;
  }
`;

const ServerName = styled.div`
  font-weight: bold;
  font-size: 1rem;
  padding: 0 1rem;
  display: flex;
  align-items: center;
`;

const Space = styled.div`
  flex-grow: 1;
`;

export const ChannelList = () => {
  const router = useRouter();
  const { serverId, id } = router.query;

  const server = useSelector((state: ReduxState) => state.servers.find((e) => e.id === Number(serverId)));
  const channels = server.channels;

  return (
    <LeftList
      header={<ServerName>{server.name}</ServerName>}
    >
      <>
        <label style={{ marginTop: "1rem" }}>Channels</label>
        <Ul>
          {channels.map((channel, i) => {
            return (
              <Link key={i} href={`/channels/${serverId}/${channel.id}`}>
                <Row selected={Number(id) === channel.id}>
                  <BiHash className='icon' />
                  <span className="channel-name">{channel.name}</span>
                  <Space />
                  <IoMdPersonAdd onClick={() => Router.push(`/channels/${serverId}/inviteUser`)} className='icon add-user' />
                </Row>
              </Link>
            );
          })}
        </Ul>
      </>
    </LeftList>
  );
};
