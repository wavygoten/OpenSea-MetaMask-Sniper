import styled from "@emotion/styled";

export const Button = styled.button`
  opacity: 0.8;
  background-color: var(--button-theme);
  color: var(--secondary-light);
  font-size: 12px;
  font-weight: 500;
  outline: none;
  border: none;
  border-radius: 3px;
  padding: 5px 10px;
  &:hover {
    transition: 100ms ease;
    cursor: pointer;
    opacity: 1;
  }
`;
