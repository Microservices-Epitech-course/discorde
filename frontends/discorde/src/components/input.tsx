import React, { useState } from 'react';
import styled from "styled-components";

import { Button } from './button';

const InputContainer = styled.div`
  text-align: left;
  margin-block-start: 1rem;
  margin-block-end: 1rem;
`;

/*
** Login Input
*/

const LoginInputContainer = styled.div`
  background-color: #0000001a;
  border-radius: 5px;
  padding: 0.9rem 0.6rem;
  border: 1px solid #0000004d;
  transition: border-color 0.2s ease-in-out;

  &:focus-within {
    border-color: #7289da;
  }

  input {
    width: 100%;
    color: #dcddde;

    &:focus {
      outline: none;
    }
  }
`;

interface LoginInputProps {
  placeholder?: string,
  label?: string,
  type?: string,
  value: string,
  onChange: Function,
};

export const LoginInput = ({ placeholder, label, type, value, onChange, ...props }: LoginInputProps) => {
  const handleChange = (e) => onChange(e.target.value);

  return (
    <InputContainer {...props}>
      <label>{label}</label>
      <LoginInputContainer>
        <input
          value={value}
          type={type}
          placeholder={placeholder ? placeholder : ""}
          onChange={handleChange}
        />
      </LoginInputContainer>
    </InputContainer>
  );
};

/*
** Message Input
*/

const MessageInputContainer = styled.div`
  background-color: #40434b;
  border-radius: 10px;
  padding: 0.9rem 0.6rem;
  border: none;
  transition: border-color 0.2s ease-in-out;
  width: 100%;
  text-align: left;

  &:focus-within {
    border-color: #7289da;
  }

  input {
    width: 100%;
    color: #dcddde;

    &:focus {
      outline: none;
    }
  }
`;

interface MessageInputProps {
  placeholder?: string,
  value: string,
  onChange: Function,
};

export const MessageInput = ({ placeholder, value, onChange, ...props }: MessageInputProps) => {
  const handleChange = (e) => onChange(e.target.value);

  return (
    <MessageInputContainer {...props}>
      <input
        value={value}
        placeholder={placeholder ? placeholder : ""}
        onChange={handleChange}
        />
    </MessageInputContainer>
  );
};

/*
** Conversation Search Input
*/

const StyledConversationSearchInput = styled.input`
  margin: .5rem;
  width: 100%;
  background-color: #202225;
  color: #72767d;
  border-radius: 5px;
  padding-left: .5rem;

`;

interface ConversationSearchInputProps {
  placeholder?: string,
  value: string,
  onChange: Function,
};

export const ConversationSearchInput = ({ placeholder, value, onChange, ...props }: ConversationSearchInputProps) => {
  const handleChange = (e) => onChange(e.target.value);

  return (
    <StyledConversationSearchInput
      value={value}
      placeholder={placeholder ? placeholder : ""}
      onChange={handleChange}
    />
  );
};

/*
** Add Friend Input
*/

const ButtonInputContainer = styled(InputContainer)`
  background-color: #0000001a;
  border-radius: 5px;
  padding: 0.9rem 0.6rem;
  border: 1px solid #0000004d;
  display: flex;

  form {
    display: contents;
  }

  input {
    flex: 1;
    color: #dcddde;
    font-size: .9rem;
    letter-spacing: .1rem;

    &:focus {
      outline: none;
    }
  }

  button {
    padding: .6rem 1rem;
    min-width: fit-content;
    width: auto;
  }
`;

interface ButtonInputProps {
  placeholder?: string,
  label?: string,
  type?: string,
  value: string,
  buttonText: string,
  onChange: Function,
  onSubmit: Function,
};

export const ButtonInput = ({ placeholder, label, type, value, buttonText, onSubmit, onChange, ...props }: ButtonInputProps) => {
  return (
    <ButtonInputContainer {...props}>
      <form onSubmit={onSubmit}>
        <input
          value={value}
          type={type}
          placeholder={placeholder ? placeholder : ""}
          onChange={e => onChange(e.target.value)}
        />
        <Button
          disabled={value === ''}
          type='submit'
        >
          {buttonText}
        </Button>
      </form>
    </ButtonInputContainer>
  );
};
