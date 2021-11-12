// This file is ran as a background script
console.log("Hello from background script!");
const { MetaMaskInpageProvider } = require("@metamask/inpage-provider");
const PortStream = require("extension-port-stream");
const { detect } = require("detect-browser");
const browser = detect();
const config = require("../config.json");
const provider = createMetaMaskProvider();
import { ethers } from "ethers";
import { OpenSeaPort, Network } from "opensea-js";
import { OrderSide } from "opensea-js/lib/types";

var customHttpProvider = new ethers.providers.Web3Provider(provider);
const seaport = new OpenSeaPort(customHttpProvider, {
	networkName: Network.Main,
});
customHttpProvider.send("eth_requestAccounts", []);

var signer = customHttpProvider.getSigner();
var account = signer.getAddress();
chrome.runtime.onMessage.addListener(async function (
	request: any,
	sender: any
) {
	if (request?.params) {
		console.log(request?.params);
		const order = await seaport.api.getOrder({
			side: OrderSide.Sell,
			asset_contract_address: request?.params?.assetId,
			token_id: request?.params?.tokenId,
		});
		const accountAddress = await account;
		const transactionHash = await seaport.fulfillOrder({
			order,
			accountAddress,
		});
		console.log(transactionHash);
	}
});

function createMetaMaskProvider() {
	let provider;
	try {
		let currentMetaMaskId = getMetaMaskId();
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
