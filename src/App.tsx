import * as React from "react";
import logo from "./logo.svg";
import "./App.css";

const App = () => {
  const channel = new BroadcastChannel("Funimation");
  const [mmid, setMmid] = React.useState<string>("");
  const [webhook, setWebhook] = React.useState<string>("");

  const [bool, setBool] = React.useState<boolean>();
  const handleChange = async (e: any) => {
    e.preventDefault();
    setMmid(e?.target?.value);
  };
  const handleWebhookChange = async (e: any) => {
    e.preventDefault();
    setWebhook(e?.target?.value);
  };
  const click = async (e: any) => {
    e.preventDefault();
    channel.postMessage({ mmid: mmid });
  };

  const autoSnipe = async (e: any) => {
    e.preventDefault();
  };
  const saveWebhook = async (e: any) => {
    e.preventDefault();
    channel.postMessage({ webhook: webhook });
    chrome.storage.local.set({ webhook: webhook });
  };

  React.useEffect(() => {
    chrome.storage.local.get(["mmid"], (res: any) => {
      if (res?.mmid) {
        setBool(res?.mmid);
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

            <button onClick={click}>Save</button>
          </>
        ) : (
          <>
            {" "}
            <div style={{ display: "flex" }}>
              <input
                type="text"
                name="metamaskId"
                id="metamaskinput"
                placeholder="Discord Webhook"
                onChange={handleWebhookChange}
              />
              <button style={{ marginLeft: "0.5rem" }} onClick={saveWebhook}>
                Save
              </button>
            </div>
            <div style={{ display: "flex" }}>
              <input
                type="text"
                name="metamaskId"
                id="metamaskinput"
                placeholder="MetaMask Extension ID"
                onChange={handleChange}
              />

              <button style={{ marginLeft: "0.5rem" }} onClick={click}>
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
