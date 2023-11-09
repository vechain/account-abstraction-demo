import '@nomicfoundation/hardhat-ethers'
import '@typechain/hardhat'

import fs from 'fs'

import { HardhatUserConfig } from 'hardhat/config'
import { NetworkUserConfig } from 'hardhat/src/types/config'
import { VECHAIN_URL_SOLO } from '@vechain/hardhat-vechain'
import '@vechain/hardhat-ethers'

const mnemonicFileName = process.env.MNEMONIC_FILE
let mnemonic = 'test '.repeat(11) + 'junk'
if (mnemonicFileName != null && fs.existsSync(mnemonicFileName)) {
  mnemonic = fs.readFileSync(mnemonicFileName, 'ascii').trim()
}

const infuraUrl = (name: string): string => `https://${name}.infura.io/v3/${process.env.INFURA_ID}`

function getNetwork (url: string): NetworkUserConfig {
  return {
    url,
    accounts: {
      mnemonic
    }
  }
}

function getInfuraNetwork (name: string): NetworkUserConfig {
  return getNetwork(infuraUrl(name))
}

const config: HardhatUserConfig = {
  defaultNetwork: "vechain",
  // typechain: {
  //   outDir: 'src/types',
  //   target: 'ethers-v6'
  // },
  networks: {
    vechain: {
      url: VECHAIN_URL_SOLO
    },
    goerli: getInfuraNetwork('goerli')
  },
  solidity: {
    version: '0.8.15',
    settings: {
      optimizer: { enabled: true }
    }
  }
}

export default config
