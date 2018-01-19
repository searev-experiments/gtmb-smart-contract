var Migrations = artifacts.require("./Migrations.sol");
var GiveTheMoneyBack = artifacts.require("./GiveTheMoneyBack.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(GiveTheMoneyBack);
};
