import React, { Component } from "react";
import Web3 from "web3";

import DaiToken from "../abis/DaiToken.json";
import AakuToken from "../abis/AakuToken.json";
import TokenFarm from "../abis/TokenFarm.json";

import Navbar from "./Navbar";
import "./App.css";

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockChainData();
  }

  async loadBlockChainData() {
    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();
    this.setState({
      account: accounts[0],
    });

    const networkId = await web3.eth.net.getId();

    // Load DaiToken
    const daiTokenData = DaiToken.networks[networkId];
    if (daiTokenData) {
      const daiToken = new web3.eth.Contract(
        DaiToken.abi,
        daiTokenData.address
      );
      this.setState({ daiToken });
      let daiTokenBalance = await daiToken.methods
        .balanceOf(this.state.account)
        .call();
      this.setState({ daiTokenBalance: daiTokenBalance.toString() });
    } else {
      window.alert("DaiToken contract not deployed to detected network.");
    }

    // Load AakuToken
    const aakuTokenData = AakuToken.networks[networkId];
    if (aakuTokenData) {
      const aakuToken = new web3.eth.Contract(
        AakuToken.abi,
        aakuTokenData.address
      );
      this.setState({ aakuToken });
      let aakuTokenBalance = await aakuToken.methods
        .balanceOf(this.state.account)
        .call();
      this.setState({ aakuTokenBalance: aakuTokenBalance.toString() });
    } else {
      window.alert("AakuToken contract not deployed to detected network.");
    }

    // Load TokenFarm
    const tokenFarmData = TokenFarm.networks[networkId];
    if (tokenFarmData) {
      const tokenFarm = new web3.eth.Contract(
        TokenFarm.abi,
        tokenFarmData.address
      );
      this.setState({ tokenFarm });
      let stakingBalance = await tokenFarm.methods
        .stakingBalance(this.state.account)
        .call();
      this.setState({ stakingBalance: stakingBalance.toString() });
    } else {
      window.alert("TokenFarm contract not deployed to detected network.");
    }

    this.setState({ loading: false });
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("Non-Ethereum browser detected. Use MetaMask!!");
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      account: "0x0",
      daiToken: {},
      aakuToken: {},
      tokenFarm: {},
      daiTokenBalance: "0",
      aakuTokenBalance: "0",
      stakingBalance: "0",
      loading: true,
    };
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main
              role="main"
              className="col-lg-12 ml-auto mr-auto"
              style={{ maxWidth: "600px" }}
            >
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.aakritsubedi.com.np"
                  target="_blank"
                  rel="noopener noreferrer"
                ></a>

                <h1>Hey Money</h1>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
