import { HardhatUserConfig } from "hardhat/config";

require('dotenv').config();
require("@nomiclabs/hardhat-ethers");

const { API_URL, PRIVATE_KEY } = process.env;


const config: HardhatUserConfig = {
  solidity: "0.8.24",
  defaultNetwork: "amoy",
   networks: {
      hardhat: {},
      amoy: {
         url: API_URL,
         accounts: [`0x${PRIVATE_KEY}`]
      }
   },
};

export default config;
