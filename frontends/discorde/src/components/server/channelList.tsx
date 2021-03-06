import React from 'react';
import styled from "styled-components";
import Link from 'next/link'
import { BiHash } from 'react-icons/bi';
import { IoMdPersonAdd } from 'react-icons/io';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Router from 'next/router';
import { FiPlus } from 'react-icons/fi';
import { ReduxState } from 'store';

import { Tooltip } from 'components/tooltip';
import LeftList from '../leftList';

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

  .add-user {
    display: none;
  }

  &:hover {
    background-color: #4f545c29;

    .add-user {
      display: block;
    }

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

const ServerName = styled.span`
  font-weight: bold;
  font-size: 1rem;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
`;

const Space = styled.div`
  flex-grow: 1;
`;

const ChannelName = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  padding: 0 1rem;
  padding-top: 1rem;

  label {
    margin: auto;
  }

  .icon {
    color: #8e9297;
    cursor: pointer;
    transition: color 0.2s ease-in-out;
  }

  .icon:hover {
    color: #fff;
  }
`;

export const ChannelList = () => {
  const router = useRouter();
  const { serverId, id } = router.query;

  const server = useSelector((state: ReduxState) => state.servers.find((e) => e.id === Number(serverId)));
  const channels = server?.channels || [];

  return (
    <LeftList
      header={<ServerName>{server?.name}</ServerName>}
    >
      <>
        <ChannelName>
          <label>Channels</label>
          <Space />
          <Tooltip
            text='Create Channel'
          >
            <FiPlus
              className='icon'
              onClick={() => Router.push(`/channels/${serverId}/createChannel`)}
            />
          </Tooltip>
        </ChannelName>
        <Ul>
          {channels.map((channel, i) => {
            return (
              <Link
                key={`${channel.id}${i}`}
                href={`/channels/${serverId}/${channel.id}`}
              >
                <Row selected={Number(id) === channel.id}>
                  <BiHash className='icon' />
                  <span className="channel-name">{channel.name}</span>
                  <Space />
                  <Tooltip text='Create Invite'>
                    <IoMdPersonAdd
                      onClick={() => Router.push(`/channels/${serverId}/inviteUser`)}
                      className='icon add-user'
                    />
                  </Tooltip>
                </Row>
              </Link>
            );
          })}
        </Ul>
      </>
    </LeftList>
  );
};
