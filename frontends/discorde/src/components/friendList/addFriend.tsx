import React, { useState } from 'react';
import styled from "styled-components";

import { AddFriendInput } from '../input';
import { Error, Success } from '../text';

import { addFriend } from '../../api/users';
import { useDispatch, useSelector } from 'react-redux';
import { Relation, RequestType } from 'store/types';
import { ADD_PENDING } from 'store/actions/pending';
import { ReduxState } from 'store';

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

export const AddFriend = () => {
  const me = useSelector((state: ReduxState) => state.me);
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await addFriend(dispatch, { username }, me);
    if (!response.success) {
      setError(response.data);
    } else {
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
