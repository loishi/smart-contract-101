# Delight Coin Faucet & Sample KVS

This repository implements Delight Coin (DEL) and its faucet, and a simple Key-Value Store in solidity on Ethereum blockchain.

## Components

1. Smart Contracts:
   - DelightCoin: An ERC20 token contract
   - DelightCoinFaucet: A faucet contract for distributing DEL tokens
   - KeyValueStore: A simple key-value store contract

2. Frontend:
   - HTML interface for interacting with the contracts
   - JavaScript code for wallet connection and contract interactions

## Setup and Deployment

Note: You may use pnpm instead of npm.

### 1. Install dependencies

```bash
npm i
```

### 2. Deploy the smart contracts

```bash
npm run deploy
```

This command will:

- Deploy the KeyValueStore contract
- Deploy the DelightCoin and DelightCoinFaucet contracts
- Generate contract information for the frontend

### 3. Start the frontend server

```bash
npm run serve
```

This will start a local HTTP server for the frontend.

## Usage

### 1. Open the frontend in a web browser

- <http://127.0.0.1:8000>

### 2. Connect your Ethereum wallet (e.g., MetaMask) by clicking the "Walletに接続" button

### 3. Interact with the Delight Coin Faucet

- Request DEL tokens (subject to a 15-minute cooldown period)

### 4. Use the Simple KVS

- Create key-value pairs
- Read stored values

## Notes

- The project uses Hardhat for Ethereum development and deployment.

- The frontend uses Web3.js for Ethereum interactions.

- This project utilizes OpenZeppelin contracts for the ERC20 implementation and access control.

- Contract ABIs and addresses are dynamically loaded from deployment artifacts.
