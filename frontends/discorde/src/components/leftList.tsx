import * as React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { ReduxState } from 'store';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 240px;
  width: 240px;
  background-color: #2f3136;

  label {
    margin-left: 1rem;
  }
`;

const Header = styled.div`
  display: flex;
  width: 100%;
  border-top: 2px solid #26282c;
  border-bottom: 2px solid #26282c;
  background-color: #2f3136;
  height: 3.4rem;
  position: sticky;
  overflow: hidden;
  align-items: center;
  top: 0;
`;

const UserBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  background-color: #292b2f;
  height: 3.4rem;
  position: sticky;
  top: 0;
  padding: 0 8px;

  img {
    height: 35px;
    width: 35px;
    border-radius: 100%;
  }

  .username-bold {
    color: #fff;
    font-weight: 600;
    font-size: 1rem;
    margin-left: .8rem;
  }
`;

const ListContainer = styled.div`
  overflow: auto;
  flex-grow: 1;
  width: 100%;
`;

interface LeftListProps {
  header?: React.ReactNode;
  children: React.ReactNode;
}

const LeftList = ({header, children}: LeftListProps) => {
  const me = useSelector((state: ReduxState) => state.me);

  return (
    <Container>
      <Header>
        {header}
      </Header>
      <ListContainer>
        {children}
      </ListContainer>
      <UserBox>
        <img src={me?.image} alt="profile"/>
        <span className="username-bold">{me?.username}</span>
      </UserBox>
    </Container>
  );
};

export default LeftList;
