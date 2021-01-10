import React, { PropsWithChildren, useEffect, useState } from 'react';

import Header from 'components/Header';
import Drawer from 'components/Drawer';

import { useRouter } from 'next/router';
import { jbdm } from 'utils/api/client';
import { User } from 'utils/api';
import { Container, RowContainer, Msg } from './style';

type Props = PropsWithChildren<{
  title?: string;
  protectedResources?: boolean;
}>;

const Page: React.FC<Props> = ({ title, protectedResources, children }: Props) => {
  const router = useRouter();
  const [user, setUser] = useState<User>(undefined);

  useEffect(() => {
    if (!protectedResources) return;
    jbdm
      .get('/users/@me')
      .then((result) => {
        setUser(result.data);
      })
      .catch((err) => {
        setUser(null);
        console.error(err);
      });
  }, [protectedResources]);

  if (protectedResources && user === undefined) return <Msg>Loading...</Msg>;
  if (protectedResources && user === null) {
    router
      .push('/login')
      .then(() => {})
      .catch((err) => console.error(err));
    return (
      <Msg>
        Something went wrong...
      </Msg>
    );
  }

  if (protectedResources && user.role !== 'admin') {
    router
      .push('/login')
      .then(() => {})
      .catch((err) => console.error(err));
    return <div>Not authorized to access this resources</div>;
  }

  return (
    <Container>
      <Header user={user} title={title} />
      <RowContainer>
        <Drawer />
        <Container id="content">{children}</Container>
      </RowContainer>
    </Container>
  );
};

Page.defaultProps = {
  protectedResources: false,
  title: 'Back-Office Discorde',
};

export default Page;
