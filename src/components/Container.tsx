import styled from "styled-components";

export const Container = styled.div`
  padding: 1rem;
  border-bottom: 1px solid rgb(72, 75, 83);
  span {
    font-size: 13px;
    font-weight: 400;
    margin: 2px 0;
  }

  .connected {
    color: var(--hover-theme);
  }

  .disconnected {
    color: red;
  }
`;
