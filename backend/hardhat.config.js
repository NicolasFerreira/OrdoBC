require("@nomicfoundation/hardhat-toolbox");
require('@openzeppelin/hardhat-upgrades');
const { vars } = require("hardhat/config");
const fakeDatasForCi = "0x0123456789012345678901234567890123456789012345678901234567890123"
const PRIVATE_KEY = vars.get("PRIVATE_KEY",fakeDatasForCi);
const BASESCAN_API_KEY = vars.get("BASESCAN_API_KEY",fakeDatasForCi);
const ALCHEMY_KEY = vars.get("ALCHEMY_KEY",fakeDatasForCi);

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    // for testnet
    'base-sepolia': {
      url: 'https://base-sepolia.g.alchemy.com/v2/' + ALCHEMY_KEY,
      accounts: [PRIVATE_KEY],
      gasPrice: 1000000000,
    },
    // for local dev environment
    'base-local': {
      url: 'http://localhost:8545',
      accounts: [PRIVATE_KEY],
      gasPrice: 1000000000,
    },
  },
  defaultNetwork: 'hardhat',
  etherscan: {
    apiKey: {
     "base-sepolia": BASESCAN_API_KEY
    },
    customChains: [
      {
        network: "base-sepolia",
        chainId: 84532,
        urls: {
         apiURL: "https://api-sepolia.basescan.org/api",
         browserURL: "https://sepolia.basescan.org"
        }
      }
    ]
  },
  sourcify: {
    enabled: true
  }
};
