import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SampleKVSModule = buildModule("SampleKVSModule", (m) => {
    const skvs = m.contract("SampleKVS");
    return {skvs};
});

export default SampleKVSModule