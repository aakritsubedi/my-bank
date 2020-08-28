pragma solidity ^0.5.0;

import "./AakuToken.sol";
import "./DaiToken.sol";

contract TokenFarm {
    string public name = "AAku Token Farm";
    address public owner;
    AakuToken public aakuToken;
    DaiToken public daiToken;

    address[] public stakers;
    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(AakuToken _aakuToken, DaiToken _daiToken) public {
        aakuToken = _aakuToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }

    //  Stakes Tokens : put money into app
    function stakeTokens(uint256 _amounts) public {
        // Require amount greater than 0
        require(_amounts > 0, "Amount cannot be zero...");

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

    //  Issuing Tokens
    function issueTokens() public {
        // Only owner can this function
        require(msg.sender == owner, "Unauthorised");

        for (uint256 i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint256 balance = stakingBalance[recipient];
            if (balance > 0) {
                aakuToken.transfer(recipient, balance);
            }
        }
    }

    //  Unstaking Tokens : get money from app
    function unstakeTokens() public {
        // Fetch staking balance
        uint256 balance = stakingBalance[msg.sender];
        // Require amount greater than 0
        require(balance > 0, "Staking balance can't be zero...");
        // Transfer Mock Dai token to this contract for staking
        daiToken.transfer(msg.sender, balance);

        // Reset staking balance and update staking status
        stakingBalance[msg.sender] = 0;
        isStaking[msg.sender] = false;
    }
}
