import {  ethers } from "ethers";
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

  let depositInfo = await simpleAccount.getDepositInfo()

    console.log("EntryPoint Deposit: ", depositInfo[0]);

    return depositInfo[0];
}
