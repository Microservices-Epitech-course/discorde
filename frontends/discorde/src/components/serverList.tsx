import React from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Link from 'next/link'
import { useSelector } from 'react-redux';
import { BiPlus } from 'react-icons/bi';
import { ReduxState } from 'store';

const Container = styled.div`
  background-color: #202225;
  padding: 0 .2rem;
  overflow-y: auto
  min-width: 72px;
`;

const Ul = styled.ul`
  list-style-type: none;
  padding-left: 0;
  width: 100%;
`;

const ServerIcon = styled.div<{ selected: boolean, add?: boolean }>`
  background-color: ${({ selected, add }) => {
    if (add && selected) return 'var(--success)';
    if (selected) return '#7289da';
    return '#36393f';
  }};
  height: 50px;
  width: 50px;
  border-radius: ${({ selected }) => selected ? '38%' : '100%'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-radius 0.2s ease, background-color 0.2s ease, transform 0.2s ease;
  color: ${({ selected, add }) => {
    if (add && selected) return '#fff';
    if (add) return 'var(--success)';
    return '#fff';
  }};
  overflow: hidden;

  img {
    height: 50px;
    width: 50px;
    border-radius: ${({ selected }) => selected ? '38%' : '100%'};
    transition: border-radius 0.2s ease;
  }

  .icon {
    height: 1.5rem;
  }

  &:hover {
    background-color: ${({ add }) => add ? 'var(--success)' : '#7289da'};
    color: #fff;
  }

  &:active {
    transform: translateY(.15rem);
  }
`;


const Row = styled.div`
  display: flex;
  align-items: center;
  height: 3.2rem;
  padding: 1.8rem .5rem;
  border-radius: 5px;
  margin-block-start: 2px;

  &:hover {
    cursor: pointer;

    ${ServerIcon} {
      border-radius: 38%;
    }
    img {
      border-radius: 38%;
    }
  }
`;

const StyledLink = styled(Link)`
  padding: 1rem;
`;

const Separator = styled.div`
  height: 2px;
  width: 32px;
  border-radius: 1px;
  background-color: #ffffff0f;
  margin: .2rem auto;
`;

interface ServerListProps {
  createServerSelected?: boolean;
  meSelected?: boolean;
};

export const ServerList = ({ createServerSelected, meSelected }: ServerListProps) => {
  const router = useRouter();
  const { serverId } = router.query;
  const me = useSelector((state: ReduxState) => state.me);
  const serverList = useSelector((state: ReduxState) => state.servers);

  const getAcronym = name => {
    const acronymArray = name.split(' ').map(word => word[0]);
    return acronymArray.join('');
  }

  return (
    <Container>
      <Ul>
        <Row>
          <StyledLink href='/channels/@me'>
            <ServerIcon selected={meSelected}>
              <img src={me?.image} alt='profile' />
            </ServerIcon>
          </StyledLink>
        </Row>
        <Separator />
        {serverList.map((server, i) => {
          return (
            <Row key={`${server.name}${i}`}>
              <StyledLink href={`/channels/${server.id}/${server.channels[0].id}`}>
                <ServerIcon selected={server.id.toString() === serverId}>
                  {getAcronym(server.name)}
                </ServerIcon>
              </StyledLink>
            </Row>
          );
        })}
        <Row>
          <Link href='/channels/@me/createServer'>
            <ServerIcon add selected={createServerSelected}>
              <BiPlus className='icon' />
            </ServerIcon>
          </Link>
        </Row>
      </Ul>
    </Container>
  );
};
