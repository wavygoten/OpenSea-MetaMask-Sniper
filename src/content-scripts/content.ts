// This file is injected as a content script
// console.log("Hello from content script!");

import { EventEmitter } from "events";
import { scaleLinear } from "d3-scale";
import "../styles/content.css";
import utils from "../utils/utils";
const event: EventEmitter = new EventEmitter();
let contentData: any[] = [];
let contractData: string;
let tokenId: string;
let assetId: string;

// running functions based on toggle in popup

chrome.storage.local.get(["opensea"], async (res: any) => {
  if (res.opensea) {
    await openSea();
  }
});
chrome.storage.local.get(["looksrare"], async (res: any) => {
  if (res.looksrare) {
    await looksRare();
  }
});
chrome.storage.local.get(["stockx"], async (res: any) => {
  if (res.stockx) {
    await stockX();
  }
});

// openSea();
// looksRare();
// stockX();
async function openSea() {
  setInterval(async () => {
    let list: any = document.querySelectorAll('[role="listitem"]');
    let grid: any = document.querySelectorAll('[role="gridcell"]');
    let card: any = document.querySelectorAll('[role="card"]');
    let assets: any = document.getElementsByClassName("TradeStation--main")[0];
    if (!document.location.href.includes("https://opensea.io/account")) {
      listItemAppend(list);
    }
    Promise.all([
      gridCellCardAppend(grid),
      gridCellCardAppend(card),
      TradeStationAppend(assets),
    ]);
  }, 1000);
}

async function looksRare() {
  if (document.location.href.includes("https://looksrare.org/collections")) {
    contentData = [];
    var dom_observer = new MutationObserver(async function (mutation) {
      contentData = [];
    });
    var container = document.documentElement || document.body;
    var config = { attributes: true, childList: true, characterData: true };
    dom_observer.observe(container, config);
    setInterval(() => {
      if (contentData.length > 0) {
        let content: any = document.querySelectorAll(".lazyload-wrapper");
        if (content) {
          content.forEach(async function (element: any, idx: number) {
            if (
              element?.getElementsByClassName("traitsurfer-rarity-container")
                .length === 0
            ) {
              const rarityContainer: HTMLDivElement =
                document.createElement("div");
              const rarityRank: HTMLDivElement = document.createElement("div");
              const rarityPercent: HTMLDivElement =
                document.createElement("div");

              rarityContainer.className = "traitsurfer-rarity-container";
              rarityContainer.style.cssText =
                "margin-top: 0; border-radius: 0px; background-color: #21262A";
              rarityRank.className = "traitsurfer-rarity-rank";
              rarityPercent.className = "traitsurfer-rarity-percentage";
              rarityPercent.style.cssText =
                "color: #000;background-color: #2DE370;";
              for (let item in contentData) {
                let temptoken: string = element
                  ?.querySelectorAll("a")[1]
                  ?.href?.split("/")[5];

                if (contentData[item]?.tokenid === temptoken) {
                  rarityRank.innerHTML = `${contentData[item]?.rank} / ${contentData.length}`;
                  rarityPercent.innerHTML = `${(
                    (contentData[item]?.rank / contentData.length) *
                    100
                  ).toFixed(1)} %`;
                  rarityContainer.appendChild(rarityRank);
                  rarityContainer.appendChild(rarityPercent);
                  element?.children[0]?.prepend(rarityContainer);
                }
              }
            }
          });
        }
      } else {
        if (!contentData.includes("error")) {
          contentData = [];
        }
        contractData = document.location.href?.split("/")[4]?.split("#")[0];
        if (contentData.length === 0) {
          chrome.runtime.sendMessage({ getContractData: true });
        }
      }
    }, 1000);
  }
}

async function stockX() {
  // add toggle to turn on and off from popup
  if (
    document.location.href.includes("https://stockx.com") &&
    !document.location.href.includes("https://stockx.com/buy")
  ) {
    window.onload = async () => {
      if (document?.querySelector('[data-component="NFTHeroView"]')) {
        document
          ?.querySelector(".chakra-stack")
          ?.children[0]?.querySelector("a")
          ?.click();
      }
    };
  }
  const func = async () => {
    if (document.location.href.includes("https://stockx.com/buy")) {
      if (
        document?.querySelectorAll('[data-testid="bottom-button-bar-wrapper"]')
          .length > 0
      ) {
        if (
          document
            ?.querySelector('[data-testid="bottom-button-bar-wrapper"]')
            ?.querySelectorAll("button")[1].innerHTML === "Review Order"
        ) {
          document
            ?.querySelector('[data-testid="bottom-button-bar-wrapper"]')
            ?.querySelectorAll("button")[1]
            ?.click();
        } else if (
          document
            ?.querySelector('[data-testid="bottom-button-bar-wrapper"]')
            ?.querySelectorAll("button")[1].innerHTML === "Place Order"
        ) {
          document
            ?.querySelector('[data-testid="bottom-button-bar-wrapper"]')
            ?.querySelectorAll("button")[1]
            ?.click();
          await toast(true, "Placing order...");
          clearInterval(interval);
        }
      }
      // document?.querySelector('[data-testid="bidask-bottom-right-btn"]');
    }
  };
  const interval = setInterval(func, 1000);
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
  if (message?.mainData) {
    if (message?.mainData.length < 1) {
      chrome.runtime.sendMessage({ contractData: contractData });
    } else {
      if (
        JSON.stringify(message?.mainData).indexOf(
          contractData?.toLowerCase()
        ) !== -1
      ) {
        for (let i: number = 0; i < message?.mainData.length; i++) {
          if (
            message?.mainData[i]?.contractData === contractData?.toLowerCase()
          ) {
            contentData = message?.mainData[i]?.data;
          }
        }
      } else {
        chrome.runtime.sendMessage({ contractData: contractData });
      }
    }
  }
  if (message?.scrapeError) {
    contentData = ["error"];
  }
  if (message?.queryData) {
    contentData.push(message?.queryData);
  }
});

