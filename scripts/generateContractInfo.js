const fs = require('node:fs');
const path = require('node:path');
const hre = require('hardhat');

async function main() {
  const deployedAddresses = JSON.parse(fs.readFileSync('ignition/deployments/chain-31337/deployed_addresses.json', 'utf8'));

  const contractInfo = {
    DelightCoin: {
      address: deployedAddresses["DelightCoinDeployment#DelightCoin"],
      abi: (await hre.artifacts.readArtifact('DelightCoin')).abi
    },
    DelightCoinFaucet: {
      address: deployedAddresses["DelightCoinDeployment#DelightCoinFaucet"],
      abi: (await hre.artifacts.readArtifact('DelightCoinFaucet')).abi
    },
    SampleKVS: {
      address: deployedAddresses["SampleKVSModule#SampleKVS"],
      abi: (await hre.artifacts.readArtifact('SampleKVS')).abi
    }
  };

  fs.writeFileSync(
    path.join(__dirname, '../frontend/contractInfo.json'),
    JSON.stringify(contractInfo, null, 2)
  );

  console.log('Contract info written to frontend/contractInfo.json');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
