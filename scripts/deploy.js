async function main() {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    console.log("Starting deployment...");
  
    // Deploy contract
    const EnergyUsageTracker = await ethers.getContractFactory("EnergyUsageTracker");
    const contract = await EnergyUsageTracker.deploy(100); // Billing rate
    await contract.waitForDeployment();
    console.log("Contract deployed at:", contract.target);
  
    // Wait for network to mine blocks
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    await delay(2000); // Wait 2 seconds
  
    // Check latest block number
    const latestBlock = await provider.getBlockNumber();
    console.log("Latest Block Number:", latestBlock);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  