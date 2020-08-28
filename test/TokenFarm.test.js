const { assert } = require("chai");

const AakuToken = artifacts.require("AakuToken");
const DaiToken = artifacts.require("DaiToken");
const TokenFarm = artifacts.require("TokenFarm");

require("chai")
  .use(require("chai-as-promised"))
  .should();

function tokens(n) {
  return web3.utils.toWei(n, "ether");
}

contract("TokenFarm", ([owner, investor]) => {
  let daiToken, aakuToken, tokenFarm;

  before(async () => {
    // Load Contract
    daiToken = await DaiToken.new();
    aakuToken = await AakuToken.new();
    tokenFarm = await TokenFarm.new(aakuToken.address, daiToken.address);

    // Transfer all AAku Token to farm
    await aakuToken.transfer(tokenFarm.address, tokens("1000000"));

    // Send tokens to investor
    await daiToken.transfer(investor, tokens("100"), { from: owner });
  });

  describe("Dai Token deployment", async () => {
    it("has a name", async () => {
      const name = await daiToken.name();
      assert.equal(name, "Mock DAI Token");
    });
  });
  describe("AAku Token deployment", async () => {
    it("has a name", async () => {
      const name = await aakuToken.name();
      assert.equal(name, "AAku Token");
    });
  });

  describe("Token Farm deployment", async () => {
    it("has a name", async () => {
      const name = await tokenFarm.name();
      assert.equal(name, "AAku Token Farm");
    });

    it("contract has tokens", async () => {
      let balance = await aakuToken.balanceOf(tokenFarm.address);
      assert.equal(balance.toString(), tokens("1000000"));
    });
  });

  describe("Farming Tokens", async () => {
    it("rewards investors for staking mDai tokens", async () => {
      let result;

      result = await daiToken.balanceOf(investor);
      assert.equal(
        result.toString(),
        tokens("100"),
        "investor Mock Dai token wallet balance correct before staking"
      );

      // Stake Mock DAI Token
      await daiToken.approve(tokenFarm.address, tokens("100"), {
        from: investor,
      });
      await tokenFarm.stakeTokens(tokens("100"), { from: investor });

      // Check staking result
      result = await daiToken.balanceOf(investor);
      assert.equal(
        result.toString(),
        tokens("0"),
        "investor Mock Dai token wallet balance correct after staking"
      );

      // Checking Staking Balance
      result = await tokenFarm.stakingBalance(investor);
      assert.equal(
        result.toString(),
        tokens("100"),
        "Investor staking balance corret after staking"
      );

      // Staking Status
      result = await tokenFarm.isStaking(investor);
      assert.equal(
        result.toString(),
        "true",
        "Investor Staking Status correct after staking"
      );
    });
  });
});
