import * as React from 'react';
import styled from 'styled-components';
import { Channel, Server, ServerType, User } from "store/types";
import { useDispatch, useSelector } from 'react-redux';
import { ReduxState } from 'store';
import { getNotMe, getUserFromId, getUsersFromIds } from 'store/utils';
import { Message } from './conversation/message';
import { sendMessages } from 'api/servers';
import { MessageInput } from './input';
import { HiAtSymbol } from 'react-icons/hi';
import { BiHash } from 'react-icons/bi';
import { IoMdPeople } from 'react-icons/io';

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
  height: 0;
  overflow: auto;
  flex-grow: 1;
  display: flex;
  flex-direction: column-reverse;
  width: 100%;
`;

const Name = styled.span`
  margin-left: 8px;
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
`;

interface ChannelHeaderProps {
  server: Server;
  channel: Channel;
  me: User;
}

function ChannelHeader({server, channel, me}: ChannelHeaderProps) {
  const state = useSelector((state: ReduxState) => state);

  if (server.type === ServerType.CONVERSATION && server.members.length === 2) {
    const user = getNotMe(getUsersFromIds(state, server.members.map((e) => e.userId)), me);
    return (
      <>
        <HiAtSymbol className='icon' />
        <Name>
          {user.username}
        </Name>
      </>
    );
  } else if (server.type === ServerType.CONVERSATION) {
    return (
      <>
        <IoMdPeople className='icon' />
        <Name>
          {server.name}
        </Name>

      </>
    )
  } else {
    return (
      <>
        <BiHash className='icon' />
        <Name>
          {channel.name}
        </Name>
      </>
    );
  }
}

interface ChannelDisplayProps {
  channelId: number;
  server: Server;
}

export default function ChannelDisplay({channelId, server}: ChannelDisplayProps) {
  const channel = server.channels.find((e) => e.id === channelId);
  const me = useSelector((state: ReduxState) => state.me);
  const memberUsers = useSelector((state: ReduxState) => {
    const authors = channel.messages?.map((e) => e.authorId);
    const members = server.members.filter((mem) => authors?.includes(mem.id));
    return members.map((mem) => ({...mem, user: getUserFromId(state, mem.userId)}));
  });
  const state = useSelector((state: ReduxState) => state);
  const messages = channel?.messages.map((e) => ({...e, author: memberUsers.find((e2) => e2.id === e.authorId)})).reverse();
  const [message, setMessage] = React.useState('');
  const dispatch = useDispatch();

  const handleSubmit = e => {
    e.preventDefault();
    if (message === '') return false
    sendMessages(dispatch, message, channelId);
    setMessage('');
  }

  return (
    <Container>
      <Header>
        <ChannelHeader server={server} channel={channel} me={me} />
      </Header>
      <Content>
        <MessagesContainer>
          {
            messages.map((message, i) => {
              const isFirst = i === messages.length - 1 || messages[i + 1].authorId !== message.authorId;
              return (
                <Message key={i} first={isFirst} info={message} />
              );
            })
          }
        </MessagesContainer>
        <form onSubmit={handleSubmit}>
          <MessageInput
            placeholder={server.type === ServerType.CONVERSATION ?
              (server.members.length === 2 ? `Message @${getNotMe(getUsersFromIds(state, server.members.map((e) => e.userId)), me).username}` : `Message ${server.name}`) :
              `Message #${channel.name}`
            }
            value={message}
            onChange={setMessage}
          />
        </form>
      </Content>
    </Container>
  );
}