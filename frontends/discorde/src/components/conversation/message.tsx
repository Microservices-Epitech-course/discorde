import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { Message as MessageInterface } from 'store/types/Message';

const LeftContent = styled.div`
  min-width: 2.8rem;
`;

const RightContent = styled.div`
  text-align: left;
  margin-left: .8rem;
  display: flex;
  align-items: baseline;
  flex-direction: column;
`;

const Details = styled.div`
  align-self: start;
  margin-bottom: .6rem;
`;

const MessageContainer = styled.div<{ first: boolean }>`
  display: flex;
  margin-top: ${({ first }) => first ? '1.5rem' : '0'};
  padding: .6rem 1rem;

  &:hover {
    background-color: #04040512;
  }

  img {
    height: 40px;
    width: 40px;
    border-radius: 100%;
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
  info: MessageInterface,
};

export const Message = ({ first, info }: MessageProps): JSX.Element => {
  const day = info.createdAt.getDate();
  const month = info.createdAt.getMonth();
  const year = info.createdAt.getFullYear();
  const hour = info.createdAt.getHours();
  const minute = info.createdAt.getMinutes();


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
      <MessageContainer first={first}>
        <LeftContent>
          <img src={info.author.user.image} alt='profile' />
        </LeftContent>
        <RightContent>
          <Details>
            <span className="username-bold">{info.author.user.username}</span>
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
    <MessageContainer first={first}>
      <LeftContent>
      </LeftContent>
      <RightContent>
        {info.content}
      </RightContent>
    </MessageContainer>
  )
}
