// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DelightCoin is ERC20, Ownable {
    address public faucetAddress;

    constructor(uint256 initialSupply, address _faucetAddress) ERC20("Delight Coin", "DEL") Ownable(msg.sender) {
        require(_faucetAddress != address(0), "Faucet address cannot be zero");

        faucetAddress = _faucetAddress;
        _mint(faucetAddress, initialSupply);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}