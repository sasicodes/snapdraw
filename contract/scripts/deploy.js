const hre = require("hardhat");

async function main() {
  const SnapDrawContract = await hre.ethers.getContractFactory("SnapDraw");
  const SnapDraw = await SnapDrawContract.deploy();

  await SnapDraw.deployed();

  console.log("SnapDraw deployed to: ", SnapDraw.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
