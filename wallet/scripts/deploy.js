
const hre = require("hardhat");

async function main() {
  
  
  const payment = await hre.ethers.deployContract("Payment",[]);
  await payment.waitForDeployment();
  console.log("Payment contract deployed at :",await payment.getAddress());
  
  const token = await hre.ethers.deployContract("MyToken",[10000]);
  await token.waitForDeployment();
  console.log("Token deplyed at:",await token.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
