const { expect } = require("chai");

describe("EnergyUsageTracker", function () {
  let energyUsageTracker;
  let owner;

  beforeEach(async function () {
    const EnergyUsageTracker = await ethers.getContractFactory("EnergyUsageTracker");
    [owner] = await ethers.getSigners();
    energyUsageTracker = await EnergyUsageTracker.deploy(10); // Billing rate is 10 wei per kWh
  });

  it("should allow updating energy data", async function () {
    await energyUsageTracker.updateEnergyData(owner.address, 100, 150);
    const status = await energyUsageTracker.getUserStatus(owner.address);
    expect(status.consumed).to.equal(100);
    expect(status.generated).to.equal(150);
  });

  it("should calculate the correct bill", async function () {
    await energyUsageTracker.updateEnergyData(owner.address, 200, 100); // Consumed more than generated
    await energyUsageTracker.calculateBill(owner.address);
    const status = await energyUsageTracker.getUserStatus(owner.address);
    expect(status.outstandingAmount).to.equal(1000); // (200 - 100) * 10 = 1000
  });
});
