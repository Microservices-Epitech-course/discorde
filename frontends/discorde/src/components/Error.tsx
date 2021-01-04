import React from 'react';
import styled from "styled-components";

const StyledError = styled.p`
  color: var(--error);
  text-transform: uppercase;
  font-weight: 600;
  font-size: 0.7rem;
  font-weight: 600;
`;

interface ErrorProps {
  children: React.node,
};

export const Error = ({ children, ...props }: ErrorProps) => {
  return (
    <StyledError {...props}>
      {children}
    </StyledError>
  );
};
