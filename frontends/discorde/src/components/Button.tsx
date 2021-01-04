import React from 'react';
import styled from "styled-components";

const StyledButton = styled.button`
  background-color: var(--primary);
  width: 100%;
  padding: 1rem;
  border-radius: 5px;

  &:hover {
    background-color: #677bc4;
  }

  &:active {
    background-color: #5b6eae;
  }
`;


interface ButtonProps {
  children: React.node,
  onClick?: Function,
  type?: submit,
};

export const Button = ({ children, onClick, type, ...props }: ButtonProps) => {
  return (
    <StyledButton
      {...props}
      type={type ? type : 'button'}
      onClick={type === 'submit' ? () => {} : () => onClick()}
    >
      {children}
    </StyledButton>
  );
};
