const { ethers } = require('hardhat');
const { expect } = require('chai');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');

async function fixture() {
  const [owner, addr1, addr2, addr3] = await ethers.getSigners();
  const ordo = await ethers.deployContract('Ordo');
  return { owner, addr1, addr2, addr3, ordo };
}

describe('Ordo', function () {
  
  describe('Users', function () {
    beforeEach(async function () {
        Object.assign(this, await loadFixture(fixture));
    });

    describe('registerUser', function () {
        it('should fail if user is not the owner', async function () {
          const encryptedData = "0x446f63746f72204a6f686e20446f65000000000000000000000000000000000000"; 
        
          await expect(this.ordo.connect(this.addr1).registerUser(this.addr2.address, 1, encryptedData))
            .to.be.revertedWithCustomError(this.ordo,"OwnableUnauthorizedAccount");
        });
    
      
      });

  });

});