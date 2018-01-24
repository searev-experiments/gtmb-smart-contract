pragma solidity ^0.4.18;

contract GiveTheMoneyBack {

    address public owner; // creator of the contract
    address public receiver; // person who owes money
    address[] public backers; // people who back up the request
    uint256 public nbBackers; // Number of persons who backed the requests.
    uint256 public amount; // amount of wei owed
    string public description; // why the money is owed

    /* Generates a public event that notify clients when a new user backes the request */
    event Backed(address backer);

    /* Generates a public event that notify clients when the receiver has given the money back */
    event MoneyGivenBack(uint256 amountToDistribute);

    /**
     * Constructor
     *
     * @param receiverAddress address of the one who owes ether
     * @param etherAmount amount of ether owed
     * @param explanation explanation of the request
     */
    function GiveTheMoneyBack(address receiverAddress, uint256 etherAmount, string explanation) public {
        owner = msg.sender;
        receiver = receiverAddress;
        amount = etherAmount * 10 ** 18; // converts the ether into wei. 1 ether = 10^18 wei
        description = explanation;
        backers.push(owner); // add the creator of the contract as a backer
        nbBackers = 1;
    }

    /**
    * Back up the request for money
    */
    function backUp() public returns (bool) {
        /*require(msg.sender == receiver);*/
        if (msg.sender == receiver) {
            return false;
        }
        for (uint i = 0; i < backers.length; i++) {
            /*require(backers[index] != msg.sender);*/
            if (msg.sender == backers[i]) {
                return false;
            }
        }
        backers.push(msg.sender);
        nbBackers++;
        Backed(msg.sender);
        return true;
    }

    /**
    * Allows the receiver to pay his or her debts.
    */
    function payDebt() public payable returns (bool) {        
        if (msg.sender != receiver || msg.value != amount) {
            return false;
        }
        uint nbBackers = backers.length;
        uint256 amountToDistribute = amount / nbBackers;
        for (uint index = 0; index < nbBackers; index++) {
            backers[index].transfer(amountToDistribute);
        }
        MoneyGivenBack(amountToDistribute);
        return true;
    }
    
}
