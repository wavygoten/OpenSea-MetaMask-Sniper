import styled from "styled-components";

export const Button = styled.button`
  background-color: var(--main-theme);
  color: var(--secondary-light);
  outline: none;
  border: none;
  border-radius: 3px;
  padding: 3px 6px;
  margin: 0.5rem 0;
  &:hover {
    background-color: var(--hover-theme);
    transition: 100ms ease;
    cursor: pointer;
  }
`;
