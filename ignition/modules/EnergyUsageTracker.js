// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("EnergyUsageTrackerModule", (m) => {
  // Define parameters for the contract
  const billingRate = m.getParameter("billingRate", 10); // Default billing rate set to 10 wei per kWh

  // Deploy the EnergyUsageTracker contract with the specified billing rate
  const energyUsageTracker = m.contract("EnergyUsageTracker", [billingRate]);

  // Return the deployed contract instance
  return { energyUsageTracker };
});
