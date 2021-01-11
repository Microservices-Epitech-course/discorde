import React, { useState } from 'react';
import styled from "styled-components";
import Link from 'next/link'
import { FiPlus, FiX } from 'react-icons/fi';
import { HiUsers } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';

import { ConversationSearchInput } from '../input';
import { ReduxState } from 'store';
import { getNotMe, getUsersFromIds } from 'store/utils';
import LeftList from '../leftList';
import { QuitConversation } from 'api';
import { Tooltip } from 'components/tooltip';
import Popup from 'components/popup';
import CreateConversation from './createConversation';

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
    .member-nb {
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
  .member-nb {
    font-size: .75rem;
    color: #fff;
    margin-left: .8rem;
    color: #8e9297;
  }

`;

const Space = styled.div`
  flex-grow: 1;
`;

const DirectMessages = styled.div`
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

const ConvoDefaultImage = styled.div`
  background-color: #19b491;
  width: 35px;
  height: 35px;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ConvoDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ConversationList = () => {
  const dispatch = useDispatch();
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
  const [tooltip, setTooltip] = useState(false);

  const deleteServer = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, serverId: number) => {
    event.preventDefault();
    await QuitConversation(dispatch, { id: serverId });
  }

  return (
    <LeftList
      header={(
        <ConversationSearchInput value={search} onChange={setSearch} placeholder='Find or start a conversation' />
      )}
    >
      <>
        <DirectMessages>
          <label>Direct messages</label>
          <Space />
          <Tooltip
            text='Create Conversation'
          >
            <FiPlus
              className='icon'
              onClick={() => setTooltip(!tooltip)}
            />
          </Tooltip>
          <Popup open={tooltip} setOpen={setTooltip}>
            <CreateConversation setOpen={setTooltip}/>
          </Popup>
        </DirectMessages>
        <Ul>
          {conversationList.map((server, i) => {
            return (
              <Link key={i} href={`/channels/@me/${server.id}`}>
                <Row>
                  {/*TODO GET IMAGE*/}
                  {
                    server.image ? (
                      <img src={server.image} alt="profile" />
                    ) : (
                      <ConvoDefaultImage>
                        <HiUsers className='icon' style={{ width: '100%', height: '50%' }}/>
                      </ConvoDefaultImage>
                    )
                  }
                  {
                    server.members.length > 2 ? (
                      <ConvoDetails>
                        <span className="username-bold">{server.name}</span>
                        <span className="member-nb">{server.members.length} Members</span>
                      </ConvoDetails>
                    ) : (
                      <span className="username-bold">{server.name}</span>
                    )
                  }
                  <Space />
                  <Button onClick={(e) => deleteServer(e, server.id)}>
                    <FiX className='icon' />
                  </Button>
                </Row>
              </Link>
            );
          })}
        </Ul>
      </>
    </LeftList>
  );
};
