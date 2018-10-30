<img width="1280" alt="screen shot 2018-10-29 at 10 32 01 pm" src="https://user-images.githubusercontent.com/7444521/47697957-8cfbf780-dbca-11e8-9749-913ff13cfcf8.png">

# Ethereum-Pet-Shop

Truffle project using the [Ethereum Pet Shop Box](https://truffleframework.com/boxes/pet-shop), written in Solidity.  
User is able to adopt a pet using the `Adoption.sol` contract.  Up to 15 pets are abled to be adopted. 
Each pet representing an index in an array.  The index is updated with the pet's new owner's address.

````

contract Adoption {
    address[16] public adopters;

    // adopting a pet
    function adopt(uint petId) public returns (uint) {
        require(petId >= 0 && petId <= 15);

        adopters[petId] = msg.sender;

        return petId;
    }
    
    // retrieves the adopters
    function getAdopters() public view returns (address[16]) {
        return adopters;
    }
}
````
