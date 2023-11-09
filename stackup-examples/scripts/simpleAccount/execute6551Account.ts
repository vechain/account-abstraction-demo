import { ethers, parseEther } from "ethers";
import { ERC20_ABI } from "../../src";
import { IERC6551Registry_ABI } from "../../src";
import { IERC6551ACCOUNT_ABI } from "../../src";
// @ts-ignore
import config from "../../config.json";
import { Client, Presets } from "userop";
import { CLIOpts } from "../../src";
import { VechainSimpleAccount } from "./builder";
import { VechainClient } from "./client";

export default async function main(
  accountAddress: string,
  recepientAddress: string,
  amount: string,
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

  
  let signer = await provider.getSigner();

  const initialAccountBalance: bigint = await provider.getBalance(accountAddress);

  // Step 1: Fund TBA
  await signer.sendTransaction({ to: accountAddress, value: parseEther(amount) })

  const afterAccountBalance: bigint = await provider.getBalance(accountAddress);

  console.log("Account Funded with: ", afterAccountBalance - initialAccountBalance);

  const initialRecipientBalance: bigint = await provider.getBalance(recepientAddress);

  const ierc6551account = new ethers.Contract(accountAddress, IERC6551ACCOUNT_ABI, provider);

  console.log("Contract's Owner is: ", await ierc6551account.owner())


  let builder = simpleAccount.execute(
    await ierc6551account.getAddress(),
    0,
    ierc6551account.interface.encodeFunctionData("execute", [
      recepientAddress,
      parseEther(amount),
      "0x",
      0
    ])
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

  
  const afterRecipientBalance: bigint = await provider.getBalance(recepientAddress);
  console.log("Recepient was sent: ", afterRecipientBalance - initialRecipientBalance);

  return ev?.transactionHash
}