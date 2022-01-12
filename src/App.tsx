import * as React from "react";
import logo from "./logo.svg";
import "./App.css";
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
    <div className="App">
      <header className="App-header">
        <h2 id="title">Sniper Tool</h2>
        {!bool ? (
          <>
            <input
              type="text"
              name="metamaskId"
              id="metamaskinput"
              placeholder="MetaMask Extension ID"
              onChange={handleChange}
            />

            <button name="mmSave" onClick={click}>
              Save
            </button>
          </>
        ) : (
          <>
            <div style={{ display: "flex" }}>
              <input
                type="text"
                name="discordId"
                id="metamaskinput"
                placeholder="Discord Webhook"
                onChange={handleChange}
              />
              <button
                name="discordSave"
                style={{ marginLeft: "0.5rem" }}
                onClick={click}
              >
                Save
              </button>
            </div>
            <div style={{ display: "flex" }}>
              <input
                type="text"
                name="metamaskId"
                id="metamaskinput"
                placeholder="MetaMask Extension ID"
                defaultValue={mmid}
                key={mmid}
                onChange={handleChange}
              />

              <button
                name="mmSave"
                style={{ marginLeft: "0.5rem" }}
                onClick={click}
              >
                Save
              </button>
            </div>
            <button onClick={autoSnipe}>Open AutoSnipe</button>
          </>
        )}
      </header>
    </div>
  );
};

export default App;
