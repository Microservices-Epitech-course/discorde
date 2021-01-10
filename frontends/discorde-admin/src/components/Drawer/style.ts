import styled from 'styled-components';

export const Container = styled.div<{ open?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-weight: bold;
  width: 250px;
  padding: 1rem;
  background-color: var(--primary);
  border-right: 1px solid var(--primary-dark);
  transition: margin-left var(--transition);
  margin-left: ${({ open }) => (!open ? 'calc((250px - 2rem - 15px) * -1)' : 0)};
  & #burgerMenu {
    user-select: none;
    cursor: pointer;
    transition: var(--transition);
    width: ${({ open }) => (open ? '15px' : '100%')};
    text-align: right;
    img {
      width: 15px;
      filter: invert(1);
    }
  }
`;

export const NavigationButton = styled.div<{ active?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin: 0 -1rem;
  padding: 0.5rem 1rem;
  & img {
    filter: invert(1);
    height: 15px;
  }
  &:hover {
    background-color: rgba(100, 100, 100, 0.35);
  }
  ${({ active }) => active && 'background-color: rgba(100, 100, 100, 0.35);'}
`;
