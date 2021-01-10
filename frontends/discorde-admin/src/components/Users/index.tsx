import React, { useCallback, useEffect, useState } from 'react';
import { User } from 'utils/api';
import { jbdm } from 'utils/api/client';
import { useRouter } from 'next/router';
import { Container, Item } from './style';

const UsersSelector: React.FC = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>(undefined);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    jbdm
      .get('/users')
      .then(({ data }) => {
        setUsers(data);
      })
      .catch((err) => {
        console.error(err);
        setUsers(null);
      });
  }, []);

  const handleSelection = useCallback(
    (user: User): void => {
      router
        .push({
          pathname: `/users/${user.id}`,
        })
        .then(() => {})
        .catch((err) => {
          console.error(err);
        });
    },
    [router],
  );

  if (users === undefined) return <div>Loading...</div>;
  if (users === null) return <div>Something goes wrong...</div>;
  return (
    <Container>
      <div id="header">
        Search:
        <input placeholder="search" onChange={({ target: { value } }) => setFilter(value)} />
      </div>
      <div id="selection">
        <div id="selectionHeader">
          <div>Username</div>
          <div>Email</div>
          <div>Role</div>
        </div>
        {users
          .filter(({ username, email }) => username.includes(filter) || email.includes(filter))
          .map((user) => (
            <Item onClick={() => handleSelection(user)}>
              <div>{user.username}</div>
              <div>{user.email}</div>
              <div>{user.role}</div>
            </Item>
          ))}
      </div>
    </Container>
  );
};

export default UsersSelector;