function listItemAppend(selectors: any) {
  if (selectors) {
    selectors.forEach(async function (element: any, idx: number) {
      // buy stuff
      if (
        element?.children[0].getElementsByClassName(
          "traitsurfer-purchase-button"
        ).length === 0
      ) {
        if (
          element?.children[0]?.children[0]?.children[5]?.querySelector("p")
            ?.innerHTML === "---"
        ) {
          const button: HTMLButtonElement = document.createElement("button");

          button.className = "traitsurfer-purchase-button";
          button.innerHTML = "Cop Now";

          button.onclick = async () => {
            assetId = element
              ?.querySelector("a")
              ?.getAttribute("href")
              ?.split("/")[2];
            tokenId = element
              ?.querySelector("a")
              ?.getAttribute("href")
              ?.split("/")[3];

            return event.emit("clickedActivity");
          };

          element?.children[0]?.prepend(button);
          if (idx < 1) {
            if (!contentData.includes("error")) {
              contentData = [];
            }
            contractData = element
              ?.querySelector("a")
              ?.getAttribute("href")
              ?.split("/")[2];
            if (contentData.length === 0) {
              chrome.runtime.sendMessage({ getContractData: true });
            }
          }
        }
      }
      // rarity stuff
      if (
        element?.children[0]?.getElementsByClassName(
          "traitsurfer-rarity-container"
        ).length === 0
      ) {
        const rarityContainer: HTMLDivElement = document.createElement("div");
        const rarityRank: HTMLDivElement = document.createElement("div");
        const rarityPercent: HTMLDivElement = document.createElement("div");
        rarityContainer.className = "traitsurfer-rarity-container";
        rarityRank.className = "traitsurfer-rarity-rank";
        rarityPercent.className = "traitsurfer-rarity-percentage";
        // if (arrSize > 0) {
        //   let contract = element
        //     ?.querySelector("a")
        //     ?.getAttribute("href")
        //     ?.split("/")[2];
        //   let token = element
        //     ?.querySelector("a")
        //     ?.getAttribute("href")
        //     ?.split("/")[3];
        //   queryContractData = {
        //     contract,
        //     token,
        //   };
        //   chrome.runtime.sendMessage({ queryContractData });

        //   for (let item in mainData) {
        //     if (mainData[item]?.tokenid === token) {
        //       let rank = `${mainData[item]?.rank} / ${arrSize}`;
        //       let percent = `${((mainData[item]?.rank / arrSize) * 100).toFixed(
        //         1
        //       )} %`;
        //       rarityRank.innerHTML = rank;
        //       rarityPercent.innerHTML = percent;

        //       rarityPercent.style.cssText = `background-color:${hexScaleOpensea(
        //         (mainData[item]?.rank / arrSize) * 100
        //       )};`;

        //       rarityContainer.appendChild(rarityRank);
        //       rarityContainer.appendChild(rarityPercent);
        //       element?.children[0]?.querySelector("a")?.append(rarityContainer);
        //     }
        //   }
        // }

        for (let item in contentData) {
          let temptoken: string = element
            ?.querySelector("a")
            ?.getAttribute("href")
            ?.split("/")[3];
          if (contentData[item]?.tokenid === temptoken) {
            let rank = `${contentData[item]?.rank} / ${contentData.length}`;
            let percent = `${(
              (contentData[item]?.rank / contentData.length) *
              100
            ).toFixed(1)} %`;
            rarityRank.innerHTML = rank;
            rarityPercent.innerHTML = percent;
            rarityPercent.style.cssText = `background-color:${hexScaleOpensea(
              (contentData[item]?.rank / contentData.length) * 100
            )};`;
            rarityContainer.appendChild(rarityRank);
            rarityContainer.appendChild(rarityPercent);
            element?.children[0]?.querySelector("a")?.append(rarityContainer);
          }
        }
      }
    });
  }
}

