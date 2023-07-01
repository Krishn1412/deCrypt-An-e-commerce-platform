pragma solidity >=0.4.22 <=0.8.12;

contract Election {
    address payable sendto;
    struct seller{
        string name;
        uint id_s;
        address add;
        bool exist_s;
    }

    constructor() public {
    }
    function payment(address _add) public payable{
        address payable temp = address(uint160(_add));
        temp.transfer(msg.value);
        // candidates[candidatesCount].id =sendto.balance;  
    }
    function addSeller(address _recv) public{
        sendto = address(uint160(_recv));
        // candidates[candidatesCount].id = sendto;
    }
}
