import React from 'react';
import Link from 'next/link';
import { User } from 'utils/api';

import { useRouter } from 'next/router'
import { Container, UserInteraction } from './style';

type Props = {
  title: string;
  user?: User;
};

const Header: React.FC<Props> = ({ user, title }: Props) => {
  const router = useRouter();
  const handleLogout = () => {
    window.localStorage.removeItem('token');
    router
      .push('/login')
      .then(() => {})
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <Container>
      <Link href="/">
        <img id="logo" alt="logo" src="/discorde.png" />
      </Link>
      <span>{title}</span>
      <UserInteraction>
        {user.username}
        <img id={user.id === -1 ? '' : 'avatar'} alt="avatar" src={user.image} />
        <div onClick={handleLogout}>
          <img id="logout" alt="logout" src="/exit.svg" />
        </div>
      </UserInteraction>
    </Container>
  );
};

Header.defaultProps = {
  user: {
    id: -1,
    role: 'user',
    relations: [],
    email: '',
    status: 'offline',
    createdAt: undefined,
    updatedAt: undefined,
    members: [],
    username: 'noname',
    image: '/user.svg',
  },
};

export default Header;
