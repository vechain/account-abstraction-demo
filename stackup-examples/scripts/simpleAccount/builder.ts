import { BigNumberish, BytesLike, JsonRpcProvider, Signer, Wallet, ethers } from "ethers";
import { UserOperationBuilder } from "userop";
import {   EntryPoint,
    EntryPoint__factory,
    SimpleAccountFactory,
    SimpleAccountFactory__factory,
    SimpleAccount as SimpleAccountImpl,
    SimpleAccount__factory } from '@account-abstraction/contracts';

export function parseEntryPointError (error: any, entryPoint: EntryPoint): any {
    if (error != null && error.errorName == null && error.data != null) {
      const ret = (entryPoint.interface as any).parseError(error.data.data ?? error.data)
      error = {
        errorName: ret?.name,
        errorArgs: ret?.args
      }
    }
    return error
  }


export class VechainSimpleAccount extends UserOperationBuilder {
  private signer: Signer;
  private entryPoint: EntryPoint;
  private factory: SimpleAccountFactory;
  private initCode: string;
  proxy: SimpleAccountImpl;

  private constructor(
    entryPointAddress: string,
    factoryAddress: string,
    hardhatSigner: Signer,
  ) {
    super();

    this.signer = hardhatSigner;

    this.entryPoint = EntryPoint__factory.connect(
      entryPointAddress,
      hardhatSigner
    );
    this.factory = SimpleAccountFactory__factory.connect(
      factoryAddress,
      hardhatSigner
    );
    this.initCode = "0x";
    this.proxy = SimpleAccount__factory.connect(
      ethers.ZeroAddress,
      hardhatSigner
    );
  }

  public static async init(
    entryPointAddress: string,
    factoryAddress: string,
  ): Promise<VechainSimpleAccount> {

    // eslint-disable-next-line
    const provider: JsonRpcProvider = require('hardhat').ethers.provider
    
    const instance = new VechainSimpleAccount(entryPointAddress, factoryAddress, await provider.getSigner());

    try {
      instance.initCode = await ethers.concat([
        factoryAddress,
        instance.factory.interface.encodeFunctionData("createAccount", [
          await instance.signer.getAddress(),
          0,
        ]),
      ]);
      await (instance.entryPoint.getSenderAddress as any).staticCall(instance.initCode);

      throw new Error("getSenderAddress: unexpected result");
    } catch (error: any) {
      let res = parseEntryPointError(error, instance.entryPoint);
      const addr = res.errorArgs;
      if (!addr) throw error;
        
      instance.setSender(addr.toString());
      instance.proxy = SimpleAccount__factory.connect(addr.toString(), instance.signer);
    }

    instance.useMiddleware(async (ctx) => {
      let wallet = new Wallet("99f0500549792796c14fed62011a51081dc5b5e68fe8bd8a13b86be829c4fd36");
      ctx.op.nonce = await instance.proxy.getNonce();
      ctx.op.signature =  await wallet.signMessage(
        ethers.getBytes(ctx.getUserOpHash())
      );
    })

    return instance;
  }

  execute(to: string, value: BigNumberish, data: BytesLike) {
    return this.setCallData(
      this.proxy.interface.encodeFunctionData("execute", [to, value, data])
    );
  }

  getBalance() {
    const provider: JsonRpcProvider = require('hardhat').ethers.provider
    let balance = provider.getBalance(this.getSender());
    return balance
  }

  getDepositInfo() {
    const provider: JsonRpcProvider = require('hardhat').ethers.provider
    return this.entryPoint.getDepositInfo(this.getSender());
  }

  executeBatch(to: Array<string>, data: Array<BytesLike>) {
    return this.setCallData(
      this.proxy.interface.encodeFunctionData("executeBatch", [to, data])
    );
  }
}
