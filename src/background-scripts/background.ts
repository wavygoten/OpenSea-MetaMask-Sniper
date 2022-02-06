// This file is ran as a background script
console.log("Hello from background script!");
const { MetaMaskInpageProvider } = require("@metamask/inpage-provider");
const PortStream = require("extension-port-stream");
const { detect } = require("detect-browser");
const browser = detect();
const config = require("../../config.json");
const channel = new BroadcastChannel("Funimation");
import utils from "../utils/utils";
import { providers } from "ethers";
import { OpenSeaPort, Network } from "opensea-js";
import { OrderSide } from "opensea-js/lib/types";
var mainData: any[] = [];
var customHttpProvider: providers.Web3Provider;
var account: string;
var signature: string;
var seaport: any;
var error: object;
var success: object;
var alternateSeaport: any;
chrome.runtime.onMessage.addListener(async function (
  request: any,
  sender: any
) {
  if (request?.getContractData) {
    chrome.tabs.sendMessage(sender.tab.id, { mainData: mainData });
  }
  if (request?.contractData) {
    let contractData = request?.contractData;
    fetch(`https://traitsurfer.app/api/${contractData}`)
      .then((res) => res.json())
      .then((result: any) => {
        if (result?.success?.data) {
          if (
            JSON.stringify(mainData).indexOf(contractData.toLowerCase()) === -1
          ) {
            mainData.push({
              contractData: contractData.toLowerCase(),
              data: result?.success?.data,
            });
          }
        } else {
          chrome.tabs.sendMessage(sender.tab.id, { scrapeError: true });
        }
      })
      .catch((err: any) => {
        console.log(err);
      });
    console.log(mainData);
  }
  if (request?.params) {
    if (!signature) {
      error = {
        error: false,
        message: "Please sign the message",
      };
      chrome.tabs.query(
        { active: true, currentWindow: true },
        function (tabs: any) {
          chrome.tabs.sendMessage(sender.tab.id, { error });
        }
      );
    } else {
      console.log(request?.params);
      const order = await seaport.api
        .getOrder({
          side: OrderSide.Sell,
          asset_contract_address: request?.params?.assetId,
          token_id: request?.params?.tokenId,
        })
        .catch((err: any) => {
          if (err?.message.includes("no matching order found")) {
            error = {
              error: false,
              message: "No listing found for this order",
            };
            chrome.tabs.query(
              { active: true, currentWindow: true },
              function (tabs: any) {
                chrome.tabs.sendMessage(sender.tab.id, { error });
              }
            );
          }
        });
      const accountAddress: string = account;
      const title: string = order?.asset?.name;
      const priceTotal: string = (order?.currentPrice?.c[0] / 10000).toFixed(2);
      await seaport
        .fulfillOrder({
          order,
          accountAddress,
        })
        .then((res: any) => {
          console.log(res);
          var txhash = res;
          success = {
            success: true,
            message: `Order is processing: Txhash - ${res}`,
          };
          chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs: any) {
              chrome.tabs.sendMessage(sender.tab.id, { success });
            }
          );

          chrome.storage.local.get(["webhook"], async (res: any) => {
            if (res?.webhook) {
              await utils.sendWebhook(res?.webhook, {
                title: title,
                priceTotal: priceTotal,
                txn: txhash,
                url: `https://etherscan.io/tx/${txhash}`,
              });
            }
          });
        })
        .catch((err: any) => {
          console.log(err?.message);

          if (err?.message.includes("insufficient funds")) {
            error = {
              error: false,
              message: "Insufficient balance for this transaction",
            };
            chrome.tabs.query(
              { active: true, currentWindow: true },
              function (tabs: any) {
                chrome.tabs.sendMessage(sender.tab.id, { error });
              }
            );
          } else if (err?.message.includes("User denied")) {
            error = {
              error: false,
              message: "Transaction Denied",
            };
            chrome.tabs.query(
              { active: true, currentWindow: true },
              function (tabs: any) {
                chrome.tabs.sendMessage(sender.tab.id, { error });
              }
            );
          } else if (
            err?.message.includes("Cannot read properties of undefined")
          ) {
            error = {
              error: false,
              message: "No listing found for this order",
            };
            chrome.tabs.query(
              { active: true, currentWindow: true },
              function (tabs: any) {
                chrome.tabs.sendMessage(sender.tab.id, { error });
              }
            );
          } else {
            error = {
              error: false,
              message: err?.message,
            };
            chrome.tabs.query(
              { active: true, currentWindow: true },
              function (tabs: any) {
                chrome.tabs.sendMessage(sender.tab.id, { error });
              }
            );
          }
        });
    }
  }
});

