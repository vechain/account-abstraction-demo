import { ethers } from "ethers";
import { ERC20_ABI } from "../../src";
// @ts-ignore
import config from "../../config.json";
import { Client, Presets } from "userop";
import { CLIOpts } from "../../src";
import { VechainSimpleAccount } from "./builder";
import { VechainClient } from "./client";

export default async function main(
  tkn: string,
  t: string,
  amt: string,
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

  const provider = new ethers.JsonRpcProvider(config.rpcUrl);
  const token = ethers.getAddress(tkn);
  const to = ethers.getAddress(t);
  const erc20 = new ethers.Contract(token, ERC20_ABI, provider);
  const [symbol, decimals] = await Promise.all([
    erc20.symbol(),
    erc20.decimals(),
  ]);
  const amount = ethers.parseUnits(amt, decimals);
  console.log(`Transferring ${amt} ${symbol}...`);

  let builder =     simpleAccount.execute(
    await erc20.getAddress(),
    0,
    erc20.interface.encodeFunctionData("transfer", [to, amount])
  );

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