import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Link from 'next/link'

const Container = styled.div`
  background-color: #202225;
  padding: 0 .2rem;
`;

const Ul = styled.ul`
  list-style-type: none;
  padding-left: 0;
  width: 100%;
`;

const Button = styled.button`
  padding: .5rem;
  display: none;
  background-color: transparent;

  a:hover {
  }

  &:active {
  }
`;


const Row = styled.div`
  display: flex;
  align-items: center;
  height: 3.2rem;
  padding: 1.8rem .5rem;
  border-radius: 5px;
  margin-block-start: 2px;

  img {
    height: 50px;
    width: 50px;
    border-radius: 100%;
    transition: border-radius 0.2s ease;
  }

  &:hover {
    cursor: pointer;

    img {
      border-radius: 40%;
    }
  }
`;

const Label = styled.label`
  color: #b9bbbe;
`;

const StyledLink = styled(Link)`
  padding: 1rem;
`;

type InputProps = {
  children?: React.ReactNode;
};

const list = [
  {
    username: "tomat",
    icon: "https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg",
    status: "online"
  },
  {
    username: "tomat",
    icon: "https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg",
    status: "online"
  },
  {
    username: "tomat",
    icon: "https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg",
    status: "online"
  },
  {
    username: "tomat",
    icon: "https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg",
    status: "online"
  },
  {
    username: "tomat",
    icon: "https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg",
    status: "online"
  },
  {
    username: "tomat",
    icon: "https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg",
    status: "online"
  },
];

const Space = styled.div`
  flex-grow: 1;
`;

export const ServerList = ({ children }: InputProps) => {
  const [allUsers, setAllUsers] = useState([]);

  return (
    <Container>
      <Ul>
        {list.map((user, i) => {
          return (
            <Row key={`${user.username}${i}`}>
              <StyledLink href="">
                <img src={user.icon} alt="profile" />
              </StyledLink>
            </Row>
          );
        })}
      </Ul>
    </Container>
  );
};