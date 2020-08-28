pragma solidity ^0.5.0;

import "./AakuToken.sol";
import "./DaiToken.sol";

contract TokenFarm { 
  string public name = 'AAku Token Farm';
  AakuToken public aakuToken;
  DaiToken public daiToken;


  constructor(AakuToken _aakuToken, DaiToken _daiToken) public {
    aakuToken = _aakuToken;
    daiToken = _daiToken;
  }
  
}
