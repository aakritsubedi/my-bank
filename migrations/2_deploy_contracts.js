const AakuToken = artifacts.require("AakuToken");
const DaiToken = artifacts.require("DaiToken");

const TokenFarm = artifacts.require("TokenFarm");

module.exports = async function (deployer, network, accounts) {
  // Deploy Mock Dai Token
  await deployer.deploy(DaiToken);
  const daiToken = await DaiToken.deployed();

  // Deploy Aaku Token
  await deployer.deploy(AakuToken);
  const aakuToken = await AakuToken.deployed();

  // Deploy TokenFarm
  await deployer.deploy(TokenFarm, aakuToken.address, daiToken.address);
  const tokenFarm = await TokenFarm.deployed();

  // Transfer all token to TokenFarm
  await aakuToken.transfer(tokenFarm.address, "1000000000000000000000000");

  // Transfer 100 Mock Dai tokens to investor
  await daiToken.transfer(accounts[1], '1000000000000000000000000');
};
