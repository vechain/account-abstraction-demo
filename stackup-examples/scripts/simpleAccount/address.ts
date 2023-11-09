import { ethers } from "ethers";
import { Presets } from "userop";
// @ts-ignore
import config from "../../config.json";

import { VechainSimpleAccount } from "./builder";

export default async function main() {
  const simpleAccount = await VechainSimpleAccount.init(
    config.entryPoint,
    config.factory
  );
  const address = simpleAccount.getSender();

  console.log(`SimpleAccount address: ${address}`);

  return address;
}
