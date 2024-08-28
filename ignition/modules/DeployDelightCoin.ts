import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DelightCoinDeployment = buildModule("DelightCoinDeployment", (m) => {
  const initialSupply = m.getParameter("initialSupply", 1000000n * 10n ** 18n);
  const amountPerRequest = m.getParameter("amountPerRequest", 100n * 10n ** 18n);

  // Deploy DelightCoinFaucet first
  const delightCoinFaucet = m.contract("DelightCoinFaucet", [amountPerRequest]);

  // Deploy DelightCoin with a reference to the faucet's future address
  const delightCoin = m.contract("DelightCoin", [
    initialSupply,
    delightCoinFaucet
  ]);

  // Set the token address in the faucet after both contracts are deployed
  m.call(delightCoinFaucet, "setTokenAddress", [delightCoin]);

  return { delightCoin, delightCoinFaucet };
});

export default DelightCoinDeployment;