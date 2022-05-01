// SPDX-License-Identifier: MIT
pragma solidity  >=0.6.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";
contract FlemingToken is ERC20PresetMinterPauser {

    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    constructor(uint256 initialSupply) ERC20PresetMinterPauser("FlemingToken", "FLEM") {
        _mint(msg.sender, initialSupply);
        grantRole(BURNER_ROLE, msg.sender);
    }

    function burn(uint256 value) public onlyRole(BURNER_ROLE) override {
        super._burn(msg.sender, value);
    }

/*
    uint256 public unitsOneEthCanBuy  = 10;
    address public tokenOwner;         // the owner of the token

    // constructor will only be invoked during contract deployment
    constructor(string memory name, string memory symbol)
    ERC20(name, symbol) {
        tokenOwner = msg.sender;       // address of the token owner
        uint256 n = 1000;
        // mint the tokens
        _mint(msg.sender, n * 10**uint(decimals()));
    }
    // this function is called when someone sends ether to the token contract
    receive() external payable {
        // msg.value (in Wei) is the ether sent to the token contract
        // msg.sender is the account that sends the ether to the token contract
        // amount is the token bought by the sender
        uint256 amount = msg.value * unitsOneEthCanBuy;

        // ensure you have enough tokens to sell
        require(balanceOf(tokenOwner) >= amount,
            "Not enough tokens");

        // transfer the token to the buyer
        _transfer(tokenOwner, msg.sender, amount);

        // emit an event to inform of the transfer
        emit Transfer(tokenOwner, msg.sender, amount);

        // send the ether earned to the token owner
        payable(tokenOwner).transfer(msg.value);
    }
*/
}