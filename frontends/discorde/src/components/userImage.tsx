import * as React from 'react';
import styled from 'styled-components';


const Image = styled.img<{ size: number | string}>`
  height: ${({size}) => size}px;
  width: ${({size}) => size}px;
  border-radius: 100%;
`;

interface UserImage {
  url: string;
  size?: number | string;
}
export default function UserImage(props: UserImage) {
  return (
    <Image size={props.size ? props.size : 40} src={props.url} alt='profile'/>
  )
}