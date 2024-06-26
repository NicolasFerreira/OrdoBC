const { ethers } = require('hardhat');
const { expect } = require('chai');
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');

const encryptedData = "0x446f63746f72204a6f686e20446f65000000000000000000000000000000000000"; 

async function fixture() {
  const [owner, addr1, addr2, addr3] = await ethers.getSigners();
  const ordo = await ethers.deployContract('Ordo');

  return { owner, addr1, addr2, addr3, ordo , };
}

describe('Ordo', function () {
  
  describe('Users', function () {
    beforeEach(async function () {
        Object.assign(this, await loadFixture(fixture));
    });

    describe('registerUser', function () {
        it('should fail if user is not the owner', async function () {
          await expect(this.ordo.connect(this.addr2).registerUser(this.addr1.address, 1, encryptedData))
            .to.be.revertedWithCustomError(this.ordo,"OwnableUnauthorizedAccount");
        });

        
          it('should fail if user is already registered', async function () {
            await this.ordo.registerUser(this.addr1.address, 1, encryptedData);
            await expect(this.ordo.registerUser(this.addr1.address, 1, encryptedData))
            .to.be.revertedWithCustomError(this.ordo,"UserAlreadyRegistered");
          });
        
          it('should register an user', async function () {
            await this.ordo.registerUser(this.addr1.address, 1, encryptedData);
            const roleOfUser = await this.ordo.connect(this.addr1).getRoles(this.addr1.address);
            expect(roleOfUser).to.equal(1);
          });
        
          it('should emit an event when an user is registered', async function () {
            await expect(this.ordo.registerUser(this.addr1.address, 1, encryptedData))
              .to.emit(this.ordo, "UserRegistered")
              .withArgs(this.addr1.address, 1);
          });
    
      
      });

  });

});