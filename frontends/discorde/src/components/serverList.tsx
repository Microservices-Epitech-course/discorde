import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link'
import { useSelector } from 'react-redux';
import { BiPlus } from 'react-icons/bi';

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

const Button = styled.button`
  padding: .5rem;
  display: none;
  background-color: transparent;

  a:hover {
  }

  &:active {
  }
`;

const ServerIcon = styled.div<{ selected: boolean }>`
  background-color: #36393f;
  height: 50px;
  width: 50px;
  border-radius: ${({ selected }) => selected ? '38%' : '100%'};
  transition: border-radius 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-radius 0.2s ease;

  img {
    height: 50px;
    width: 50px;
    border-radius: ${({ selected }) => selected ? '38%' : '100%'};
    transition: border-radius 0.2s ease;
  }

  .icon {
    height: 1.5rem;
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

const Label = styled.label`
  color: #b9bbbe;
`;

const StyledLink = styled(Link)`
  padding: 1rem;
`;

type InputProps = {
  children?: React.ReactNode;
};

const list = [
  {
    username: 'tomat',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg',
    status: 'online'
  },
  {
    username: 'tomat',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg',
    status: 'online'
  },
  {
    username: 'tomat',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg',
    status: 'online'
  },
  {
    username: 'tomat',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg',
    status: 'online'
  },
  {
    username: 'tomat',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg',
    status: 'online'
  },
  {
    username: 'tomat',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg',
    status: 'online'
  },
];

const Space = styled.div`
  flex-grow: 1;
`;

const Separator = styled.div`
  height: 2px;
  width: 32px;
  border-radius: 1px;
  background-color: #ffffff0f;
  margin: .2rem auto;
`;

export const ServerList = ({ children }: InputProps) => {
  const serverList = useSelector((state: ReduxState) => state.server);
  const [allUsers, setAllUsers] = useState([]);

  return (
    <Container>
      <Ul>
        <Row>
          <StyledLink href='/channels/@me'>
            <ServerIcon selected>
              <img src='https://ih1.redbubble.net/image.1664238575.2193/st,small,507x507-pad,600x600,f8f8f8.jpg' alt='profile' />
            </ServerIcon>
          </StyledLink>
        </Row>
        <Separator />
        {list.map((user, i) => {
          return (
            <Row key={`${user.username}${i}`}>
              <StyledLink href=''>
                <ServerIcon selected={false}>
                  <img src={user.icon} alt='profile' />
                </ServerIcon>
              </StyledLink>
            </Row>
          );
        })}
        <Row>
          <Link href='/channels/@me/createServer'>
            <ServerIcon selected={false}>
              <BiPlus className='icon' />
            </ServerIcon>
          </Link>
        </Row>
      </Ul>
    </Container>
  );
};
