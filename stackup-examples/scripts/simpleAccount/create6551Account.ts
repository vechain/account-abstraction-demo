import { ethers } from "ethers";
import { IERC6551Registry_ABI } from "../../src";
// @ts-ignore
import config from "../../config.json";
import { CLIOpts } from "../../src";
import { VechainSimpleAccount } from "./builder";
import { VechainClient } from "./client";


export default async function main(
  registry: string,
  implementation: string,
  tokenContract: string,
  salt: BigInt,
  tokenId: BigInt,
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

  const network = await provider.getNetwork();
  const chainId = network.chainId;

  const ierc6551registry = new ethers.Contract(registry, IERC6551Registry_ABI, provider);

  let builder = simpleAccount.execute(
    await ierc6551registry.getAddress(),
    0,
    ierc6551registry.interface.encodeFunctionData("createAccount", [
      implementation,
      chainId,
      tokenContract,
      salt,
      tokenId,
      "0x"
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


  let accountAddress = await ierc6551registry.account(
    implementation,
    chainId,
    tokenContract,
    salt,
    tokenId,
  )

  console.log("Account created with address: ", accountAddress);

  return accountAddress;
}