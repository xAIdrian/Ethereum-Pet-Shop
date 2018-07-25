pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Adoption.sol";

contract TestAdoption {
    /*
    define a contract-wide variable containing the smart contract to be tested, 
    calling the DeployedAddresses smart contract to get its address. */
    Adoption adoption = Adoption(DeployedAddresses.Adoption());

    function testUserCanAdoptPet() public {
        uint returnId = adoption.adopt(8);

        uint expected = 8;

        Assert.equal(returnId, expected, "Adoption of pet ID 8 should be recorder/");
    }

    function testGetAdopterAddressByPetIdInArray() public {
        address expected = this;
        //store adopters in memory rather than contracts's storage
        address[16] memory adopters = adoption.getAdopters();

        Assert.equal(adopters[8], expected, "Owner of pet ID 8 should be recorded");
    }


}