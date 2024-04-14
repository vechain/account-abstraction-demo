import { ethers } from "ethers";
// @ts-ignore
import config from "../../config.json";
import { VechainSimpleAccount } from "./builder";
import { VechainClient } from "./client";

export default async function main() {
  const simpleAccount = await VechainSimpleAccount.init(
    config.entryPoint,
    config.factory
  );
  await VechainClient.init(
    config.entryPoint,
    config.overideBundlerUrl
  );
  
  const balance = await simpleAccount.getBalance();
  const divisor: ethers.BigNumberish = ethers.toBigInt("1000000000000000000"); // This is 10^18
  const result: ethers.BigNumberish = balance / divisor;
  console.log("Balance: ", result.toString(), " VET");

  return result.toString();
}
