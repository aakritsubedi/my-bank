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
});
