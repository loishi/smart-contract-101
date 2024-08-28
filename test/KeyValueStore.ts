import {
    time,
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";
import { ethers } from "hardhat";
import type { ValueStructOutput } from "../typechain-types/SampleKVS";

describe("KeyValueStore_Test", () => {
    it("write test", async () => {
        const [owner, _] = await ethers.getSigners();

        const kvs = await hre.ethers.deployContract("SampleKVS");
        const expectedKey = "hoge";
        const expectedValue = "fuga";
        await kvs.write(expectedKey, expectedValue);
        const value: ValueStructOutput = await kvs.read(expectedKey);

        console.log(value);

        expect(value[0]).equal(owner.address);
        expect(value[1]).equal(expectedValue);
        expect(value[2]).equal(true);
    });

    it("delete test", async () => {
        const kvs = await hre.ethers.deployContract("SampleKVS");
        const expectedKey = "hoge";
        const expectedValue = "fuga";
        await kvs.write(expectedKey, expectedValue);
        await kvs.del(expectedKey);
        await expect(kvs.read(expectedKey)).to.be.revertedWith("Doesn't exists");
    });

    it("delete test without permission", async () => {
        const [owner, otherAccount] = await hre.ethers.getSigners();
        const kvs = await hre.ethers.deployContract("SampleKVS");

        const expectedKey = "hoge";
        const expectedValue = "fuga";
        await kvs.connect(owner).write(expectedKey, expectedValue);

        await expect(kvs.connect(otherAccount).del(expectedKey)).to.be.revertedWith('No permission');
    });
});