function gridCellCardAppend(selectors: any) {
  if (selectors) {
    selectors.forEach(async function (element: any, idx: number) {
      if (
        element?.children[0].getElementsByClassName(
          "traitsurfer-purchase-button-collection"
        ).length === 0
      ) {
        const button: HTMLButtonElement = document.createElement("button");
        const divFlex: HTMLDivElement = document.createElement("div");
        divFlex.className = "traitsurfer-flex";
        divFlex.style.cssText =
          "display:flex; flex-direction:column; align-items:center;";
        button.className = "traitsurfer-purchase-button-collection";
        button.innerHTML = "Cop Now";
        button.onclick = async () => {
          assetId = element?.children[0]
            ?.querySelector("a")
            ?.href?.split("/")[4];
          tokenId = element?.children[0]
            ?.querySelector("a")
            ?.href?.split("/")[5];
          return event.emit("clickedCollection");
        };
        divFlex.appendChild(button);
        element?.querySelector("article").prepend(divFlex);
        if (idx < 1) {
          if (!contentData.includes("error")) {
            contentData = [];
          }
          contractData = element?.children[0]
            ?.querySelector("a")
            ?.href?.split("/")[4];
          if (contentData.length === 0) {
            chrome.runtime.sendMessage({ getContractData: true });
          }
        }
      }
      if (
        element.children[0].getElementsByClassName(
          "traitsurfer-rarity-container"
        ).length === 0
      ) {
        const rarityContainer: HTMLDivElement = document.createElement("div");
        const rarityRank: HTMLDivElement = document.createElement("div");
        const rarityPercent: HTMLDivElement = document.createElement("div");

        rarityContainer.className = "traitsurfer-rarity-container";
        rarityRank.className = "traitsurfer-rarity-rank";
        rarityPercent.className = "traitsurfer-rarity-percentage";
        rarityContainer.style.cssText = "margin-top: 0; width: 100%; ";

        // if (arrSize > 0) {
        //   let contract = element?.children[0]
        //     ?.querySelector("a")
        //     ?.href?.split("/")[4];
        //   let token = element?.children[0]
        //     ?.querySelector("a")
        //     ?.href?.split("/")[5];
        //   queryContractData = {
        //     contract,
        //     token,
        //   };
        //   chrome.runtime.sendMessage({ queryContractData });

        //   for (let item in mainData) {
        //     if (mainData[item]?.tokenid === token) {
        //       let rank = `${mainData[item]?.rank} / ${arrSize}`;
        //       let percent = `${((mainData[item]?.rank / arrSize) * 100).toFixed(
        //         1
        //       )} %`;
        //       rarityRank.innerHTML = rank;
        //       rarityPercent.innerHTML = percent;

        //       rarityPercent.style.cssText = `background-color:${hexScaleOpensea(
        //         (mainData[item]?.rank / arrSize) * 100
        //       )};`;

        //       rarityContainer.appendChild(rarityRank);
        //       rarityContainer.appendChild(rarityPercent);
        //       element?.children[0]
        //         ?.querySelector(".traitsurfer-flex")
        //         ?.append(rarityContainer);
        //     }
        //   }
        // }
        for (let item in contentData) {
          let temptoken: string = element.children[0]
            ?.querySelector("a")
            ?.href?.split("/")[5];
          if (contentData[item]?.tokenid === temptoken) {
            let rank = `${contentData[item]?.rank} / ${contentData.length}`;
            let percent = `${(
              (contentData[item]?.rank / contentData.length) *
              100
            ).toFixed(1)} %`;
            rarityRank.innerHTML = rank;
            rarityPercent.innerHTML = percent;
            // add color combo here
            rarityPercent.style.cssText = `background-color:${hexScaleOpensea(
              (contentData[item]?.rank / contentData.length) * 100
            )};`;
            rarityContainer.appendChild(rarityRank);
            rarityContainer.appendChild(rarityPercent);
            element.children[0]
              ?.querySelector(".traitsurfer-flex")
              ?.append(rarityContainer);
          }
        }
      }
    });
  }
}

function TradeStationAppend(selectors: any) {
  if (selectors) {
    if (
      selectors.getElementsByClassName("traitsurfer-purchase-button-assets")
        .length === 0
    ) {
      const button: HTMLButtonElement = document.createElement("button");
      button.className = "traitsurfer-purchase-button-assets";
      button.innerHTML = "Cop Now";

      button.onclick = async () => {
        assetId = document.location.href?.split("/")[4];
        tokenId = document.location.href?.split("/")[5];
        return event.emit("clickedAssets");
      };
      selectors.append(button);
    }
  }
}

function hexScaleOpensea(percent: number) {
  let hex: any;
  if (percent <= 5) {
    hex = scaleLinear<string, number>()
      .range(["#931cc9", "#a920e8"])
      .domain([0, 5]);
  } else if (percent > 5 && percent <= 15) {
    hex = scaleLinear<string, number>()
      .range(["#221bb3", "#3429ff"])
      .domain([0, 10]);
  } else if (percent > 15 && percent <= 100) {
    hex = scaleLinear<string, number>()
      .range(["#196cbf", "#1c78d4"])
      .domain([0, 50]);
  }
  if (percent) return hex(percent);
}
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
