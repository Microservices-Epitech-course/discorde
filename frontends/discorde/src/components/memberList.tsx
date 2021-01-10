import * as React from 'react';
import { useSelector } from 'react-redux';
import { ReduxState } from 'store';
import { Server } from 'store/types';
import { getUsersFromIds } from 'store/utils';
import styled from 'styled-components';
import UserImage from './userImage';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 240px;
  width: 240px;
  background-color: #2f3136;

  label {
    margin-left: 1rem;
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

const Row = styled.li`
  display: flex;
  align-items: center;
  height: 42px;
  padding: .4rem .5rem;
  border-radius: 5px;
  margin-block-start: 2px;

  &:hover {
    background-color: #4f545c29;

    .username-bold {
      color: #dcddde;
    }

    ${Button} {
      display: block;
    }
  }

  .username-bold {
    color: #fff;
    margin-left: .8rem;
    font-size: 16px;
    color: #8e9297;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;

interface MemberListProps {
  server: Server;
}
export default function MemberList({server}: MemberListProps) {
  const members = useSelector((state: ReduxState) => {
    console.log(server);
    const all = server.members.filter((e) => !e.quit);
    const users = getUsersFromIds(state, all.map((e) => e.userId));
    return all.map((mem) => ({...mem, user: users.find((e) => e.id === mem.userId)})).sort((a, b) => a.user?.username.localeCompare(b.user?.username));
  })

  return (
    <Container>
      <Ul>
        {members.map((member, i) => (
          <Row key={i}>
            <UserImage url={member.user?.image} size={32}/>
            <span className="username-bold">{member.user.username}</span>
          </Row>
        ))}
      </Ul>
    </Container>
  )
}