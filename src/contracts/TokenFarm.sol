pragma solidity ^0.5.0;

import "./AakuToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    string public name = "AAku Token Farm";
    AakuToken public aakuToken;
    DaiToken public daiToken;

    address[] public stakers;
    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(AakuToken _aakuToken, DaiToken _daiToken) public {
        aakuToken = _aakuToken;
        daiToken = _daiToken;
    }

    // 1. Stakes Tokens : put money into app
    function stakeTokens(uint256 _amounts) public {
        // Transfer Mock Dai token to this contract for staking
        daiToken.transferFrom(msg.sender, address(this), _amounts);
        // Update staking balance
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amounts;
        // Add user to staker array iff they haven't staked already
        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }
        // Updating Status
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }
    // 2. Unstaking Tokens : get money from app

    // 3. Issuing Tokens :
}
