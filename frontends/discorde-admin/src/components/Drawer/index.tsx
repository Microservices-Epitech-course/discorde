import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Container, NavigationButton } from './style';

const Drawer = (): JSX.Element => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <Container open={open}>
      <div
        tabIndex={0}
        role="button"
        id="burgerMenu"
        onKeyPress={({ key }) => {
          if (key === 'Enter') setOpen(!open);
        }}
        onClick={(): void => setOpen(!open)}
      >
        <span id="label">Close Menu</span>
        <img alt={open ? 'close' : 'open'} src={open ? 'menu.svg' : 'menu.svg'} />
      </div>
      <Link href="/users">
        <NavigationButton active={router.pathname === '/users'}>
          Users
          <img alt="users" src="/user.svg" />
        </NavigationButton>
      </Link>
      <Link href="/messages">
        <NavigationButton active={router.pathname === '/messages'}>
          Messages
          <img alt="messages" src="/message.svg" />
        </NavigationButton>
      </Link>
      <Link href="/files">
        <NavigationButton active={router.pathname === '/files'}>
          Files / Picture
          <img alt="files" src="file.svg" />
        </NavigationButton>
      </Link>
      <Link href="/servers">
        <NavigationButton active={router.pathname === '/servers'}>
          Servers
          <img alt="servers" src="/servers.svg" />
        </NavigationButton>
      </Link>
      <Link href="/search">
        <NavigationButton active={router.pathname === '/search'}>
          Search Engine
          <img alt="search" src="/search.svg" />
        </NavigationButton>
      </Link>
    </Container>
  );
};

export default Drawer;
