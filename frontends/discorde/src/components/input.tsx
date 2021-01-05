import styled from "styled-components";

const Container = styled.div`
  text-align: left;
  margin-block-start: 1rem;
  margin-block-end: 1rem;
`;

const InputContainer = styled.div<{ login: boolean }>`
  background-color: ${({ login }) => login ? '#0000001a' : '#40434b'};
  border-radius: ${({ login }) => (login ? "5px" : "10px")};
  padding: 0.9rem 0.6rem;
  border: ${({ login }) => (login ? "1px solid #0000004d" : "none")};
  transition: border-color 0.2s ease-in-out;

  &:focus-within {
    border-color: #7289da;
  }

  input {
    width: 100%;
    color: #dcddde;

    &:focus {
      outline: none;
    }
  }
`;

interface InputProps {
  placeholder?: string,
  login: boolean,
  label?: string,
  type?: string,
  value: string,
  onChange: Function,
};

export const Input = ({ placeholder, login, label, type, value, onChange, ...props }: InputProps) => {
  const handleChange = (e) => onChange(e.target.value);

  return (
    <Container {...props}>
      {login && <label>{label}</label>}
      <InputContainer login={login}>
        <input
          value={value}
          type={type}
          placeholder={placeholder ? placeholder : ""}
          onChange={handleChange}
        />
      </InputContainer>
    </Container>
  );
};
