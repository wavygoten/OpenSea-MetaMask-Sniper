// This file is injected as a content script
console.log("Hello from content script!");

import { EventEmitter } from "events";
import "./content.css";
const event: EventEmitter = new EventEmitter();
import utils from "./utils/utils";

console.log("Hello from content script!");

var dom_observer = new MutationObserver(async function (mutation) {
  await main();
});
var container = document.documentElement || document.body;
var config = { attributes: true, childList: true, characterData: true };
dom_observer.observe(container, config);

// on load

let tokenId: string;
let assetId: string;
async function main() {
  setInterval(async () => {
    if (
      (document.location.href.includes("https://opensea.io/activity") &&
        document.location.href.includes("AUCTION_CREATED")) ||
      (document.location.href.includes("https://opensea.io/collection") &&
        document.location.href.includes("AUCTION_CREATED"))
    ) {
      let content: any = document.querySelectorAll('[role="listitem"]');
      if (content) {
        content.forEach(async function (element: any, idx: number) {
          if (
            element.children[0].getElementsByClassName("purchase-button")
              .length === 0
          ) {
            const button: HTMLButtonElement = document.createElement("button");
            button.className = "purchase-button";
            button.innerHTML = "Cop Now";

            button.onclick = async () => {
              assetId =
                element.children[0].children[1].children[1].children[0].children[0]
                  .getAttribute("href")
                  .split("/")[2];
              tokenId =
                element.children[0].children[1].children[1].children[0].children[0]
                  .getAttribute("href")
                  .split("/")[3];

              return event.emit("clickedActivity");
            };
            element.children[0].prepend(button);
          }
        });
      }
    }

    if (document.location.href.includes("https://opensea.io/collection")) {
      let content: any = document.querySelectorAll('[role="gridcell"]');
      if (content) {
        content.forEach(async function (element: any, idx: number) {
          if (
            element.children[0].getElementsByClassName(
              "purchase-button-collection"
            ).length === 0
          ) {
            const button: HTMLButtonElement = document.createElement("button");
            button.className = "purchase-button-collection";
            button.innerHTML = "Cop Now";
            button.onclick = async () => {
              assetId = element.children[0]
                .querySelector("a")
                .href.split("/")[4];
              tokenId = element.children[0]
                .querySelector("a")
                .href.split("/")[5];
              return event.emit("clickedCollection");
            };
            element.children[0].prepend(button);
          }
        });
      }
    }

    if (document.location.href.includes("https://opensea.io/assets")) {
      let content: any =
        document.getElementsByClassName("TradeStation--main")[0];
      if (content) {
        if (
          content.getElementsByClassName("purchase-button-assets").length === 0
        ) {
          const button: HTMLButtonElement = document.createElement("button");
          button.className = "purchase-button-assets";
          button.innerHTML = "Cop Now";

          button.onclick = async () => {
            assetId = document.location.href.split("/")[4];
            tokenId = document.location.href.split("/")[5];
            return event.emit("clickedAssets");
          };
          content.append(button);
        }
      }
    }
  }, 1000);
}

event.on("clickedActivity", async () => {
  await toast(true, "Initiating Quick Buy");
  let params = {
    assetId,
    tokenId,
  };
  chrome.runtime.sendMessage({ params });
  const orderData: any = await utils.FetchOrderData(assetId, tokenId);
  console.log(orderData);
});

event.on("clickedCollection", async () => {
  await toast(true, "Initiating Quick Buy");
  let params = {
    assetId,
    tokenId,
  };
  chrome.runtime.sendMessage({ params });
  const orderData: any = await utils.FetchOrderData(assetId, tokenId);
  console.log(orderData);
});

event.on("clickedAssets", async () => {
  await toast(true, "Initiating Quick Buy");
  let params = {
    assetId,
    tokenId,
  };
  chrome.runtime.sendMessage({ params });
  const orderData: any = await utils.FetchOrderData(assetId, tokenId);
  console.log(orderData);
});

chrome.runtime.onMessage.addListener(async (message, sender) => {
  if (message?.error) {
    await toast(message?.error?.error, message?.error?.message);
  }
  if (message?.success) {
    await toast(message?.success?.success, message?.success?.message);
  }
});

async function toast(status?: boolean, message?: string) {
  if (status) {
    const toastcontainer: HTMLDivElement = document.createElement("div");
    const toast: HTMLDivElement = document.createElement("div");
    const svg: SVGElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    const path: SVGElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("stroke", "#fff");
    svg.setAttribute("fill", "#39cca5");
    svg.setAttribute("class", "h-6 w-6");
    svg.setAttribute("width", "24px");
    svg.setAttribute("height", "24px");
    path.setAttribute("stroke-linejoin", "round");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("d", "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z");
    svg.appendChild(path);
    toastcontainer.className = "toast-container";
    toast.className = "toast";
    toast.innerHTML = message || "";
    toastcontainer.appendChild(svg);
    toastcontainer.appendChild(toast);
    document.body.append(toastcontainer);

    setTimeout(() => {
      document.body.removeChild(toastcontainer);
    }, 5000);
  } else {
    const toastcontainer: HTMLDivElement = document.createElement("div");
    const toast: HTMLDivElement = document.createElement("div");
    const svg: SVGElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    const path: SVGElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("stroke", "#fff");
    svg.setAttribute("fill", "#e02832");
    svg.setAttribute("class", "h-6 w-6");
    svg.setAttribute("width", "24px");
    svg.setAttribute("height", "24px");
    path.setAttribute("stroke-linejoin", "round");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-width", "2");
    path.setAttribute("d", "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z");
    svg.appendChild(path);
    toastcontainer.className = "toast-container";
    toast.className = "toast";
    toast.innerHTML = message || "";
    toastcontainer.appendChild(svg);
    toastcontainer.appendChild(toast);
    document.body.append(toastcontainer);

    setTimeout(() => {
      document.body.removeChild(toastcontainer);
    }, 5000);
  }
}
