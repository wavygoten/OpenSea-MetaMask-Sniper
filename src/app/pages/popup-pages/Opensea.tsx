import * as React from "react";
import {
  Input,
  Button,
  Row,
  Col,
  Container,
  Header,
  Image,
} from "../../components";
type Props = {
  image: string;
  address: string;
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
  click: (e: React.MouseEvent<HTMLElement>) => void;
  mmid: string;
  autoSnipe: (e: any) => Promise<void>;
  clearData: (e: any) => Promise<void>;
};

const Opensea = (props: Props) => {
  return (
    <div
      css={`
        width: 239px;
      `}
    >
      <Container>
        <Row>
          <Image src={props.image} />
          <Col
            css={`
              padding: 0px;
              justify-content: center;
            `}
          >
            <span className="address">
              {props.address
                ? `${props.address.slice(0, 6)}...${props.address.slice(-4)}`
                : "0x0000...0000"}
            </span>
            <span className={props.address ? "connected" : "disconnected"}>
              {props.address ? "Connected" : "Disconnected"}
            </span>
          </Col>
        </Row>
      </Container>
      <Container>
        <Col
          css={`
            padding: 0px;
          `}
        >
          <Header>Settings</Header>

          <Row>
            <Input
              type="text"
              name="discordId"
              placeholder="Discord Webhook"
              onChange={props.handleChange}
            />
            <Button name="discordSave" onClick={props.click}>
              Save
            </Button>
          </Row>
          <Row>
            <Input
              type="text"
              name="metamaskId"
              placeholder="MetaMask Extension ID"
              defaultValue={props.mmid}
              key={props.mmid}
              onChange={props.handleChange}
            />

            <Button name="mmSave" onClick={props.click}>
              Save
            </Button>
          </Row>
          <Row
            css={`
              justify-content: space-between;
            `}
          >
            <Button onClick={props.autoSnipe}>AutoSnipe</Button>
            <Button onClick={props.clearData}>Clear OS Data</Button>
          </Row>
        </Col>
      </Container>{" "}
    </div>
  );
};
export default Opensea;
