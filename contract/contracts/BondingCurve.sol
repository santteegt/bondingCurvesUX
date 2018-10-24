pragma solidity ^0.4.24;

import './token/Token.sol';
import './bondingCurve/BancorFormula.sol';

import 'openzeppelin-solidity/contracts/math/SafeMath.sol';
import 'openzeppelin-solidity/contracts/ownership/Ownable.sol';

contract BondingCurve is BancorFormula, Ownable {

    using SafeMath for uint256;
    using SafeMath for uint;

    // global variables
    Token  public  mToken;
    mapping (address => uint256) balances;
    mapping (address => uint256) drops;

    // bonding Curve
    uint256 public scale = 10 ** 18;
    uint256 public totalSupply = 100;
    uint256 public ghostSupply = 10;
    uint256 public poolBalance = 1 * scale;
    uint32  public reserveRatio = 900000;
    uint256 public tokensToMint = 0;
    uint256 public ndrops = ghostSupply;
    uint256 public nOcean = 1 * scale;

    event TokenWithdraw(address indexed _requester, uint256 amount);
    event TokenBuyDrops(address indexed _requester, uint256 _ocn, uint256 _drops, uint256 _price);
    event TokenSellDrops(address indexed _requester, uint256 _ocn, uint256 _drops, uint256 _price);
    event Debug(uint256 _supply, uint256 _connectorBalance, uint32 _connectorWeight, uint256 _depositAmount);


    ///////////////////////////////////////////////////////////////////
    //  Query function
    ///////////////////////////////////////////////////////////////////
    function dropsBalance() public view returns (uint256){
        require(msg.sender != 0x0);
        return drops[msg.sender];
    }

    function dropsSupply() public view returns (uint256){
        return ndrops - ghostSupply;
    }

    function tokenBalance() public view returns (uint256) {
        return balances[msg.sender];
    }
    ///////////////////////////////////////////////////////////////////
    //  Constructor function
    ///////////////////////////////////////////////////////////////////
    // 1. constructor
    constructor(address _tokenAddress) public {
        require(_tokenAddress != address(0));
        // instantiate deployed Ocean token contract
        mToken = Token(_tokenAddress);
        // set the token receiver to be marketplace
        mToken.setReceiver(address(this));
    }

    // 2. request initial fund transfer
    function requestTokens(uint256 amount) public returns (uint256) {
        require(msg.sender != 0x0);
        require(mToken.transfer(msg.sender, amount));
        return amount;
    }


    // 5. withdraw
    function withdraw() public returns (bool) {
        uint256 amount = balances[msg.sender];
        balances[msg.sender] = 0;
        require(mToken.transfer(msg.sender, amount));
        emit TokenWithdraw(msg.sender, amount);
        return true;
    }

    ///////////////////////////////////////////////////////////////////
    // Bonding Curve Module
    ///////////////////////////////////////////////////////////////////
    function buyDrops(uint256 _ocn) public returns (uint256 _drops) {
        // emit Debug(ndrops, nOcean / scale, reserveRatio, _ocn / scale);
        tokensToMint = calculatePurchaseReturn(ndrops, nOcean / scale, reserveRatio, _ocn / scale);
        ndrops = ndrops.add(tokensToMint);
        nOcean = nOcean.add(_ocn);

        balances[msg.sender] = balances[msg.sender].add(_ocn);
        require(mToken.transferFrom(msg.sender, address(this), _ocn));

        totalSupply = totalSupply.add(tokensToMint);
        poolBalance = poolBalance.add(_ocn);

        balances[msg.sender] = balances[msg.sender].sub(_ocn);
        drops[msg.sender] = drops[msg.sender].add(tokensToMint);

        emit TokenBuyDrops(msg.sender, _ocn, tokensToMint, _ocn / tokensToMint);
        return tokensToMint;
    }

    function sellDrops(uint256 _drops) public returns (uint256 _ocn) {
        uint256 ocnAmount = calculateSaleReturn(ndrops, nOcean / scale, reserveRatio, _drops) * scale;
        ndrops = ndrops.sub(_drops);
        nOcean = nOcean.sub(ocnAmount);

        totalSupply = totalSupply.sub(_drops);
        poolBalance = poolBalance.sub(ocnAmount);

        balances[msg.sender] = balances[msg.sender].add(ocnAmount);
        drops[msg.sender] = drops[msg.sender].sub(_drops);

        emit TokenSellDrops(msg.sender, ocnAmount, _drops, ocnAmount / _drops);
        return ocnAmount;
    }

}
