import { ethers } from "ethers";
import { Client, Presets } from "userop";
import { CLIOpts } from "../../src";
// @ts-ignore
import config from "../../config.json";
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

  // Create a no-op transaction for deployment purposes
  let builder = simpleAccount.execute(simpleAccount.getSender(), 0, "0x")

  const op = await client.buildUserOperation(builder);
  return op.nonce;
}
