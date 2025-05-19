import clientConfig from "@/config/clientConfig";

export const getObject = async (address: string, nftType: string) => {
  const request = {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "suix_getOwnedObjects",
    "params": [
      address,
      {
        "filter": {
          "StructType": nftType
        },
        "options": {
          "showType": true,
          "showOwner": true,
          "showContent": true,
          "showDisplay": true,
          "showBcs": false,
          "showStorageRebate": false
        }
      }
    ]
  };

  const response = await fetch('https://fullnode.testnet.sui.io:443', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request)
  });

  try {
    return await response.json().then((res) => res.result.data[0].data.objectId);
  } catch (error) {
    return null;
  }
};

export const getUserSuppliedPools = async (address: string) => {
  const nftType = `${clientConfig.PACKAGE_ID}::pool::PayfricaPoolTicket`;
  const request = {
    "jsonrpc": "2.0",
    "id": 1,
    "method": "suix_getOwnedObjects",
    "params": [
      address,
      {
        "filter": {
          "StructType": nftType
        },
        "options": {
          "showType": true,
          "showOwner": true,
          "showContent": true,
          "showDisplay": true,
          "showBcs": false,
          "showStorageRebate": false
        }
      }
    ]
  };

  const response = await fetch('https://fullnode.testnet.sui.io:443', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request)
  });

  try {
    return await response.json().then((res) => res.result.data.map((item: { data: { content: { fields: any; }; }; }) => item.data.content.fields));

  } catch (error) {
    return null;
  }
};

// (async () => {
//   console.log(await getNFTs("0x299997c9cc660a99a12e0b9945d138adcca560facde681e06ed9e078b815962e", "0x35fcdca2bd3d7b3a845ea1e5b614e727698da3af3cd64658ba8ace10fdb73a64::payfrica::PayfricaUser"));
// })();