channel.onmessage = async (msg: any) => {
  // const WEB3_ENDPOINT = "https://cloudflare-eth.com";
  // const { JsonRpcProvider } = providers;
  // const cloudflareProvider = new JsonRpcProvider(WEB3_ENDPOINT);
  if (msg?.data?.mmid) {
    const provider = createMetaMaskProvider(msg?.data?.mmid);
    customHttpProvider = new providers.Web3Provider(provider);
    seaport = new OpenSeaPort(provider, {
      networkName: Network.Main,
      apiKey: "6a5959ab6ed841278cb3545d4f4acc4a",
    });
    // alternateSeaport = new OpenSeaPort(cloudflareProvider, {
    //   networkName: Network.Main,
    // });

    customHttpProvider
      .send("eth_requestAccounts", [])
      .then((res: any) => {
        account = res[0];
        chrome.storage.local.set({ mmid: msg?.data?.mmid });
        chrome.storage.local.set({ address: account });
        chrome.storage.local.get(["image"], (res: any) => {
          if (!res?.image) {
            fetch(`https://traitsurfer.app/api/?address=${account}`)
              .then((res) => res.json())
              .then((result: any) => {
                if (result?.success) {
                  chrome.storage.local.set({
                    image: result?.success?.account?.profile_img_url,
                  });
                }
              })
              .catch((err: any) => {
                console.error(err);
              });
          }
        });
      })
      .finally(() => {
        customHttpProvider
          .send("personal_sign", [
            "You are signing to use TraitSurfer App Extension.",
            account,
          ])
          .then((res: any) => {
            signature = res;
            chrome.storage.local.set({ signature: signature });
          });
      });
  }
  if (msg?.data?.webhook) {
    await utils.sendWebhook(msg?.data?.webhook, {
      title: "Webhook Test Success",
      priceTotal: "0.420",
      txn: "N/A",
    });
  }
  if (msg?.data?.clearosdata) {
    mainData = [];
  }
  if (msg?.data?.params) {
    console.log(msg?.data?.params);
    const order = await seaport.api.getOrder({
      side: OrderSide.Sell,
      asset_contract_address: msg?.data?.params?.assetId,
      token_id: msg?.data?.params?.tokenId,
    });
    const accountAddress = account;
    const title: string = order?.asset?.name;
    const priceTotal: number = parseFloat(
      (order?.currentPrice?.c[0] / 10000).toFixed(2)
    );
    if (priceTotal <= msg?.data?.params?.price) {
      await seaport
        .fulfillOrder({
          order,
          accountAddress,
        })
        .then((res: any) => {
          var txhash = res;
          success = {
            success: true,
            message: `Order is processing: Txhash - ${txhash}`,
          };
          chrome.storage.local.get(["webhook"], async (res: any) => {
            if (res?.webhook) {
              await utils.sendWebhook(res?.webhook, {
                title: title,
                priceTotal: `${priceTotal}`,
                txn: txhash,
                url: `https://etherscan.io/tx/${txhash}`,
              });
            }
          });
        });
    }
  }
};

function createMetaMaskProvider(mmid?: any) {
  let provider;
  try {
    let currentMetaMaskId = mmid;
    const metamaskPort = chrome.runtime.connect(currentMetaMaskId);
    const pluginStream = new PortStream(metamaskPort);
    provider = new MetaMaskInpageProvider(pluginStream);
  } catch (e) {
    console.dir(`Metamask connect error `, e);
    throw e;
  }
  return provider;
}

function getMetaMaskId() {
  switch (browser && browser.name) {
    case "chrome":
      return config.CHROME_ID;
    case "firefox":
      return config.FIREFOX_ID;
    default:
      return config.CHROME_ID;
  }
}
