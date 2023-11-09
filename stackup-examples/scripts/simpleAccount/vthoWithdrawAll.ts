import { ethers } from "ethers";
import { ERC20_ABI, SIMPLE_ACCOUNT_ABI } from "../../src";
// @ts-ignore
import config from "../../config.json";
import { Client, Presets } from "userop";
import { CLIOpts } from "../../src";
import { VechainClient } from "./client";
import { VechainSimpleAccount } from "./builder";

export default async function main(
  opts: CLIOpts
) {
  
  const simpleAccount = await VechainSimpleAccount.init(
    config.entryPoint,
    config.factory
  );
  const client = await VechainClient.init(
    config.entryPoint,
    config.overideBundlerUrl
  );

  const address = simpleAccount.getSender();

  const provider = new ethers.JsonRpcProvider(config.rpcUrl);
  const token = ethers.getAddress("0x0000000000000000000000000000456E65726779");
  const erc20 = new ethers.Contract(token, ERC20_ABI, provider);
  const sa = new ethers.Contract(address, SIMPLE_ACCOUNT_ABI, provider);
  const [symbol, decimals] = await Promise.all([
    erc20.symbol(),
    erc20.decimals(),
  ]);

  let builder = simpleAccount.execute(
    await sa.getAddress(),
    0,
    sa.interface.encodeFunctionData("withdrawAll", [])
  )

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
