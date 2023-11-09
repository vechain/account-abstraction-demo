import { ethers } from "ethers";
import { Client, Presets } from "userop";
import { CLIOpts } from "../../src";
// @ts-ignore
import config from "../../config.json";
import { BundlerJsonRpcProvider } from "userop/dist/provider";
import { EntryPoint__factory } from "userop/dist/typechain";
import { VechainSimpleAccount } from "./builder";
import { VechainClient } from "./client";

export default async function main(opts: CLIOpts) {
  const simpleAccount = await VechainSimpleAccount.init(
    config.entryPoint,
    config.factory
  );
  const client = await VechainClient.init(
    config.entryPoint,
    config.overideBundlerUrl
  );
  
  let balance = await simpleAccount.getBalance();
  const divisor: ethers.BigNumberish = ethers.toBigInt("1000000000000000000"); // This is 10^18
  const result: ethers.BigNumberish = balance / divisor;
  console.log("Balance: ", result.toString(), " VET");

  return result.toString();
}
