import { ethers } from "ethers";
import { Client, Presets } from "userop";
import { ERC20_ABI, CLIOpts } from "../../src";
// @ts-ignore
import config from "../../config.json";
import { VechainSimpleAccount } from "./builder";
import { VechainClient } from "./client";
import { Builder } from "userop/dist/preset";

// This example requires several layers of calls:
// EntryPoint
//  ┕> sender.executeBatch
//    ┕> token.transfer (recipient 1)
//    ⋮
//    ┕> token.transfer (recipient N)
export default async function main(
  tkn: string,
  t: Array<string>,
  amt: string,
  opts: CLIOpts
) {
  // const paymasterMiddleware = opts.withPM
  //   ? Presets.Middleware.verifyingPaymaster(
  //       config.paymaster.rpcUrl,
  //       config.paymaster.context
  //     )
  //   : undefined;
  // const simpleAccount = await Presets.Builder.SimpleAccount.init(
  //   config.signingKey,
  //   config.rpcUrl,
  //   { paymasterMiddleware, overrideBundlerRpc: opts.overrideBundlerRpc }
  // );
  // const client = await Client.init(config.rpcUrl, {
  //   overrideBundlerRpc: opts.overrideBundlerRpc,
  // });

  const simpleAccount = await VechainSimpleAccount.init(
    config.entryPoint,
    config.factory
  );
  const client = await VechainClient.init(
    config.entryPoint,
    config.overideBundlerUrl
  );

  const provider = new ethers.JsonRpcProvider(config.rpcUrl);
  const token = ethers.getAddress(tkn);
  const erc20 = new ethers.Contract(token, ERC20_ABI, provider);
  const [symbol, decimals] = await Promise.all([
    erc20.symbol(),
    erc20.decimals(),
  ]);
  const amount = ethers.parseUnits(amt, decimals);

  let dest: Array<string> = [];
  let data: Array<string> = [];
  
  console.log(
    `Batch transferring ${amt} ${symbol} to ${dest.length} recipients...`
  );

    let builder = simpleAccount.executeBatch(dest, data);

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
}
