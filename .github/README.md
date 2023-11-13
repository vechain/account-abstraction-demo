# Account Abstraction Demo

## Introduction

An end to end demo of account abstraction on the VechainThor blockchain.

## Getting Started

### Setup
0. Initialize submodules `git submodule update --init --recursive`
1. Clone latest [`thor`](https://github.com/vechain/thor) and run with flag  ` --api-allow-custom-tracer`
2. Deploy Contracts
    ```bash
    cd account-abstraction
    yarn install && yarn run hardhat test test/deploy-contracts.test.ts --network vechain
    cd ..
    ```
    Sample output:
    ```
    Contract: Deployments
      TestUtils address:                 0xC0a5459871aD8Ff4c9f5EeE7b41eE394ed415EB3
      EntryPoint address:                0x1B433B67cE2CF743673a04268a088C8615413084
      SimpleAccountFactory address:      0x29D17a4bdF64EeC4f05c27e9afA7556E4a9208ff
      FakeSimpleAccountFactory address:  0xEf3d1eeD859f88215475C3d77F6503EEf7f8D985
    ```
3. Build `web3-providers-connex` with [`debug_traceCall`](./web3-providers-connex/src/provider.ts#L66) support
    ```bash
    cd web3-providers-connex
    npm install && npm run build
    cd ..
    ```
4. Build `hardhat-plugins` with [local web3-providers-connex dependency](./hardhat-plugins/packages/vechain/package.json#33)
    ```bash
    cd hardhat-plugins
    yarn install && yarn build
    cd ..
    ```
    **Note: When performing changes in `web3-providers-connex` you need to run `yarn updatupgrade web3-providers-connex`**
5. Build `bundler` with [local hardhat-plugins dependency](./bundler/packages/bundler/package.json#54-55)
    ```bash
    cd bundler
    yarn && yarn preprocess
    ```
    **Note: When performing changes in `web3-providers-connex` you need to `yarn upgrade @vechain/hardhat-vechain`**  
6. Copy `EntryPoint address` value from [deployment output](./README.md#15) to [bundler/localconfig/bundler.config.json](./bundler/packages/bundler/localconfig/bundler.config.json#5)
7. Run bundler
    ```bash
    yarn run bundler
    ```
    The bundler should now run in safe mode which supports `debug_traceCall`

8. Change the config under `account-abstraction/test/config.ts` with your `EntryPoint` and `SimpleAccountFactory` addresses.

9. Run the funding script (make sure you change the account in the script to your SimpleAccount address, you can get that when running either Trampoline or Stackup)

```bash
cd account-abstraction
yarn run hardhat test test/test_custom.ts --network vechain
cd ..
```

### Using Stackup as client

1. Navigate to the stackup directory and follow the readme

2. Start the server by running `yarn run server` on a separate terminal

3. Navigate to the demo folder and run it on a separate terminal

```bash
cd demo-eip-4337
npm install
npm start
```

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md) for further details on how to contribute.

## License

Distrubuted under the MIT license. See [LICENSE](LICENSE.md) for more information.
