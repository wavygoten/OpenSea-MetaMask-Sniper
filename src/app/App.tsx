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
  const [openseatoggle, openseaToggleIsOn] = React.useState<boolean>(false);
  const [looksraretoggle, looksrareToggleIsOn] = React.useState<boolean>(false);
  const [stockxtoggle, stockxToggleIsOn] = React.useState<boolean>(false);
  const [x2y2toggle, x2y2ToggleIsOn] = React.useState<boolean>(false);
  const [autofilltoggle, autofillToggleIsOn] = React.useState<boolean>(false);

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

  class handleToggleChange {
    openseaToggle() {
      chrome.storage.local.set({ opensea: !openseatoggle });
      openseaToggleIsOn(!openseatoggle);
    }

    looksrareToggle() {
      chrome.storage.local.set({ looksrare: !looksraretoggle });
      looksrareToggleIsOn(!looksraretoggle);
    }

    stockxToggle() {
      chrome.storage.local.set({ stockx: !stockxtoggle });
      stockxToggleIsOn(!stockxtoggle);
    }
    x2y2Toggle() {
      chrome.storage.local.set({ x2y2: !x2y2toggle });
      x2y2ToggleIsOn(!x2y2toggle);
    }

    autofillToggle() {
      autofillToggleIsOn(!autofilltoggle);
    }
  }

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
    chrome.storage.local.get(["opensea"], (res: any) => {
      if (res?.opensea) {
        openseaToggleIsOn(res?.opensea);
      }
    });
    chrome.storage.local.get(["looksrare"], (res: any) => {
      if (res?.looksrare) {
        looksrareToggleIsOn(res?.looksrare);
      }
    });
    chrome.storage.local.get(["stockx"], (res: any) => {
      if (res?.stockx) {
        stockxToggleIsOn(res?.stockx);
      }
    });
    chrome.storage.local.get(["x2y2"], (res: any) => {
      if (res?.x2y2) {
        x2y2ToggleIsOn(res?.x2y2);
      }
    });

    return () => {
      setMmid("");
      setBool(false);
      setAddress("");
      setImage("");
      openseaToggleIsOn(false);
      looksrareToggleIsOn(false);
      stockxToggleIsOn(false);
      x2y2ToggleIsOn(false);
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
              <Route
                path="/settings"
                element={
                  <Settings
                    handleToggles={new handleToggleChange()}
                    openseaToggle={openseatoggle}
                    looksrareToggle={looksraretoggle}
                    stockxToggle={stockxtoggle}
                    x2yxToggle={x2y2toggle}
                  />
                }
              />
            </Routes>
            <Navbar />
          </>
        )}
      </Wrapper>
    </Router>
  );
};

export default App;
