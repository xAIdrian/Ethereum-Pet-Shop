pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Adoption.sol";

contract TestAdoption {
    /*
    define a contract-wide variable containing the smart contract to be tested, 
    calling the DeployedAddresses smart contract to get its address.
    */
    Adoption adoption = Adoption(DeployedAddresses.Adoption());

    function testUserCanAdoptPet() public {
        uint returnId = adoption.adopt(8);

        uint expected = 8;

        Assert.equal(returnId, expected, "Adoption of pet ID 8 should be recorder/");
    }
}