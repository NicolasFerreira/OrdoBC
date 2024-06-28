require("@nomicfoundation/hardhat-toolbox");
require('@openzeppelin/hardhat-upgrades');
const { vars } = require("hardhat/config");

const PRIVATE_KEY = vars.get("PRIVATE_KEY","");
const BASESCAN_API_KEY = vars.get("BASESCAN_API_KEY","O26JPE0T3VXSZXH6MJ8I7FNFMR7FZYJJ");


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    // for testnet
    'base-sepolia': {
      url: 'https://sepolia.base.org',
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
