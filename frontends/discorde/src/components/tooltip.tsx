
import React from 'react';
import styled from "styled-components";

const StyledTooltip = styled.div`
  visibility: hidden;
  width: 120px;
  background-color: #0f1215;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: .5rem 0;
  position: absolute;
  z-index: 1;
  bottom: 150%;
  left: 50%;
  margin-left: -60px;
  box-shadow: 5px 5px 16px 0px rgba(0, 0, 0, 0.3);

  &::after {
    content: " ";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #0f1215 transparent transparent transparent;
  }
`;

const StyledTooltipContainer = styled.div`
  position: relative;
  display: inline-block;

  &:hover {
    ${StyledTooltip} {
      visibility: visible;
    }
  }
`;

interface TooltipProps {
  children: React.ReactNode,
  text: string,
};

export const Tooltip = ({ text, children, ...props }: TooltipProps) => {
  return (
    <StyledTooltipContainer {...props}>
      {children}
      <StyledTooltip>
        {text}
      </StyledTooltip>
    </StyledTooltipContainer>
  );
};
