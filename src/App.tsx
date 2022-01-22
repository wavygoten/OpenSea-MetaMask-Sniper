import * as React from "react";
import "./App.css";
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
} from "./components";
import axios from "axios";
var manifest = chrome.runtime.getManifest();

const App = () => {
  const channel = new BroadcastChannel("Funimation");
  const [webhook, setWebhook] = React.useState<string>("");
  const [bool, setBool] = React.useState<boolean>();
  const [mmid, setMmid] = React.useState<string>("");
  const [address, setAddress] = React.useState<string>("");
  const [image, setImage] = React.useState<string>("");
  const handleChange = async (e: any) => {
    e.preventDefault();
    switch (e?.target?.name) {
      case "discordId":
        setWebhook(e?.target?.value);
        break;
      default:
        setMmid(e?.target?.value);
        break;
    }
  };

  const click = async (e: any) => {
    e.preventDefault();
    switch (e?.target?.name) {
      case "mmSave":
        channel.postMessage({ mmid: mmid });
        break;
      default:
        channel.postMessage({ webhook: webhook });
        chrome.storage.local.set({ webhook: webhook });
        break;
    }
  };

  const clearData = async (e: any) => {
    e.preventDefault();
    channel.postMessage({ clearosdata: true });
  };

  const autoSnipe = async (e: any) => {
    e.preventDefault();
    chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
  };

  React.useEffect(() => {
    chrome.storage.local.get(["mmid"], (res: any) => {
      if (res?.mmid) {
        setMmid(res.mmid);
        setBool(true);
      }
    });
    chrome.storage.local.get(["address"], (res: any) => {
      if (res?.address) {
        setAddress(res.address);
      }
    });
    chrome.storage.local.get(["image"], (res: any) => {
      if (res?.image) {
        setImage(res.image);
      }
    });
  }, []);

  return (
    <Wrapper>
      <Title>
        <div>Trait Surfer</div>
      </Title>
      {!bool ? (
        <Col>
          <Input
            type="text"
            name="metamaskId"
            placeholder="MetaMask Extension ID"
            onChange={handleChange}
          />

          <Button name="mmSave" onClick={click} style={{ marginTop: "0.5rem" }}>
            Save
          </Button>
        </Col>
      ) : (
        <>
          <Container>
            <Col style={{ padding: "0" }}>
              <span className="address">
                {address
                  ? `${address.slice(0, 6)}...${address.slice(-4)}`
                  : "0x0000...0000"}
              </span>
              <span className={address ? "connected" : "disconnected"}>
                {address ? "Connected" : "Disconnected"}
              </span>
            </Col>
          </Container>
          <Container>
            <Col style={{ padding: "0" }}>
              <Header>Settings</Header>

              <Row>
                <Input
                  type="text"
                  name="discordId"
                  placeholder="Discord Webhook"
                  onChange={handleChange}
                />
                <Button name="discordSave" onClick={click}>
                  Save
                </Button>
              </Row>
              <Row>
                <Input
                  type="text"
                  name="metamaskId"
                  placeholder="MetaMask Extension ID"
                  defaultValue={mmid}
                  key={mmid}
                  onChange={handleChange}
                />

                <Button name="mmSave" onClick={click}>
                  Save
                </Button>
              </Row>
              <Row style={{ justifyContent: "space-between" }}>
                <Button onClick={autoSnipe}>AutoSnipe</Button>
                <Button onClick={clearData}>Clear OS Data</Button>
              </Row>
            </Col>
          </Container>
          <Col>
            <Row style={{ margin: "0", flexDirection: "row-reverse" }}>
              <div className="version">Version {manifest.version}</div>
            </Row>
          </Col>
        </>
      )}
    </Wrapper>
  );
};

export default App;
