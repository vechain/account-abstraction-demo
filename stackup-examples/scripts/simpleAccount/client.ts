import { BigNumberish, JsonRpcProvider, Signer, ethers } from "ethers";
import {
  IClient,
  IUserOperationBuilder,
  ISendUserOperationOpts
} from "userop/dist/types";
import { EntryPoint, EntryPoint__factory } from '@account-abstraction/contracts';
import { OpToJSON } from "userop/dist/utils";
import { UserOperationMiddlewareCtx } from "userop/dist/context";
import { BundlerJsonRpcProvider } from "userop/dist/provider";

export class VechainClient implements IClient {
  private provider: ethers.JsonRpcProvider;
  private bundlerProvider: BundlerJsonRpcProvider;
  private signer: Signer;
  public entryPoint: EntryPoint;
  public chainId: BigNumberish;
  public waitTimeoutMs: number;
  public waitIntervalMs: number;

  private constructor(
    entryPointAddress: string,
    hardhatSigner: Signer,
    hardhatProvider: ethers.JsonRpcProvider,
    overideBundlerUrl: string,
  ) {
    
    this.signer = hardhatSigner;
    this.provider = hardhatProvider;
    this.bundlerProvider = new BundlerJsonRpcProvider(overideBundlerUrl).setBundlerRpc(overideBundlerUrl);

    this.entryPoint = EntryPoint__factory.connect(
      entryPointAddress,
      hardhatSigner
    );

    this.chainId = 1;
    this.waitTimeoutMs = 30000;
    this.waitIntervalMs = 5000;
  }

  public static async init(
    entryPointAddress: string,
    overideBundlerUrl: string,
  ) {
    

    // eslint-disable-next-line
    const provider: JsonRpcProvider = require('hardhat').ethers.provider

    const instance = new VechainClient(entryPointAddress, await provider.getSigner(), provider, overideBundlerUrl);
    instance.chainId = await provider
      .getNetwork()
      .then((network: any) => network.chainId);

    return instance;
  }

  async buildUserOperation(builder: IUserOperationBuilder) {
    return builder.buildOp(await this.entryPoint.getAddress(), this.chainId);
  }

  async sendUserOperation(
    builder: IUserOperationBuilder,
    opts?: ISendUserOperationOpts
  ): Promise<any> {
    const dryRun = Boolean(opts?.dryRun);
    const op = await this.buildUserOperation(builder);
    opts?.onBuild?.(op);

    const userOpHash = dryRun
      ? new UserOperationMiddlewareCtx(
          op,
          await this.entryPoint.getAddress(),
          this.chainId
        ).getUserOpHash()
      : ((await this.bundlerProvider.send("eth_sendUserOperation", [
          OpToJSON(op),
          await this.entryPoint.getAddress(),
        ])) as string);
    builder.resetOp();

    return {
      userOpHash,
      wait: async () => {
        if (dryRun) {
          return null;
        }

        const end = Date.now() + this.waitTimeoutMs;
        const block = await this.provider.getBlock("latest");
        while (Date.now() < end) {
          const events = await this.entryPoint.queryFilter(
            this.entryPoint.filters.UserOperationEvent(userOpHash),
            0
            // Math.max(0, block.number - 100)
          );
          if (events.length > 0) {
            return events[0];
          }
          await new Promise((resolve) =>
            setTimeout(resolve, this.waitIntervalMs)
          );
        }

        return null;
      },
    };
  }
}