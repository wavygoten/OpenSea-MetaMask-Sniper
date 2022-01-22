// This file is injected as a content script
// console.log("Hello from content script!");

import { EventEmitter } from "events";
import { scaleLinear } from "d3-scale";
import "./content.css";
const event: EventEmitter = new EventEmitter();
import utils from "./utils/utils";
let contentData: any[] = [];
let contractData: string;
let tokenId: string;
let assetId: string;

main();
looksRare();
async function main() {
  setInterval(async () => {
    if (!document.location.href.includes("https://opensea.io/account")) {
      let list: any = document.querySelectorAll('[role="listitem"]');
      if (list) {
        list.forEach(async function (element: any, idx: number) {
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
              const button: HTMLButtonElement =
                document.createElement("button");

              button.className = "traitsurfer-purchase-button";
              button.innerHTML = "Cop Now";

              button.onclick = async () => {
                assetId = element
                  ?.querySelector("a")
                  ?.getAttribute("href")
                  .split("/")[2];
                tokenId = element
                  ?.querySelector("a")
                  ?.getAttribute("href")
                  .split("/")[3];

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
                  .split("/")[2];
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
            const rarityContainer: HTMLDivElement =
              document.createElement("div");
            const rarityRank: HTMLDivElement = document.createElement("div");
            const rarityPercent: HTMLDivElement = document.createElement("div");
            rarityContainer.className = "traitsurfer-rarity-container";
            rarityRank.className = "traitsurfer-rarity-rank";
            rarityPercent.className = "traitsurfer-rarity-percentage";

            for (let item in contentData) {
              let temptoken: string = element
                ?.querySelector("a")
                ?.getAttribute("href")
                .split("/")[3];
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
                element?.children[0]
                  ?.querySelector("a")
                  ?.append(rarityContainer);
              }
            }
          }
        });
      }
    }
    let grid: any = document.querySelectorAll('[role="gridcell"]');
    if (grid) {
      grid.forEach(async function (element: any, idx: number) {
        if (
          element?.children[0].getElementsByClassName(
            "traitsurfer-purchase-button-collection"
          ).length === 0
        ) {
          const button: HTMLButtonElement = document.createElement("button");
          const divFlex: HTMLDivElement = document.createElement("div");
          divFlex.className = "traitsurfer-flex";
          divFlex.style.cssText = "display:flex; align-items:center;";
          button.className = "traitsurfer-purchase-button-collection";
          button.innerHTML = "Cop Now";
          button.style.cssText = "flex: 1;";
          button.onclick = async () => {
            assetId = element?.children[0]
              ?.querySelector("a")
              ?.href.split("/")[4];
            tokenId = element?.children[0]
              ?.querySelector("a")
              ?.href.split("/")[5];
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
              ?.href.split("/")[4];
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
          rarityContainer.style.cssText = "margin-top: 0;";
          for (let item in contentData) {
            let temptoken: string = element.children[0]
              ?.querySelector("a")
              ?.href.split("/")[5];
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

    let assets: any = document.getElementsByClassName("TradeStation--main")[0];
    if (assets) {
      if (
        assets.getElementsByClassName("traitsurfer-purchase-button-assets")
          .length === 0
      ) {
        const button: HTMLButtonElement = document.createElement("button");
        button.className = "traitsurfer-purchase-button-assets";
        button.innerHTML = "Cop Now";

        button.onclick = async () => {
          assetId = document.location.href.split("/")[4];
          tokenId = document.location.href.split("/")[5];
          return event.emit("clickedAssets");
        };
        assets.append(button);
      }
    }
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
              element?.getElementsByClassName("rarity-container").length === 0
            ) {
              const rarityContainer: HTMLDivElement =
                document.createElement("div");
              const rarityRank: HTMLDivElement = document.createElement("div");
              const rarityPercent: HTMLDivElement =
                document.createElement("div");

              rarityContainer.className = "rarity-container";
              rarityContainer.style.cssText =
                "margin-top: 0; border-radius: 0px; background-color: #21262A";
              rarityRank.className = "rarity-rank";
              rarityPercent.className = "rarity-percentage";
              rarityPercent.style.cssText =
                "color: #000;background-color: #2DE370;";
              for (let item in contentData) {
                let temptoken: string = element
                  ?.querySelectorAll("a")[1]
                  ?.href.split("/")[5];

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
        contractData = document.location.href.split("/")[4].split("#")[0];
        if (contentData.length === 0) {
          chrome.runtime.sendMessage({ getContractData: true });
        }
      }
    }, 1000);
  }
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
      if (JSON.stringify(message?.mainData).indexOf(contractData) !== -1) {
        for (let i: number = 0; i < message?.mainData.length; i++) {
          if (message?.mainData[i]?.contractData === contractData) {
            contentData = message?.mainData[i]?.data;
          }
        }
      } else {
        chrome.runtime.sendMessage({ contractData: contractData });
      }
      console.log(contentData);
    }
  }
  if (message?.scrapeError) {
    contentData = ["error"];
  }
});
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

/* hexToComplimentary : Converts hex value to HSL, shifts
 * hue by 180 degrees and then converts hex, giving complimentary color
 * as a hex value
 * @param  [String] hex : hex value
 * @return [String] : complimentary color as hex value
 */
function hexToComplimentary(hex: any) {
  // Convert hex to rgb
  // Credit to Denis http://stackoverflow.com/a/36253499/4939630
  var rgb: string | string[] | number =
    "rgb(" +
    (hex = hex.replace("#", ""))
      .match(new RegExp("(.{" + hex.length / 3 + "})", "g"))
      .map(function (l: any) {
        return parseInt(hex.length % 2 ? l + l : l, 16);
      })
      .join(",") +
    ")";

  // Get array of RGB values
  rgb = rgb.replace(/[^\d,]/g, "").split(",");

  var r: any = rgb[0],
    g: any = rgb[1],
    b: any = rgb[2];

  // Convert RGB to HSL
  // Adapted from answer by 0x000f http://stackoverflow.com/a/34946092/4939630
  r /= 255.0;
  g /= 255.0;
  b /= 255.0;
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var h: any,
    s: any,
    l: any = (max + min) / 2.0;

  if (max == min) {
    h = s = 0; //achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2.0 - max - min) : d / (max + min);

    if (max == r && g >= b) {
      h = (1.0472 * (g - b)) / d;
    } else if (max == r && g < b) {
      h = (1.0472 * (g - b)) / d + 6.2832;
    } else if (max == g) {
      h = (1.0472 * (b - r)) / d + 2.0944;
    } else if (max == b) {
      h = (1.0472 * (r - g)) / d + 4.1888;
    }
  }

  h = (h / 6.2832) * 360.0 + 0;

  // Shift hue to opposite side of wheel and convert to [0-1] value
  h += 180;
  if (h > 360) {
    h -= 360;
  }
  h /= 360;

  // Convert h s and l values into r g and b values
  // Adapted from answer by Mohsen http://stackoverflow.com/a/9493060/4939630
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    var hue2rgb = function hue2rgb(p: number, q: number, t: number) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  r = Math.round(r * 255);
  g = Math.round(g * 255);
  b = Math.round(b * 255);

  // Convert r b and g values to hex
  rgb = b | (g << 8) | (r << 16);
  return "#" + (0x1000000 | rgb).toString(16).substring(1);
}
