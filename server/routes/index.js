const express = require("express");
const { ethers } = require("ethers");
require('dotenv').config({ path: './server/.env' });

const router = express.Router();

const userRoute = require("./userRoute");
const orderRoute = require("./orderRoute");
const paymentRoute = require("./paymentRoute");
const productRoute = require("./productRoute");

router.use("/user", userRoute);
router.use("/order", orderRoute);
router.use("/payment", paymentRoute);
router.use("/product", productRoute);

router.get('/DakaAPITest', async (req, res) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

    // Get basic network information
    const blockNumber = await provider.getBlockNumber();
    const network = await provider.getNetwork();
    const gasPrice = await provider.getGasPrice();
    // Use a valid Sepolia testnet address
    const testAddress = process.env.TEST_ADDRESS;
    
    // Validate address format
    if (!ethers.utils.isAddress(testAddress)) {
      throw new Error('Invalid test address format');
    }
    
    const balance = await provider.getBalance(testAddress);
    
    // Get latest block info
    const latestBlock = await provider.getBlock(blockNumber);
    
    // Format gas price
    const gasPriceFormatted = ethers.utils.formatUnits(gasPrice, 'gwei');
    
    // Format balance
    const balanceFormatted = ethers.utils.formatEther(balance);

    const result = {
      network: network.name,
      chainId: network.chainId,
      blockNumber,
      latestBlockHash: latestBlock.hash,
      latestBlockTimestamp: new Date(latestBlock.timestamp * 1000).toISOString(),
      gasPrice: gasPriceFormatted + ' gwei',
      testAddressBalance: balanceFormatted + ' ETH',
      providerUrl: process.env.SEPOLIA_RPC_URL
    };

    console.log('[DakaAPITest] Result:', result);

    res.json({ ok: true, result });
  } catch (err) {
    console.error('[DakaAPITest] Error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
