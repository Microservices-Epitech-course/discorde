import styled from 'styled-components';

export const Container = styled.div<{ open?: boolean }>`
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
