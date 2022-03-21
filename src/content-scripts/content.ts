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
				let element: any = document.querySelectorAll(".lazyload-wrapper");
				if (element) {
					element.forEach((content: any) => {
						if (
							content?.getElementsByClassName("traitsurfer-rarity-container")
								.length === 0
						) {
							const rarityContainer: HTMLDivElement =
								document.createElement("div");
							const rarityRank: HTMLDivElement = document.createElement("div");
							const rarityPercent: HTMLDivElement =
								document.createElement("div");

							rarityContainer.className = "traitsurfer-rarity-container";
							rarityContainer.style.cssText =
								"margin-top: 0; border-radius: 0px;background-color: inherit;";
							rarityRank.className = "traitsurfer-rarity-rank";
							rarityPercent.className = "traitsurfer-rarity-percentage";
							rarityPercent.style.cssText =
								"color: #000;background-color: #2DE370;";
							for (let item in contentData) {
								let temptoken: string = content
									?.querySelectorAll("a")[0]
									?.href?.split("/")[5];

								if (contentData[item]?.tokenid === temptoken) {
									rarityRank.innerHTML = `${contentData[item]?.rank} / ${contentData.length}`;
									rarityPercent.innerHTML = `${(
										(contentData[item]?.rank / contentData.length) *
										100
									).toFixed(1)} %`;
									rarityContainer.appendChild(rarityRank);
									rarityContainer.appendChild(rarityPercent);
									content?.children[0]?.prepend(rarityContainer);
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
			const button: HTMLButtonElement = document.createElement("button");
			button.onclick = async () => {
				assetId = document.location.href.includes("opensea.io/activity")
					? element
							?.querySelector(".fresnel-greaterThanOrEqual-sm")
							?.querySelectorAll("span")[1]
							?.children[0]?.getAttribute("href")
							?.split("/")[2]
					: element?.querySelector("a")?.getAttribute("href")?.split("/")[2];
				tokenId = document.location.href.includes("opensea.io/activity")
					? element
							?.querySelector(".fresnel-greaterThanOrEqual-sm")
							?.querySelectorAll("span")[1]
							?.children[0]?.getAttribute("href")
							?.split("/")[3]
					: element?.querySelector("a")?.getAttribute("href")?.split("/")[3];

				return event.emit("clickedActivity");
			};
			if (
				element?.children[0].getElementsByClassName(
					"traitsurfer-purchase-button"
				).length === 0
			) {
				if (
					element?.children[0]?.children[0]?.children[5]?.querySelector("p")
						?.innerHTML === "---"
				) {
					const title: HTMLDivElement = document.createElement("div");
					title.innerHTML = "Quick Buy";
					button.className = "traitsurfer-purchase-button";
					button.style.cssText =
						"display:flex; justify-content:center; align-items:center";

					if (document.body.offsetWidth >= 1500) {
						button.appendChild(title);
					}
					cartSvg(button);

					// clear inner html
					element?.children[0]?.children[0]?.children[5]
						?.querySelector("p")
						.removeChild(
							element?.children[0]?.children[0]?.children[5]?.querySelector("p")
								.firstChild
						);
					element?.children[0]?.children[0]?.children[5]
						?.querySelector("p")
						?.appendChild(button);

					if (idx < 1) {
						if (!contentData.includes("error")) {
							contentData = [];
						}
						contractData = document.location.href.includes(
							"opensea.io/activity"
						)
							? element
									?.querySelector(".fresnel-greaterThanOrEqual-sm")
									?.querySelectorAll("span")[1]
									?.children[0]?.getAttribute("href")
									?.split("/")[2]
							: element
									?.querySelector("a")
									?.getAttribute("href")
									?.split("/")[2];
						if (contentData.length === 0) {
							chrome.runtime.sendMessage({ getContractData: true });
						}
					}
				} else if (document.body.offsetWidth < 1024) {
					button.className = "traitsurfer-purchase-button";
					button.style.cssText =
						"display:flex; justify-content:center; align-items:center; margin: 2rem 0.5rem 2rem;";

					cartSvg(button);
					if (!document.location.href.includes("opensea.io/activity")) {
						element?.children[0]?.children[0]?.children[0].prepend(button);
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
					let temptoken: string = document.location.href.includes(
						"opensea.io/activity"
					)
						? element
								?.querySelector(".fresnel-greaterThanOrEqual-sm")
								?.querySelectorAll("span")[1]
								?.children[0]?.getAttribute("href")
								?.split("/")[3]
						: element?.querySelector("a")?.getAttribute("href")?.split("/")[3];
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
						document.location.href.includes("opensea.io/activity")
							? element
									?.querySelector(".fresnel-greaterThanOrEqual-sm")
									?.querySelectorAll("span")[1]
									?.children[0]?.append(rarityContainer)
							: element?.children[0]
									?.querySelector("a")
									?.append(rarityContainer);
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
				const title: HTMLDivElement = document.createElement("div");
				title.innerHTML = "Quick Buy";
				divFlex.className = "traitsurfer-flex";
				divFlex.style.cssText =
					"display:flex; flex-direction:column; align-items:center;";
				button.className = "traitsurfer-purchase-button-collection";
				button.style.cssText =
					"display:flex; justify-content:center; align-items:center";
				button.appendChild(title);

				cartSvg(button);
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
	if (document.location.href.includes("https://opensea.io/assets")) {
		if (selectors) {
			if (
				selectors.getElementsByClassName("traitsurfer-purchase-button-assets")
					.length === 0
			) {
				const button: HTMLButtonElement = document.createElement("button");
				const title: HTMLDivElement = document.createElement("div");
				title.innerHTML = "Quick Buy";
				button.className = "traitsurfer-purchase-button-assets";
				button.style.cssText =
					"display:flex; justify-content:center; align-items:center; width: 100%; margin: 0.5rem 0;";

				button.appendChild(title);

				cartSvg(button);

				button.onclick = async () => {
					assetId = document.location.href?.split("/")[4];
					tokenId = document.location.href?.split("/")[5];
					return event.emit("clickedAssets");
				};

				selectors.append(button);
			}
		}

		if (
			document.getElementsByClassName("traitsurfer-rarity-container").length ===
			0
		) {
			const rarityContainer: HTMLDivElement = document.createElement("div");
			const rarityRank: HTMLDivElement = document.createElement("div");
			const rarityPercent: HTMLDivElement = document.createElement("div");
			rarityContainer.className = "traitsurfer-rarity-container";
			rarityRank.className = "traitsurfer-rarity-rank";
			rarityPercent.className = "traitsurfer-rarity-percentage";
			rarityContainer.style.cssText = "flex: 1 1 auto;";
			if (!contentData.includes("error")) {
				contentData = [];
			}
			contractData = document.location.href?.split("/")[4];
			if (contentData.length === 0) {
				chrome.runtime.sendMessage({ getContractData: true });
			}
			fetch(
				`https://traitsurfer.app/api/${document.location.href?.split("/")[4]}/${
					document.location.href?.split("/")[5]
				}`
			)
				.then((res) => res.json())
				.then((result: any) => {
					if (result.success) {
						rarityRank.innerHTML = `${result?.success?.rank} / ${contentData.length}`;
						rarityPercent.innerHTML = `${(
							(result?.success?.rank / contentData.length) *
							100
						).toFixed(1)} %`;
						rarityPercent.style.cssText = `background-color:${hexScaleOpensea(
							(result?.success?.rank / contentData.length) * 100
						)};`;
					}
				})
				.catch((err: any) => {
					console?.error(err?.message);
				});
			rarityContainer?.appendChild(rarityRank);
			rarityContainer?.appendChild(rarityPercent);
			document?.querySelector(".item--counts")?.append(rarityContainer);
		}
	}
}

function hexScaleOpensea(percent: number) {
	let hex: any;
	if (percent <= 1) {
		hex = scaleLinear<string, number>()
			.range(["#ff003c", "#ff003c"])
			.domain([0, 1]);
	} else if (percent <= 5 && percent > 1) {
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

async function cartSvg(container: any) {
	const svg: SVGElement = document.createElementNS(
		"http://www.w3.org/2000/svg",
		"svg"
	);
	const path: SVGElement = document.createElementNS(
		"http://www.w3.org/2000/svg",
		"path"
	);
	const circle1: SVGElement = document.createElementNS(
		"http://www.w3.org/2000/svg",
		"circle"
	);
	const circle2: SVGElement = document.createElementNS(
		"http://www.w3.org/2000/svg",
		"circle"
	);

	svg.setAttribute("viewBox", "0 0 24 24");
	svg.setAttribute("stroke", "#fff");
	svg.setAttribute("fill", "transparent");
	svg.setAttribute("class", "h-12 w-12");
	svg.setAttribute("width", "24px");
	svg.setAttribute("height", "24px");
	path.setAttribute("stroke-linejoin", "round");
	path.setAttribute("stroke-linecap", "round");
	path.setAttribute("stroke-width", "1.5");
	path.setAttribute(
		"d",
		"M7.75 7.75H19.25L17.6128 14.7081C17.4002 15.6115 16.5941 16.25 15.666 16.25H11.5395C10.632 16.25 9.83827 15.639 9.60606 14.7618L7.75 7.75ZM7.75 7.75L7 4.75H4.75"
	);
	circle1.setAttribute("cx", "10");
	circle1.setAttribute("cy", "19");
	circle1.setAttribute("r", "1");
	circle1.setAttribute("fill", "#fff");
	circle2.setAttribute("cx", "15");
	circle2.setAttribute("cy", "19");
	circle2.setAttribute("r", "1");
	circle2.setAttribute("fill", "#fff");
	svg.appendChild(path);
	svg.appendChild(circle1);
	svg.appendChild(circle2);
	container.appendChild(svg);
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
