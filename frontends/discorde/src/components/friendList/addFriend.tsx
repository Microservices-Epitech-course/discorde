import React, { useState } from 'react';
import styled from "styled-components";

import { AddFriendInput } from '../input';
import { Error, Success } from '../text';

import { addFriend } from '../../api/users';
import { useDispatch } from 'react-redux';
import { ADD_PENDING } from 'store/actions';
import { Relation, RequestType } from 'store/types';

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
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await addFriend({ username });
    if (!response.success) {
      setError(response.data);
    } else {
      setError(null);
      setSuccess(true);
      const newPending = response.data.data as Relation;
      newPending.type = RequestType.ONGOING;
      dispatch({
        type: ADD_PENDING,
        payload: newPending
      })
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
