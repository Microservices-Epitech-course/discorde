import React, { useState } from 'react';
import { jbdm, sven } from 'utils/api/client';

import { useRouter } from 'next/router';
import { Container } from './style';

const Login = (): JSX.Element => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [timeoutId, setTimeoutId] = useState(-1);
  const [loading, setLoading] = useState(false);

  const handleError = (err, ms) => {
    setError(err);
    clearTimeout(timeoutId);
    setTimeoutId(setTimeout((): void => setError(''), ms));
  };

  const handleSubmit = () => {
    setLoading(true);
    sven
      .post('/auth', {
        [email.length !== 0 ? 'email' : 'username']: email.length !== 0 ? email : username,
        password,
      })
      .then(({ data, status }) => {
        if (status !== 200) return;
        window.localStorage.setItem('token', data);
        jbdm
          .get('/users/@me')
          .then(({ data: user, status: statusMe }) => {
            if (statusMe !== 200) {
              window.localStorage.removeItem('token');
              return;
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (user.role !== 'admin') {
              window.localStorage.removeItem('token');
              handleError('You need to connect an admin to access back-office', 3000);
              return;
            }
            router
              .push('/')
              .then(() => {})
              .catch((err) => console.error(err));
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => {
        console.error(err);
        handleError('Wrong Credentials', 3000);
      });
    setLoading(false);
  };

  const handleKeyPress = ({ key }) => {
    if (key === 'Enter') handleSubmit();
  };

  return (
    <Container>
      {error.length !== 0 && (
        <div id="error">
          <i>{error}</i>
        </div>
      )}
      <div id="card">
        <h3>B-O Discorde</h3>
        <div id="logo">
          <img alt="logo" src="/discorde.png" />
        </div>
        <span>Log in</span>
        <input
          placeholder="Email"
          id="email"
          type="email"
          value={email}
          disabled={username.length !== 0}
          onChange={({ target: { value } }): void => setEmail(value)}
          onKeyPress={handleKeyPress}
        />
        <input
          placeholder="Username"
          id="username"
          type="text"
          value={username}
          disabled={email.length !== 0}
          onChange={({ target: { value } }): void => setUsername(value)}
          onKeyPress={handleKeyPress}
        />
        <input
          placeholder="Password"
          id="password"
          type="password"
          value={password}
          onChange={({ target: { value } }): void => setPassword(value)}
          onKeyPress={handleKeyPress}
        />
        {loading ? (
          <div>Loading...</div>
        ) : (
          <button type="submit" onClick={handleSubmit} onKeyPress={handleKeyPress}>
            Connect
          </button>
        )}
      </div>
    </Container>
  );
};

export default Login;
