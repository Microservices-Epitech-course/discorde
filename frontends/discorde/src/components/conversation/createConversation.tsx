import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { createConversation } from 'api';
import { ConversationSearchInput } from 'components/input';
import { ReduxState } from 'store';
import { getUsersFromIds } from 'store/utils';
import { Button } from 'components/button';
import UserImage from 'components/userImage';
import { HiCheck } from 'react-icons/hi';
import { Error } from 'components/text';

const Container = styled.div`
  width: 440px;
  display: flex;
  flex-direction: column;
  align-items: baseline;
  padding: 1rem;
`;

const Title = styled.span`
  font-weight: 600;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
`;

const StyledInput = styled(ConversationSearchInput)`
  padding: .5rem;
  margin: .5rem 0;
`;

const StyledButton = styled(Button)`
  padding: .75rem;
`;

const ButtonContainer = styled.div`
  padding: 1rem 0 0.5rem 0;
  width: 100%;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  padding: 6px 8px;
  height: 40px;
  border-radius: 10px;
  width: 100%;

  &:hover {
    background-color: #4f545c4d;
  }

  .username-bold {
    color: #fff;
    font-weight: 600;
  }

  .status {
    font-size: .85rem;
    text-transform: capitalize;
  }
`;

const RowContainer = styled.li`
  cursor: pointer;
  display: flex;
  &:hover {
    border-top-color: transparent;
    button {
      background-color: #202225;
    }
  }
`;

const Details = styled.div`
  text-align: left;
  margin-left: .8rem;
`;

const FriendListContainer = styled.div`
  max-height: 200px;
  min-height: 200px;
  overflow-y: auto;
  padding: .3rem 0;
  width: 100%;
  align-items: center;
  border-top: 1px solid #18191c4d;
  border-bottom: 1px solid #ffffff0a;
  ${RowContainer}:hover + ${RowContainer} {
    border-top-color: transparent;
  }
`;

const Space = styled.div`
  flex-grow: 1;
`;

const CheckBox = styled.div<{isSelected: boolean}>`
  width: 22px;
  height: 22px;
  ${({isSelected}) => isSelected ? `
    background-color: #fff;
  ` : `
    border: 1px solid #72767d
  `}
`;

interface CreateConversationProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
}
export default function CreateConversation({setOpen}: CreateConversationProps) {
  const me = useSelector((state: ReduxState) => state.me);
  const friends = useSelector((state: ReduxState) => getUsersFromIds(state, state.friends));
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);

  const handleSubmit = async () => {
    const response = await createConversation(dispatch, me, {usersId: [me.id, ...selected]});
    if (!response.success) {
      setError(response.data.data);
    } else {
      setError(null);
      setSearch('');
      setSelected([me.id]);
    };
  }

  const select = (id) => {
    console.log(id);
    if (selected.includes(id)) {
      setSelected(selected.filter((e) => e !== id));
    } else {
      selected.push(id);
      setSelected(Array.from(selected));
    }
  }

  useEffect(() => {
  }, [me]);

  return (
    <Container>
      <Title>Select friends</Title>
      {error && (
        <Error>{error}</Error>
      )}
      <StyledInput placeholder="Type the username of a friend" value={search} onChange={setSearch}/>
      <FriendListContainer>
        {friends.filter((friend) => friend.username.includes(search)).map((friend, i) => {
          const isSelected = selected.includes(friend.id);
          return (
            <RowContainer key={i} onClick={() => select(friend.id)}>
              <Row>
                <UserImage url={friend.image} size={32}/>
                <Details>
                  <span className="username-bold">{friend.username}</span>
                </Details>
                <Space/>
                <CheckBox isSelected={isSelected}>
                  { isSelected && (
                    <HiCheck color="#4f545c" style={{ width: '100%', height: '100%' }}/>
                  )}
                </CheckBox>
              </Row>
            </RowContainer>
          )
        })}
      </FriendListContainer>
      <ButtonContainer>
        <StyledButton disabled={selected.length < 1} onClick={handleSubmit}>
          Create Group DM
        </StyledButton>
      </ButtonContainer>
    </Container>
  );
}