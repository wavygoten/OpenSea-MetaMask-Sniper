import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "../styles/App.css";
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
} from "./components";
import Opensea from "./pages/popup-pages/Opensea";
import Settings from "./pages/popup-pages/Settings";

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
    chrome.tabs.create({ url: chrome.runtime.getURL("autosnipe.html") });
  };
  const traitSurfer = async (e: any) => {
    e.preventDefault();
    chrome.tabs.create({ url: "https://traitsurfer.app" });
  };

  // handle global vars
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

    return () => {
      setMmid("");
      setBool(false);
      setAddress("");
      setImage("");
    };
  }, []);

  return (
    <Router>
      <Wrapper>
        <TopBar traitSurfer={traitSurfer} />
        {!bool ? (
          <Col>
            <Input
              type="text"
              name="metamaskId"
              placeholder="MetaMask Extension ID"
              onChange={handleChange}
            />

            <Button
              css={`
                margin-top: 0.5rem;
              `}
              name="mmSave"
              onClick={click}
            >
              Save
            </Button>
          </Col>
        ) : (
          <>
            <Routes>
              <Route
                path="*"
                element={
                  <Opensea
                    image={image}
                    address={address}
                    handleChange={handleChange}
                    click={click}
                    mmid={mmid}
                    autoSnipe={autoSnipe}
                    clearData={clearData}
                  />
                }
              />
              <Route path="/settings" element={<Settings />} />
            </Routes>
            <Navbar />
          </>
        )}
      </Wrapper>
    </Router>
  );
};

export default App;
