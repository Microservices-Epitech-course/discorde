
import React, { useEffect } from 'react';
import styled from "styled-components";

const StyledPopup = styled.div<{open: boolean}>`
  visibility: ${({open}) => open ? 'visible' : 'hidden'};
  min-width: 120px;
  background-color: #36393f;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  position: absolute;
  z-index: 1;
  top: 15px;
  margin-left: -20px;
  box-shadow: 5px 5px 16px 0px rgba(0, 0, 0, 0.3);

`;

const StyledPopupContainer = styled.div`
  position: relative;
  display: inline-block;
`;

interface TooltipProps {
  open: boolean,
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  children: React.ReactNode,
};

export default function Popup({ children, open, setOpen, ...props }: TooltipProps) {
  function bodyOnClick() {
    setOpen(false);
  }

  useEffect(() => {
    if (open) document.body.addEventListener('click', bodyOnClick);
    else document.body.removeEventListener('click', bodyOnClick);
    return () => document.body.removeEventListener('click', bodyOnClick);
  }, [open]);

  return (
    <StyledPopupContainer {...props} onClick={(e) => e.stopPropagation()}>
      <StyledPopup open={open}>
        {children}
      </StyledPopup>
    </StyledPopupContainer>
  );
};
