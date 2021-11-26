// This file is ran as a background script
console.log("Hello from background script!");
const { MetaMaskInpageProvider } = require("@metamask/inpage-provider");
const PortStream = require("extension-port-stream");
const { detect } = require("detect-browser");
const browser = detect();
const config = require("../config.json");
const channel = new BroadcastChannel("Funimation");
import { ethers } from "ethers";
import { OpenSeaPort, Network } from "opensea-js";
import { OrderSide } from "opensea-js/lib/types";

var customHttpProvider: any;
var account: string;
var seaport: any;
var error: object;
var success: object;
var alternateSeaport: any;
chrome.runtime.onMessage.addListener(async function (
	request: any,
	sender: any
) {
	if (request?.params) {
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
							chrome.tabs.sendMessage(tabs[0].id, { error });
						}
					);
				}
			});
		const accountAddress = account;
		await seaport
			.fulfillOrder({
				order,
				accountAddress,
			})
			.then((res: any) => {
				console.log(res);
				success = {
					success: true,
					message: `Order is processing: Txhash - ${res}`,
				};
				chrome.tabs.query(
					{ active: true, currentWindow: true },
					function (tabs: any) {
						chrome.tabs.sendMessage(tabs[0].id, { success });
					}
				);

				// send webhook here
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
							chrome.tabs.sendMessage(tabs[0].id, { error });
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
							chrome.tabs.sendMessage(tabs[0].id, { error });
						}
					);
				} else if (err?.message.includes("User denied transaction signature")) {
					error = {
						error: false,
						message: "User declined the transaction",
					};
					chrome.tabs.query(
						{ active: true, currentWindow: true },
						function (tabs: any) {
							chrome.tabs.sendMessage(tabs[0].id, { error });
						}
					);
				} else {
					error = {
						error: false,
						message: "Please refresh and try again",
					};
					chrome.tabs.query(
						{ active: true, currentWindow: true },
						function (tabs: any) {
							chrome.tabs.sendMessage(tabs[0].id, { error });
						}
					);
				}
			});
	}
});

channel.onmessage = async (msg: any) => {
	console.log(msg?.data);
	// const WEB3_ENDPOINT = "https://cloudflare-eth.com";
	// const { JsonRpcProvider } = ethers.providers;
	// const cloudflareProvider = new JsonRpcProvider(WEB3_ENDPOINT);

	if (msg?.data) {
		const provider = createMetaMaskProvider(msg?.data);
		customHttpProvider = new ethers.providers.Web3Provider(provider);
		seaport = new OpenSeaPort(provider, {
			networkName: Network.Main,
			apiKey: "6a5959ab6ed841278cb3545d4f4acc4a",
		});
		// alternateSeaport = new OpenSeaPort(cloudflareProvider, {
		//   networkName: Network.Main,
		// });
		customHttpProvider.send("eth_requestAccounts", []).then((res: any) => {
			account = res[0];
		});
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
