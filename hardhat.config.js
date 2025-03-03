require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27", // Change to 0.8.28 if necessary
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545", // Default local Hardhat node
    },
    "mine:auto": {
      url: "http://127.0.0.1:8545", // Replace with your custom node's RPC URL
      chainId: 1337, // Replace with your custom chain ID (1337 is common for local networks)
      gas: "auto", // Automatically determine gas
      gasPrice: "auto", // Automatically determine gas price
    },
  },
};
