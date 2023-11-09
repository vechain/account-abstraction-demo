import input from "@inquirer/input";
import { ICall } from "userop";
import { ethers } from "ethers";
import { ERC20_ABI } from "../abi";

export default async function main(
  provider: ethers.JsonRpcProvider
): Promise<ICall> {
  const token = await input({
    message: "Enter token address",
    validate(addr) {
      return ethers.isAddress(addr) ? true : "Address not valid.";
    },
  });

  const to = await input({
    message: "Enter recipient address",
    validate(addr) {
      return ethers.isAddress(addr) ? true : "Address not valid.";
    },
  });
  const value = await input({
    message: "Enter amount",
    validate(amt) {
      try {
        // ethers.BigNumber.from(amt);
      } catch {
        return "Value not valid.";
      }
      return true;
    },
  });

  const erc20 = new ethers.Contract(token, ERC20_ABI, provider);
  const [symbol, decimals] = await Promise.all([
    erc20.symbol(),
    erc20.decimals(),
  ]);
  const amount = ethers.parseUnits(value, decimals);
  console.log(`> Transaction will transfer ${value} ${symbol}`);

  return {
    to: token,
    value: 0,
    data: erc20.interface.encodeFunctionData("transfer", [to, amount]),
  };
}
