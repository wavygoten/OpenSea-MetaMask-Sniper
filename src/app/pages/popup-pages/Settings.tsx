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
  BasicSwitch,
} from "../../components";

type Props = {
  handleToggles?: any;
  openseaToggle?: boolean;
  looksrareToggle?: boolean;
  stockxToggle?: boolean;
  autofillToggle?: boolean;
};

const Settings = (props: Props) => {
  return (
    <div
      css={`
        width: 239px;
      `}
    >
      <Col
        css={`
          padding: 1rem 1rem 1.5px 1rem;
        `}
      >
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
            align-items: center;
            width: 100%;
          `}
        >
          <div>Opensea</div>

          <BasicSwitch
            onChange={props.handleToggles.openseaToggle}
            checked={props.openseaToggle}
          />
        </Header>
        <Header
          css={`
            border-bottom: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
          `}
        >
          <div>LooksRare</div>

          <BasicSwitch
            onChange={props.handleToggles.looksrareToggle}
            checked={props.looksrareToggle}
          />
        </Header>
        <Header
          css={`
            border-bottom: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
          `}
        >
          <div>Stockx</div>

          <BasicSwitch
            onChange={props.handleToggles.stockxToggle}
            checked={props.stockxToggle}
          />
        </Header>
        <Header
          css={`
            border-bottom: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
          `}
        >
          <div>Autofill</div>

          <BasicSwitch
            onChange={props.handleToggles.autofillToggle}
            checked={props.autofillToggle}
          />
        </Header>
      </Col>
      <Container
        css={`
          padding: 0 1rem 1rem 1rem;
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
