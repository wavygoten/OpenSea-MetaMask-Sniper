import * as React from "react";
import * as ReactDOM from "react-dom";
import "./autosnipe.css";
import { Notyf } from "notyf";
import "notyf/notyf.min.css"; // for React, Vue and Svelte
import axios from "axios";
import { ethers } from "ethers";
import utils from "./utils/utils";
const Autosnipe = () => {
  const channel = new BroadcastChannel("Funimation");
  const [collectionSlug, setCollectionSlug] = React.useState<string>("");
  const [price, setPrice] = React.useState<any>();
  const [monitoring, setMonitoring] = React.useState<boolean>(false);
  const notyf = new Notyf({
    duration: 3500,
    types: [
      {
        type: "info",
        background: "#406aa8",
        icon: false,
      },
    ],
  });
  let currentArr: any[] = [];
  let newArr: any[] = [];
  const handleClick = (e: any) => {
    e.preventDefault();
    switch (e?.target?.name) {
      case "startMonitor":
        if (price && collectionSlug) {
          setMonitoring(true);
          notyf.success(
            `Monitoring ${collectionSlug} listings under ${price} Ξ`
          );
        } else {
          notyf.error("Please fill out slug and price");
        }
        break;
      case "stopMonitor":
        setMonitoring(false);
        notyf.success(`Successfully stopped monitoring`);
      default:
        break;
    }
  };

  const handleChange = (e: any) => {
    switch (e?.target?.name) {
      case "collection":
        setCollectionSlug(e?.target?.value);
        break;
      default:
        setPrice(e?.target?.value);
        break;
    }
  };

  React.useEffect(() => {
    if (monitoring) {
      // first get static data
      const URLPARAMS = new URLSearchParams({
        collection_slug: collectionSlug,
        event_type: "created",
        only_opensea: "false",
        offset: "0",
        limit: "30",
      });
      axios({
        method: "GET",
        url: `https://api.opensea.io/api/v1/events?${URLPARAMS}`,
        headers: {
          Accept: "application/json",
          "X-API-KEY": "6a5959ab6ed841278cb3545d4f4acc4a",
        },
      })
        .then((res: any) => {
          if (res?.data?.asset_events.length > 0) {
            currentArr = res?.data?.asset_events;
          } else {
            currentArr = [];
          }
        })
        .catch((err: any) => {
          console.log(err);
        });
      const interval = setInterval(() => {
        // do monitoring here... working rn :p
        const URLPARAMS = new URLSearchParams({
          collection_slug: collectionSlug,
          event_type: "created",
          only_opensea: "false",
          offset: "0",
          limit: "30",
        });
        axios({
          method: "GET",
          url: `https://api.opensea.io/api/v1/events?${URLPARAMS}`,
          headers: {
            Accept: "application/json",
            "X-API-KEY": "6a5959ab6ed841278cb3545d4f4acc4a",
          },
        })
          .then((res: any) => {
            if (res?.data?.asset_events.length > 0) {
              newArr = res?.data?.asset_events;
              const filtered = newArr.filter(function (obj: any) {
                return !currentArr.some(function (obj2: any) {
                  return obj?.asset?.id == obj2?.asset?.id;
                });
              });
              if (filtered.length > 0) {
                for (let i = 0; i < filtered.length; i++) {
                  if (filtered[i]?.asset) {
                    if (
                      parseFloat(
                        ethers.utils.formatEther(filtered[i]?.starting_price)
                      ) <= price
                    ) {
                      const params = {
                        assetId: filtered[i]?.asset?.asset_contract?.address,
                        tokenId: filtered[i]?.asset?.token_id,
                      };
                      channel.postMessage({ params });
                      notyf.success(
                        `Successfully found listing ${filtered[i]?.asset?.token_id}`
                      );
                    }
                  }
                }
                currentArr = newArr;
              }
            } else {
              notyf.error(`Collection slug not found... Stopping monitor`);
              clearInterval(interval);
            }
          })
          .catch((err: any) => {
            console.log(err);
          });
      }, 7500);

      return () => clearInterval(interval);
    } else {
      return;
    }
  }, [monitoring, price, collectionSlug]);

  return (
    <div className="container">
      <div className="sniper-title">Sniper Tool</div>
      <div className="inputone">
        <span>Collection Slug</span>
        <input
          name="collection"
          type="text"
          placeholder="collection-slug"
          onChange={handleChange}
          disabled={monitoring}
        />
      </div>
      <div className="inputtwo">
        <span>Snipe below</span>
        <input
          name="price"
          type="text"
          placeholder="0.42 Ξ"
          onChange={handleChange}
          disabled={monitoring}
        />
      </div>
      <div className="button-container">
        <button disabled={monitoring} name="startMonitor" onClick={handleClick}>
          {monitoring ? "Monitoring..." : "Start Monitor"}
        </button>
        <button disabled={!monitoring} name="stopMonitor" onClick={handleClick}>
          Stop Monitor
        </button>
      </div>
    </div>
  );
};

var mountNode = document.getElementById("autosnipe");
ReactDOM.render(<Autosnipe />, mountNode);
