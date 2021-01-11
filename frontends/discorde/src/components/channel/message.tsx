import React from 'react';
import styled from 'styled-components';

import { Message as MessageInterface } from 'store/types/Message';
import UserImage from 'components/userImage';

const LeftContent = styled.div`
  min-width: 2.8rem;
`;

const RightContent = styled.div`
  text-align: left;
  margin-left: .8rem;
  display: flex;
  align-items: baseline;
  flex-direction: column;
  white-space: pre-line;
  min-height: 1rem;
`;

const Details = styled.div`
  align-self: start;
  margin-bottom: .6rem;
`;

const MessageContainer = styled.div<{ first: boolean, last: boolean }>`
  display: flex;
  margin-top: ${({ first }) => first ? '1rem' : '0'};
  padding 0 1rem;
  padding-top: ${({first}) => first ? '.6rem' : '.125rem'};
  padding-bottom: ${({last}) => last ? '.6rem' : '.125rem'};

  &:hover {
    background-color: #04040512;
  }

  .username-bold {
    color: #fff;
    font-weight: 600;
    font-size: 1rem;
  }

  .date {
    color: #72767d;
    font-size: .75rem;
    text-transform: capitalize;
    margin-left: .5rem;
  }
`;

interface MessageProps {
  first: boolean,
  last: boolean,
  info: MessageInterface,
};

export const Message = ({ first, info, last }: MessageProps): JSX.Element => {
  const createdAt = new Date(info.createdAt);
  const day = createdAt.getDate();
  const month = createdAt.getMonth();
  const year = createdAt.getFullYear();
  const hour = createdAt.getHours();
  const minute = createdAt.getMinutes();


  const dateString = () => {
    const today = new Date();

    const isToday = () => {
      return today.getFullYear() === year &&
        today.getMonth() === month &&
        today.getDate() === day
    }

    const isYesterday = () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate());

      return yesterday.getFullYear() === year &&
        yesterday.getMonth() === month &&
        yesterday.getDate() - 1 === day
    }

    if (isToday() === true)
      return `Today at ${hour}:${minute}`;
    if (isYesterday() === true)
      return `Yesterday at ${hour}:${minute}`;
    return `${day}/${month + 1}/${year}`;
  }

  if (first) {
    return (
      <MessageContainer first={first} last={last}>
        <LeftContent>
          <UserImage url={info.author?.user.image}/>
        </LeftContent>
        <RightContent>
          <Details>
            <span className="username-bold">{info.author?.user.username}</span>
            <span className="date">
              {dateString()}
            </span>
          </Details>
            {info.content}
        </RightContent>
      </MessageContainer>
    )
  }

  return (
    <MessageContainer first={first} last={last}>
      <LeftContent>
      </LeftContent>
      <RightContent>
        {info.content}
      </RightContent>
    </MessageContainer>
  )
}
