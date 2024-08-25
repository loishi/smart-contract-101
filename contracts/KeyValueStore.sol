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
        require(result.exists, "Doesn't exists");
        return result;
    }

    function readAll() view public returns (Value[] memory) {
        Value[] memory result = new Value[](keys.length);
        for (uint i = 0; i < keys.length; i++) {
            if (!kvs[keys[i]].exists) { continue; }
            result[i] = kvs[keys[i]];
        }
        return result;
    }

    function del(string memory key) public {
        require(kvs[key].exists, "Doesn't exist");
        require(kvs[key].writer == msg.sender, "No permission");

        kvs[key].exists = false;
        emit DeleteEvent(key);
    }
}

event WroteEvent(string indexed key, Value val);
event DeleteEvent(string indexed key);
