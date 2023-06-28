// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity  0.8.18;
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
contract Payment  {
    
    using SafeERC20 for IERC20;

    error ZeroAddress();
    error Insufficient_funds();

    event Fundsend(address indexed from,address indexed to,uint indexed amount);
    
    
    function makePayment(address _token,address to,uint amount) external {
        if(to == address(0)){
            revert ZeroAddress();
        }
         IERC20 token=IERC20(_token);
         if(token.balanceOf(msg.sender)<amount){
             revert Insufficient_funds();
         }
         token.safeTransferFrom(msg.sender,address(this),amount);
         token.safeTransfer(to,amount);
      
         emit Fundsend(msg.sender, to, amount);
    }
   
}