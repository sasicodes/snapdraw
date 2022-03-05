const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SnapDraw contract", function () {
  it("Should mint tokens to the owner", async function () {
    const [owner, alice] = await ethers.getSigners();

    const SnapDrawContract = await ethers.getContractFactory("SnapDraw");

    const SnapDraw = await SnapDrawContract.deploy();

    await SnapDraw.safeMint(
      owner.address,
      'bafyreih7ds6sjk7nm42zncdqqhsfhdppelmhv7ggsfnbmt7lacanpegmse/metadata.json'
    )
    await SnapDraw.safeMint(
      alice.address,
      'bafyreih7ds6sjk7nm42zncdqqhsfhdppelmhv7ggsfnbmt7lacanpegmse/metadata.json'
    )
    await SnapDraw.safeMint(
      alice.address,
      'bafyreih7ds6sjk7nm42zncdqqhsfhdppelmhv7ggsfnbmt7lacanpegmse/metadata.json'
    )

    const ownerBalance = await SnapDraw.balanceOf(owner.address);
    const aliceBalance = await SnapDraw.balanceOf(alice.address);
    const tokenURI = await SnapDraw.tokenURI(1);
    expect(tokenURI).to.equal('bafyreih7ds6sjk7nm42zncdqqhsfhdppelmhv7ggsfnbmt7lacanpegmse/metadata.json')
    expect(ownerBalance).to.equal(1)
    expect(aliceBalance).to.equal(2)
  });
});