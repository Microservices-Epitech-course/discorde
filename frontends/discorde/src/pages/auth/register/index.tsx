import React, { useState } from 'react';
import { NextPage } from 'next';
import styled from 'styled-components';
import Link from 'next/link'

import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { Error } from '../../../components/Error';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await register({email, username, password});
    if (response !== true) setError(response);
    else setError(null);
  }

  return (
    <Flex>
      <Container>
        <h2>Create an account</h2>
        <form onSubmit={handleSubmit}>
          <Input value={email} onChange={setEmail} type='email' login label='Email' />
          <Input value={username} onChange={setUsername} login label='Username' />
          <Input value={password} onChange={setPassword} login type='password' label='Password' />
          <br />
          <Button type='submit'>Create account</Button>
          {
            error && <Error>{error}</Error>
          }
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
