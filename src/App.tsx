import * as React from "react";
import "./App.css";
import { Input, Button, Wrapper, Row, Title } from "./components";
import styled from "styled-components/macro";
const App = () => {
  const channel = new BroadcastChannel("Funimation");
  const [webhook, setWebhook] = React.useState<string>("");
  const [bool, setBool] = React.useState<boolean>();
  const [mmid, setMmid] = React.useState<string>("");
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
  }, []);

  return (
    <Wrapper>
      <Title>
        <div>Trait Surfer</div>
      </Title>
      {!bool ? (
        <>
          <Input
            type="text"
            name="metamaskId"
            id="metamaskinput"
            placeholder="MetaMask Extension ID"
            onChange={handleChange}
          />

          <Button name="mmSave" onClick={click}>
            Save
          </Button>
        </>
      ) : (
        <>
          <Row css="margin: 0.5rem 0;">
            <Input
              type="text"
              name="discordId"
              id="metamaskinput"
              placeholder="Discord Webhook"
              onChange={handleChange}
            />
            <Button
              name="discordSave"
              style={{ marginLeft: "0.5rem" }}
              onClick={click}
            >
              Save
            </Button>
          </Row>
          <Row>
            <Input
              type="text"
              name="metamaskId"
              id="metamaskinput"
              placeholder="MetaMask Extension ID"
              defaultValue={mmid}
              key={mmid}
              onChange={handleChange}
            />

            <Button
              name="mmSave"
              style={{ marginLeft: "0.5rem" }}
              onClick={click}
            >
              Save
            </Button>
          </Row>
          <Button onClick={autoSnipe}>Open AutoSnipe</Button>
        </>
      )}
    </Wrapper>
  );
};

export default App;
