// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./DelightCoin.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DelightCoinFaucet is Ownable {
    DelightCoin public token;
    uint256 public amountPerRequest;
    mapping(address => uint256) public lastRequestTime;
    uint256 public constant cooldownPeriod = 15 minutes;

    constructor(uint256 _amountPerRequest) Ownable(msg.sender) {
        amountPerRequest = _amountPerRequest;
    }

    function setTokenAddress(address _tokenAddress) external onlyOwner {
        require(address(token) == address(0), "Token address already set");
        token = DelightCoin(_tokenAddress);
    }

    function requestTokens() external {
        require(allowedToClaim(msg.sender), "Not allowed to claim DEL yet");
        require(
            token.balanceOf(address(this)) >= amountPerRequest,
            "Faucet is out of tokens"
        );

        lastRequestTime[msg.sender] = block.timestamp;
        require(
            token.transfer(msg.sender, amountPerRequest),
            "Token transfer failed"
        );
    }

    function allowedToClaim(address _address) public view returns (bool) {
        return
            block.timestamp >= lastRequestTime[_address] + cooldownPeriod ||
            lastRequestTime[_address] == 0;
    }

    function setAmountPerRequest(uint256 _amount) external onlyOwner {
        amountPerRequest = _amount;
    }
}