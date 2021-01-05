import React, { useState } from 'react';
import styled from "styled-components";

import { AddFriendInput } from '../input';
import { Error, Success } from '../text';

import { addFriend } from '../../api/users';

const Container = styled.div`
  padding: 0 2rem;

  label {
    color: #fff;
    font-size: 1rem;
    margin-left: 0 !important;
  }

  span {
    font-size: .8rem;
  }
`;

export const AddFriend = ({}: NoProps) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await addFriend({ username });
    if (response !== true) setError(response);
    else {
      setError(null);
      setSuccess(true);
    };
  }

  const handleChange = e => {
    if (success === true) setSuccess(false);
    setUsername(e);
  }

  return (
    <Container>
      <label>Add friend</label>
      {
        success
          ? <Success>Success! Your friend request to {username} was sent.</Success>
          : <span>You can add a friend with their username. It's cAsE sEnSitIvE!</span>
      }
      <AddFriendInput
        onSubmit={handleSubmit}
        placeholder='Enter a Username'
        value={username}
        onChange={handleChange}
      />
      {
        error && <Error>{error}</Error>
      }
    </Container>
  );
};
