import React, { PropsWithChildren, useEffect, useState } from 'react';

import Header from 'components/Header';
import Drawer from 'components/Drawer';

import { jbdm } from 'utils/api/client';
import { User } from 'utils/api';
import { Container, RowContainer, Msg } from './style';

type Props = PropsWithChildren<{
  protectedResources?: boolean;
}>;

const Page: React.FC<Props> = ({ protectedResources, children }: Props) => {
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
  if (protectedResources && user === null)
    return (
      <Msg>
        <div
          onClick={() => {
            window.localStorage.setItem(
              'token',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjM2LCJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjEwMjUwMTc3LCJleHAiOjE2MTA4NTQ5Nzd9._Y7clS49kzsR6ryUbaGISwjveDenPJa-R_dPzzohO1w',
            );
          }}
        >
          Load
        </div>
        Something went wrong...
      </Msg>
    );

  return (
    <Container>
      <Header user={user} />
      <RowContainer>
        <Drawer />
        <Container>{children}</Container>
      </RowContainer>
    </Container>
  );
};

Page.defaultProps = {
  protectedResources: false,
};

export default Page;
