// fetch(
// 	"https://api.opensea.io/api/v1/asset/0x1061296e433b95c12c9a8c937dd9632281d409f3/792/",
// 	{
// 		method: "GET",
// 	}
// )
// 	.then((res) => res.json())
// 	.then((data) => {
// 		console.log(data);
// 	})
// 	.catch((err) => {
// 		console.log(err);
// 	});

const _ = {
  async FetchAssetId(url: string) {
    return new Promise<string>(async (resolve, reject) => {
      let asset: string;
      await fetch(url, {
        method: "GET",
      })
        .then((res: any) => res.text())
        .then((text: string) => {
          const regex2 = /\"asset":{"__ref":"\b/g;
          const ref = text.search(regex2);
          const refasset = text.slice(ref + 17).split('"')[1];
          asset = refasset;
          resolve(asset);
        })
        .catch((err: any) => {
          console.log(err);
          reject(err);
        });
    });
  },
  async FetchBlockNumber() {
    return new Promise<object>(async (resolve, reject) => {
      await fetch(
        "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: 2.0,
            method: "eth_blockNumber",
            params: [],
            id: 1,
          }),
        }
      )
        .then((res: any) => {
          resolve(res.json());
        })

        .catch((err: any) => {
          console.log(err);
          reject(err);
        });
    });
  },
  async FetchEthCall(blockNumber: any, data?: any, from?: any, to?: any) {
    return new Promise<object>(async (resolve, reject) => {
      await fetch(
        "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: 2.0,
            method: "eth_call",
            params: [
              {
                data: "0x72593b4c0000000000000000000000007be8076f4ea4a4ad08075c2508e481d6c946d12b00000000000000000000000017fad58710d1ad48cfe0bad0dff54202dce505bc00000000000000000000000092e3e476a6a70558d3637c0a0019831f2d385cf30000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a94723ec583075db851588a6de85ae2973dca8e2000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000007be8076f4ea4a4ad08075c2508e481d6c946d12b00000000000000000000000092e3e476a6a70558d3637c0a0019831f2d385cf300000000000000000000000000000000000000000000000000000000000000000000000000000000000000005b3256965e7c3cf26e11fcaf296dfc8807c01073000000000000000000000000a94723ec583075db851588a6de85ae2973dca8e20000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003e800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000670758aa7c8000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000614e3b2e0000000000000000000000000000000000000000000000000000000000000000286ec36610a2f447428217e9e1479334a539a37d4aa7efb9ba0dd41b0560476000000000000000000000000000000000000000000000000000000000000003e800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000670758aa7c8000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000614e32320000000000000000000000000000000000000000000000000000000000000000af71f015e24927d45016a079d3dc547c3c611124b5d2899d99da154def8550c50000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005c00000000000000000000000000000000000000000000000000000000000000660000000000000000000000000000000000000000000000000000000000000070000000000000000000000000000000000000000000000000000000000000007a000000000000000000000000000000000000000000000000000000000000008400000000000000000000000000000000000000000000000000000000000000860000000000000000000000000000000000000000000000000000000000000006423b872dd000000000000000000000000000000000000000000000000000000000000000000000000000000000000000017fad58710d1ad48cfe0bad0dff54202dce505bc0000000000000000000000000000000000000000000000000000000000000f3e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006423b872dd00000000000000000000000092e3e476a6a70558d3637c0a0019831f2d385cf300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000f3e00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006400000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",

                from: "0x17fad58710d1ad48cfe0bad0dff54202dce505bc",
                to: "0x7be8076f4ea4a4ad08075c2508e481d6c946d12b",
              },
              blockNumber,
            ],
            id: 1,
          }),
        }
      )
        .then((res: any) => {
          resolve(res.json());
        })

        .catch((err: any) => {
          console.log(err);
          reject(err);
        });
    });
  },
  async FetchOrderData(assetId: any, tokenID: any) {
    return new Promise<object>(async (resolve, reject) => {
      await fetch(
        `https://api.opensea.io/api/v1/asset/${assetId}/${tokenID}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => resolve(res.json()))
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  },
  async sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  },
  async sendWebhook(url: string, details: any) {
    const embed = {
      embeds: [
        {
          color: 2123412,
          title: "Successful Cop",
          fields: [
            {
              name: "Title",
              value: `${details.title}`,
              inline: false,
            },
            {
              name: `Price`,
              value: details.priceTotal + ` Ξ`,
              inline: true,
            },
            {
              name: `TXN`,
              value: `${details.txn}`,
              inline: true,
            },
          ],
          footer: {
            text: "Opensea Sniper",
          },
          timestamp: new Date().toISOString(),
        },
      ],
    };

    return await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(embed),
    });
  },
};
export default _;
// .finally(() => {
//   fetch("https://api.opensea.io/graphql/", {
//     headers: {
//       accept: "*/*",
//       "accept-language": "en-US,en;q=0.9",
//       authorization:
//         "JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiVlhObGNsUjVjR1U2TVRZME9EQXdOdz09IiwidXNlcm5hbWUiOiJORlRHb3RlbiIsImFkZHJlc3MiOiIweDE3ZmFkNTg3MTBkMWFkNDhjZmUwYmFkMGRmZjU0MjAyZGNlNTA1YmMiLCJpc3MiOiJPcGVuU2VhIiwiZXhwIjoxNjMyMzc2NjYxLCJvcmlnSWF0IjoxNjMyMjkwMjYxfQ.IDcPYdn-OjxLhNftbq2Sy9ByKVkkAIUwQNL_s3E4apA",
//       "content-type": "application/json",
//       "sec-ch-ua":
//         '"Google Chrome";v="93", " Not;A Brand";v="99", "Chromium";v="93"',
//       "sec-ch-ua-mobile": "?0",
//       "sec-ch-ua-platform": '"macOS"',
//       "sec-fetch-dest": "empty",
//       "sec-fetch-mode": "cors",
//       "sec-fetch-site": "same-site",
//       "x-api-key": "2f6f419a083c46de9d83ce3dbe7db601",
//       "x-build-id": "gIJ_nXFCLLMTn8DqGO36u",
//       "x-viewer-address": "0x17fad58710d1ad48cfe0bad0dff54202dce505bc",
//     },
//     referrer: "https://opensea.io/",
//     referrerPolicy: "strict-origin",
//     body: `{"id":"CollectionDetailsModalQuery","query":"query CollectionDetailsModalQuery(\\n  $asset: AssetRelayID!\\n) {\\n  asset(asset: $asset) {\\n    collection {\\n      name\\n      createdDate\\n      slug\\n      owner {\\n        address\\n        createdDate\\n        displayName\\n        ...AccountLink_data\\n        id\\n      }\\n      stats {\\n        totalVolume\\n        totalSales\\n        totalSupply\\n        id\\n      }\\n      isMintable\\n      id\\n    }\\n    ...CollectionConfidenceScore_data\\n    id\\n  }\\n}\\n\\nfragment AccountLink_data on AccountType {\\n  address\\n  config\\n  isCompromised\\n  user {\\n    publicUsername\\n    id\\n  }\\n  metadata {\\n    discordUsername\\n    id\\n  }\\n  ...ProfileImage_data\\n  ...wallet_accountKey\\n  ...accounts_url\\n}\\n\\nfragment CollectionConfidenceScore_data on AssetType {\\n  numVisitors\\n  favoritesCount\\n  assetContract {\\n    isSharedStorefront\\n    id\\n  }\\n  collection {\\n    name\\n    createdDate\\n    owner {\\n      config\\n      createdDate\\n      id\\n    }\\n    stats {\\n      totalVolume\\n      totalSales\\n      totalSupply\\n      id\\n    }\\n    isMintable\\n    id\\n  }\\n}\\n\\nfragment ProfileImage_data on AccountType {\\n  imageUrl\\n  address\\n}\\n\\nfragment accounts_url on AccountType {\\n  address\\n  user {\\n    publicUsername\\n    id\\n  }\\n}\\n\\nfragment wallet_accountKey on AccountType {\\n  address\\n}\\n","variables":{"asset":"${asset}"}}`,
//     method: "POST",
//     mode: "cors",
//   })
//     .then((res) => res.json())
//     .then((data) => {
//       data = data?.data;
//     })
//     .catch((err) => {
//       console.log(err);
//     });
