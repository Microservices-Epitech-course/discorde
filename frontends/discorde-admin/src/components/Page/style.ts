import styled from 'styled-components';

export const Container = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

export const RowContainer = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: stretch;
  #content {
    height: calc(100vh - 85px - 2rem);
    margin: 1rem;
    background-color: var(--secondary-light);
    overflow-y: auto;
  }
`;

export const Msg = styled.div`
  place-self: center;
  color: black;
`;
