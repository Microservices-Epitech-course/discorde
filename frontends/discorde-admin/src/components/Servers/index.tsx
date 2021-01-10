import React, { useCallback, useEffect, useState } from 'react';
import { Server } from 'utils/api';
import { marine } from 'utils/api/client';
import { useRouter } from 'next/router';
import { Container, Item } from './style';

const ServersSelector: React.FC = () => {
  const router = useRouter();
  const [servers, setServers] = useState<Server[]>(undefined);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    marine
      .get('/servers')
      .then(({ data }) => {
        setServers(data);
      })
      .catch((err) => {
        console.error(err);
        setServers(null);
      });
  }, []);

  const handleSelection = useCallback(
    (server: Server): void => {
      router
        .push({
          pathname: `/servers/${server.id}`,
        })
        .then(() => {})
        .catch((err) => {
          console.error(err);
        });
    },
    [router],
  );

  if (servers === undefined) return <div>Loading...</div>;
  if (servers === null) return <div>Something goes wrong...</div>;
  return (
    <Container>
      <div id="header">
        Search:
        <input placeholder="search" onChange={({ target: { value } }) => setFilter(value)} />
      </div>
      <div id="selection">
        <div id="selectionHeader">
          <div>Name</div>
          <div>Type</div>
        </div>
        {servers
          .filter(({ name }) => name.includes(filter))
          .map((server) => (
            <Item onClick={() => handleSelection(server)}>
              <div>{server.name}</div>
              <div>{server.type}</div>
            </Item>
          ))}
      </div>
    </Container>
  );
};

export default ServersSelector;
