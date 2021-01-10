import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  max-height: 100%;
  & #header {
    display: flex;
    align-items: center;
    color: var(--secondary);
    gap: 1rem;
    padding: 1rem;
    background-color: var(--primary);
    border: 1px solid var(--primary-dark);
    input {
      height: 2rem;
      border-radius: 5px;
      border: none;
    }
  }
  & #selection {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    flex-grow: 1;
    overflow-y: auto;
    & #selectionHeader {
      position: sticky;
      top: 0;
      display: grid;
      color: var(--secondary);
      grid-auto-columns: 1fr;
      grid-auto-flow: column;
      background-color: var(--primary);
      div + div {
        border-left: 2px solid var(--secondary-dark);
      }
      div {
        padding: 0.3rem 1rem;
      }
    }
  }
`;

export const Item = styled.button`
  all: unset;
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  cursor: pointer;
  :hover {
    background-color: rgba(0, 0, 0, 0.25);
  }
  div + div {
    border-left: 2px solid transparent;
  }
  div {
    padding: 0.5rem 1rem;
  }
`;
