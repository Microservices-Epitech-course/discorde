import React, { useEffect, useRef, useState } from 'react';
import { NextPage } from 'next';
import styled from 'styled-components';
import Link from 'next/link'
import Router from 'next/router';

import { LoginInput } from '../../../components/input';
import { Button } from '../../../components/button';
import { Error, Success } from '../../../components/text';

import { register } from '../../../api/auth';

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

const Register: NextPage = (): JSX.Element => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const timeout = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await register({ email, username, password });
    if (response !== true) {
      setError(response);
    } else {
      setError(null)
      setSuccess(true);
      timeout.current = setTimeout(() => {
        Router.push('/');
      }, 2000);
    }
  }

  useEffect(() => {
    return () => {
      if (timeout.current)
        clearTimeout(timeout.current);
    }
  }, []);

  return (
    <Flex>
      <Container>
        <h2>Create an account</h2>
        <form onSubmit={handleSubmit}>
          <LoginInput value={email} onChange={setEmail} type='email' label='Email' />
          <LoginInput value={username} onChange={setUsername} type='text' label='Username' />
          <LoginInput value={password} onChange={setPassword} type='password' label='Password' />
          <br />
          <Button type='submit'>Create account</Button>
          {
            error && <Error>{error}</Error>
          }
          { success && (
            <Success>
              Account successfully created !<br/><br/>
              Redirecting to login page...
            </Success>
          )}
        </form>
        <br /><br />
        <Link href="/auth/login">
          <a href=''>Already have an account?</a>
        </Link>
      </Container>
    </Flex>
  );
};

export default Register;
