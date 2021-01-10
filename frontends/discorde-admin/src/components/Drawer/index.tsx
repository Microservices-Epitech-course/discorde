import React, { useState } from 'react';
import { Container } from './style';

const Drawer = () => {
  const [open, setOpen] = useState(false);

  return (
    <Container open={open}>
      <div id="burgerMenu" onClick={(): void => setOpen(!open)}>
        <img alt={open ? 'close' : 'open'} src={open ? 'menu.svg' : 'menu.svg'} />
      </div>
    </Container>
  );
};

export default Drawer;
