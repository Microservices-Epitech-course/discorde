import styled from 'styled-components';

export const Container = styled.div<{ invert?: boolean }>`
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 16px;
  font-weight: bold;
  background-color: var(--primary);
  border-bottom: 1px solid var(--primary-dark);
  & > img {
    height: 50px;
  }
  & > #logo {
    cursor: pointer;
    transition: filter var(--transition);
    filter: invert(${({ invert }) => (invert ? '0.85' : '0')});
    padding: 5px;
    border-radius: 20px;
    background-color: var(--secondary);
  }
`;

export const UserInteraction = styled.div`
  display: flex;
  align-items: center;
  font-weight: normal;
  font-size: 14px;
  gap: 1rem;
  margin-left: auto;
  & #avatar {
    filter: drop-shadow(2px 2px 2px rgba(100, 100, 100, 0.35));
    height: 35px;
  }
  & #logout {
    cursor: pointer;
    filter: invert(1);
    height: 35px;
    margin-left: 2rem;
  }
`;
