const Web3 = window.Web3;

var web3 = undefined;

const deployedAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";  // 適宜変更する
var abi = undefined;
var contract = undefined;


var defaultAccount = null;
// Walletに接続
async function connectWallet() {
    try {
        web3 = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });
        defaultAccount = accounts[0];

        fetch("/SampleKVS.json").then(resp => resp.json()).then((data) => {
            abi = data.abi;
            contract = new web3.eth.Contract(abi, deployedAddress);
        });

        window.alert("Walletに接続済み");
    } catch (e) {
        console.log('Failed to connect wallet', e);
    }
}

// KVSに書き込み
async function handleCreate() {
    const key = document.getElementById('create-key').value;
    const value = document.getElementById('create-value').value;
    if (!key || !value) {
        window.alert("Error: KeyとValueが空だと、作成できません");
        return;
    }

    try {
        const latestBlockNumber = await web3.eth.getBlockNumber();
        console.log(latestBlockNumber);

        await contract.methods.write(key, value).send({
            from: defaultAccount,
            gas: 300000,
        }, latestBlockNumber);
    } catch (e) {
        console.log(e);
    }
    
    console.log('end');
}

// 読み込み
async function read() {
    try {
        let keys = await contract.methods.getKeys().call();
        console.log(keys);

        const valuesElement = document.getElementById('values');
        valuesElement.innerHTML = '';

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            let value = await contract.methods.read(key).call();
            const li = document.createElement('li');
            li.innerText = `${key}: ${value.value} (${value.writer})`
            valuesElement.appendChild(li);
        }
    } catch (e) {
        console.log(e);
        window.alert("エラー");
    }
}
