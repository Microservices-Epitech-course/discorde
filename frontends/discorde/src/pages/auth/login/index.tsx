import React, { useState } from 'react';
import { NextPage } from 'next';
import styled from 'styled-components';
import Link from 'next/link'
import Router from 'next/router'

import { Error } from '../../../components/text';
import { LoginInput } from '../../../components/input';
import { Button } from '../../../components/button';

import { login } from '../../../api/auth';

const Container = styled.div`
  width: 50vw;
  margin: auto;

  form {
    margin-top: 2rem;
  }
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Login: NextPage = (): JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await login({ email, password });
    if (response !== true) setError(response);
    else {
      setError(null);
      Router.push('/channels/@me');
    };
    console.log(localStorage.getItem('token'))
  }

  return (
    <Flex>
      <Container>
        <h2>Hello, welcome to Discorde!</h2>
        Time to log in.
        <form onSubmit={handleSubmit}>
          <LoginInput value={email} onChange={setEmail} login type='email' label='Email' />
          <LoginInput value={password} onChange={setPassword} login type='password' label='Password' />
          <br />
          <Button type='submit'>Log in</Button>
          {
            error && <Error>{error}</Error>
          }
        </form>
        <br /><br />
        Don't have an account? <Link href="/auth/register"><a href=''>Register!</a></Link>
      </Container>
    </Flex>
  );
};

export default Login;
