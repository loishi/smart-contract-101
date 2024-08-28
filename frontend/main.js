const Web3 = window.Web3;
let web3;
let defaultAccount;

// Delight Coin & Faucet
let delightCoinAddress;
let faucetAddress;
let delightCoinABI;
let faucetABI;
let delightCoinContract;
let faucetContract;

// KVS
let kvsABI;
let kvsContract;

// ページロード時にWalletが接続されているかチェック
window.addEventListener("load", async () => {
  if (typeof window.ethereum !== "undefined") {
    web3 = new Web3(window.ethereum);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      console.log(accounts);
      if (accounts.length > 0) {
        await connectWallet();
      }
    } catch (e) {
      console.log("No account connected");
    }
  }
});

// Walletに接続
async function connectWallet() {
  try {
    web3 = new Web3(window.ethereum);
    const accounts = await window.ethereum.request({
      "method": "eth_requestAccounts",
    }); 
    
    defaultAccount = accounts[0];

    const response = await fetch('/contractInfo.json')
    const contractInfo = await response.json();

    delightCoinAddress = contractInfo.DelightCoin.address;
    faucetAddress = contractInfo.DelightCoinFaucet.address;
    kvsAddress = contractInfo.SampleKVS.address;

    delightCoinABI = contractInfo.DelightCoin.abi;
    faucetABI = contractInfo.DelightCoinFaucet.abi;
    kvsABI = contractInfo.SampleKVS.abi;

    delightCoinContract = new web3.eth.Contract(
      delightCoinABI,
      delightCoinAddress
    );
    faucetContract = new web3.eth.Contract(faucetABI, faucetAddress);
    kvsContract = new web3.eth.Contract(kvsABI, kvsAddress);

    // const deploymentResponse = await fetch(
    //   "/deployed_addresses.json",
    // );
    // const deploymentData = await deploymentResponse.json();

    // delightCoinAddress = deploymentData["DelightCoinDeployment#DelightCoin"];
    // faucetAddress = deploymentData["DelightCoinDeployment#DelightCoinFaucet"];


    // const delightCoinABIResponse = await fetch(
    //   "/DelightCoin.json",
    // );
    // const delightCoinABIData = await delightCoinABIResponse.json();
    // delightCoinABI = delightCoinABIData.abi;

    // const faucetABIResponse = await fetch(
    //   "/DelightCoinFaucet.json",
    // );
    // const faucetABIData = await faucetABIResponse.json();
    // faucetABI = faucetABIData.abi;

    // delightCoinContract = new web3.eth.Contract(
    //   delightCoinABI,
    //   delightCoinAddress,
    // );
    // faucetContract = new web3.eth.Contract(faucetABI, faucetAddress);

    // const kvsAddress = deploymentData["SampleKVSModule#SampleKVS"];
    // const kvsResponse = await fetch("/SampleKVS.json");
    // const kvsData = await kvsResponse.json();
    // kvsABI = kvsData.abi;
    // kvsContract = new web3.eth.Contract(kvsABI, kvsAddress);

    document.getElementById("connect-wallet").style.display = "none";
    document.getElementById("main-content").style.display = "block";
    document.getElementById("wallet-status").innerText =
      `Connected: ${defaultAccount.slice(0, 6)}...${defaultAccount.slice(-4)}`;
    document.getElementById("logout-button").style.display = "block";
  } catch (e) {
    console.error("Failed to connect wallet", e);
    window.alert("Walletに接続できませんでした");
    document.getElementById("main-content").style.display = "none";
  }
}

function logout() {
  defaultAccount = null;
  document.getElementById("connect-wallet").style.display = "block";
  document.getElementById("main-content").style.display = "none";
  document.getElementById("wallet-status").innerText = "";
  document.getElementById("logout-button").style.display = "none";
}

async function isAllowedToClaim() {
  try {
    return await faucetContract.methods.allowedToClaim(defaultAccount).call();
  } catch (e) {
    console.error("Failed to check if the user is allowed to claim the token", e);
    return false;
  }
}

async function requestTokens() {
  try {
    const allowedToClaim = await isAllowedToClaim();
    if (!allowedToClaim) {
      const lastRequestTime = await faucetContract.methods.lastRequestTime(defaultAccount).call();
      const cooldownPeriod = 15 * 60; // 15 minutes in seconds
      const currentTime = Math.floor(Date.now() / 1000);
      const waitTime = Math.max(0, Number.parseInt(lastRequestTime) + cooldownPeriod - currentTime);
      const waitMinutes = Math.ceil(waitTime / 60);
      
      document.getElementById("faucet-status").innerText = `Please wait ${waitMinutes} minute(s) before requesting again.`;
      return;
  }
    // const gasEstimate = await faucetContract.methods.requestTokens().estimateGas({ from: defaultAccount });
    // console.log("Estimated gas: ", gasEstimate);

    await faucetContract.methods.requestTokens().send({ 
      from: defaultAccount,
      // gas: Math.floor(gasEstimate * 1.1)
    });
    document.getElementById("faucet-status").innerText =
      "DEL requested successfully";
  } catch (e) {
    console.log("Failed to request tokens", e);
    document.getElementById("faucet-status").innerText =
      "Failed to request tokens";
  }
}

// KVSに書き込み
async function handleCreate() {
  const key = document.getElementById("create-key").value;
  const value = document.getElementById("create-value").value;
  if (!key || !value) {
    window.alert("Error: KeyかValueが空です");
    return;
  }

  try {
    const latestBlockNumber = await web3.eth.getBlockNumber();
    console.log(latestBlockNumber);

    await kvsContract.methods.write(key, value).send(
      {
        from: defaultAccount,
        gas: 300000,
      },
      latestBlockNumber,
    );
    alert("Key-Valueペアの作成に成功");
  } catch (e) {
    console.log(e);
    alert(`Key-Valueペアの作成に失敗: ${e.message}`);
  }
}

// 読み込み
async function read() {
  try {
    const keys = await kvsContract.methods.getKeys().call();
    console.log(keys);

    const valuesElement = document.getElementById("values");
    valuesElement.innerHTML = "";

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = await kvsContract.methods.read(key).call();
      const li = document.createElement("li");
      li.innerText = `${key}: ${value.value} (${value.writer})`;
      valuesElement.appendChild(li);
    }
  } catch (e) {
    console.log(e);
    window.alert(`エラー: ${e.message}`);
  }
}

