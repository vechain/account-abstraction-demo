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
  const builder = simpleAccount.execute(simpleAccount.getSender(), 0, "0x");
  builder.setCallGasLimit(123456);
  builder.setVerificationGasLimit(123456);
  builder.setPreVerificationGas(123456);

  const res = await client.sendUserOperation(
    builder,
    {
      dryRun: opts.dryRun,
      onBuild: (op) => console.log("Signed UserOperation:", op),
    }
  );
  console.log(`UserOpHash: ${res.userOpHash}`);

  console.log("Waiting for transaction...");
  const ev = await res.wait();
  console.log(`Transaction hash: ${ev?.transactionHash ?? null}`);

  return ev?.transactionHash
}
