import styled from 'styled-components';

export const Container = styled.div`
  flex-grow: 1;
  display: grid;
  place-content: center;
  & #error {
    position: fixed;
    top: 0.2rem;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--primary-dark);
    color: red;
    padding: 0.5rem 2rem;
    border-radius: 20px;
  }
  & #card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    background-color: var(--primary);
    padding: 2rem 3rem;
    border-radius: 20px;
  }
  & #logo {
    height: 50px;
    background-color: var(--secondary-light);
    padding: 0.2rem;
    border-radius: 20px;
    & > img {
      height: 100%;
    }
  }
  & input {
    transition: background-color var(--transition);
    border-radius: 5px;
    border: none;
    height: 2rem;
    background-color: var(--secondary);
    :disabled {
      background-color: var(--primary-light);
    }
  }
  & button {
    border: none;
    font-weight: bold;
    margin-top: 2rem;
    padding: 0.7rem 1.5rem;
    border-radius: 5px;
    background-color: var(--secondary);
  }
  & span {
    margin-bottom: 1rem;
  }
  & h3 {
    margin-bottom: 0;
  }
`;
