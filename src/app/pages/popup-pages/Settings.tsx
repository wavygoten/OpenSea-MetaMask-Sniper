import * as React from "react";
import {
  Input,
  Button,
  Wrapper,
  Row,
  Col,
  Title,
  Container,
  Header,
  Image,
  Svg,
  Navbar,
  TopBar,
} from "../../components";
type Props = {};

const Settings = (props: Props) => {
  return (
    <div
      css={`
        width: 239px;
      `}
    >
      <Col>
        <Header
          css={`
            margin-bottom: 1rem;
            font-size: 18px;
          `}
        >
          Toggles
        </Header>
        <Header
          css={`
            border-bottom: none;
            display: flex;
            justify-content: space-between;
            width: 100%;
          `}
        >
          <div>Opensea</div>
          <Button>Hi</Button>
        </Header>
        <Header
          css={`
            border-bottom: none;
            display: flex;
            justify-content: space-between;
            width: 100%;
          `}
        >
          <div>LooksRare</div>
          <Button>Hi</Button>
        </Header>
        <Header
          css={`
            border-bottom: none;
            display: flex;
            justify-content: space-between;
            width: 100%;
          `}
        >
          <div>Stockx</div>
          <Button>Hi</Button>
        </Header>
        <Header
          css={`
            border-bottom: none;
            display: flex;
            justify-content: space-between;
            width: 100%;
          `}
        >
          <div>Autofill</div>
          <Button>Hi</Button>
        </Header>
      </Col>
      <Container
        css={`
          padding: 0 1rem 1.5px 1rem;
        `}
      >
        <Row
          css={`
            justify-content: space-between;
            * {
              width: 40%;
            }
          `}
        >
          <Button>Autofill</Button>
          <Button>Logout</Button>
        </Row>
        <Row
          css={`
            justify-content: space-between;
            * {
              width: 40%;
            }
          `}
        >
          <Button>Connect</Button>
          <Button>Export</Button>
        </Row>
      </Container>
    </div>
  );
};
export default Settings;
