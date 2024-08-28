// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";


struct Value {
    address writer;
    string value;
    bool exists;
}

contract SampleKVS {
    mapping (string=>Value) kvs;
    string[] keys;

    constructor() {
        // 何もしない
    }

    function write(string memory key, string memory value) public {
        if (kvs[key].exists) {
            require(kvs[key].writer == msg.sender, "No permission");
        }

        kvs[key] = Value(msg.sender, value, true);
        keys.push(key);
        emit WroteEvent(key, kvs[key]);
    }

    function read(string memory key) view public returns (Value memory) {
        Value memory result = kvs[key];
        require(result.exists, "Doesn't exist");
        return result;
    }

    function del(string memory key) public {
        require(kvs[key].exists, "Doesn't exist");
        require(kvs[key].writer == msg.sender, "No permission");

        kvs[key].exists = false;
        emit DeleteEvent(key);
    }

    function getKeys() view public returns (string[] memory) {
        uint count = 0;
        for (uint i = 0; i < keys.length; i++) {
            if (kvs[keys[i]].exists) {
                count++;
            }
        }
        string[] memory result = new string[](count);

        uint index = 0;
        for (uint i = 0; i < keys.length; i++) {
            if (kvs[keys[i]].exists) {
                result[index] = keys[i];
                index++;
            }
        }

        return result;
    }
}

event WroteEvent(string indexed key, Value val);
event DeleteEvent(string indexed key);
