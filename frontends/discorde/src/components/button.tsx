import React from 'react';
import styled from "styled-components";

const StyledButton = styled.button<{ disabled: boolean }>`
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

  &:disabled,
  &[disabled] {
    cursor: not-allowed;
    opacity: .5;
  }
`;


interface ButtonProps {
  children: React.ReactNode,
  onClick?: Function,
  type?: any,
  disabled?: boolean,
};

export const Button = ({ children, onClick, type, disabled, ...props }: ButtonProps) => {
  return (
    <StyledButton
      {...props}
      type={type ? type : 'button'}
      onClick={type === 'submit' ? () => {} : () => onClick()}
      disabled={disabled}
    >
      {children}
    </StyledButton>
  );
};
