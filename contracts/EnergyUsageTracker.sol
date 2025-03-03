// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract EnergyUsageTracker {
    struct User {
        uint256 energyConsumed;
        uint256 energyGenerated;
        bool hasOutstandingBill;
        uint256 outstandingAmount;
    }

    mapping(address => User) public users;
    uint256 public billingRate; // Cost per kWh

    event EnergyDataUpdated(
        address indexed user,
        uint256 energyConsumed,
        uint256 energyGenerated
    );
    event BillCalculated(address indexed user, uint256 outstandingAmount);
    event BillSettled(address indexed user, uint256 amountPaid);

    constructor(uint256 _billingRate) {
        billingRate = _billingRate; // Set billing rate on deployment
    }

    // Update energy data for the user
    function updateEnergyData(
        uint256 _energyConsumed,
        uint256 _energyGenerated
    ) public {
        if (
            users[msg.sender].energyConsumed == 0 &&
            users[msg.sender].energyGenerated == 0 &&
            users[msg.sender].outstandingAmount == 0
        ) {
            users[msg.sender] = User(
                _energyConsumed,
                _energyGenerated,
                false,
                0
            );
        } else {
            users[msg.sender].energyConsumed += _energyConsumed;
            users[msg.sender].energyGenerated += _energyGenerated;
        }

        emit EnergyDataUpdated(msg.sender, _energyConsumed, _energyGenerated);
    }

    // Calculate the outstanding bill for the user
    function calculateBill(address _user) public returns (uint256) {
        User storage user = users[_user];
        int256 netEnergy = int256(user.energyGenerated) -
            int256(user.energyConsumed);

        if (netEnergy < 0) {
            user.hasOutstandingBill = true;
            user.outstandingAmount = uint256(-netEnergy) * billingRate;
        } else {
            user.hasOutstandingBill = false;
            user.outstandingAmount = 0;
        }
        emit BillCalculated(_user, user.outstandingAmount);
        return user.outstandingAmount;
    }

    // Settle the outstanding bill
    function settleBill() public payable {
        User storage user = users[msg.sender];
        require(user.hasOutstandingBill, "No outstanding bill to pay.");
        require(
            msg.value >= user.outstandingAmount,
            "Insufficient payment to settle the bill."
        );

        uint256 amountPaid = user.outstandingAmount;
        user.hasOutstandingBill = false;
        user.outstandingAmount = 0;

        emit BillSettled(msg.sender, amountPaid);

        // Refund any excess payment
        if (msg.value > amountPaid) {
            payable(msg.sender).transfer(msg.value - amountPaid);
        }
    }

    // Get the user's current energy balance and bill status
    function getUserStatus(
        address _user
    )
        public
        view
        returns (
            uint256 consumed,
            uint256 generated,
            bool outstandingBill,
            uint256 outstandingAmount
        )
    {
        User storage user = users[_user];
        return (
            user.energyConsumed,
            user.energyGenerated,
            user.hasOutstandingBill,
            user.outstandingAmount
        );
    }
}
