const { ethers } = require("hardhat");
const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

const encryptedData1 = "0x446f63746f72204a6f686e20446f65000000000000000000000000000000000000";
const encryptedData2 = "0x506861726d6163697374204a616e6520536d697468000000000000000000000000"; // "Pharmacist Jane Smith"
const encryptedData3 = "0x50617469656e7420426f62204d617274696e000000000000000000000000000000"; // "Patient Bob Martin"
const encryptedDetails = "0x507265736372697074696f6e49423a203230306d672c207477696365206120646179"; // "PrescriptionIB: 200mg, twice a day"

async function fixture() {
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();
    const ordo = await ethers.deployContract("Ordo");

    return { owner, addr1, addr2, addr3, ordo };
}

async function fixtureWithUsers() {
    const [owner, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();
    const ordo = await ethers.deployContract("Ordo");

    await ordo.registerUser(addr1.address, 1, encryptedData1);// doctor
    await ordo.registerUser(addr2.address, 2, encryptedData2);// pharma
    await ordo.registerUser(addr3.address, 3, encryptedData3);// patient 1
    await ordo.registerUser(addr4.address, 3, encryptedData3);// patient 2

    return { owner, addr1, addr2, addr3, ordo, addr4, addr5 };
}

async function fixtureWithNFT() {
    const {owner, addr1, addr2, addr3, ordo, addr4, addr5} = await fixtureWithUsers();
    await ordo.connect(addr1).mintPrescription(addr3.address, encryptedDetails);
    return { owner, addr1, addr2, addr3, ordo, addr4, addr5 };
}


describe("Ordo", function () {

    describe("Users", function () {
        beforeEach(async function () {
            Object.assign(this, await loadFixture(fixture));
        });

        describe("Register User", function () {
            it("should fail if user is not the owner", async function () {
                await expect(this.ordo.connect(this.addr2).registerUser(this.addr1.address, 1, encryptedData1))
                    .to.be.revertedWithCustomError(this.ordo, "OwnableUnauthorizedAccount");
            });


            it("should fail if user is already registered", async function () {
                await this.ordo.registerUser(this.addr1.address, 1, encryptedData1);
                await expect(this.ordo.registerUser(this.addr1.address, 1, encryptedData1))
                    .to.be.revertedWithCustomError(this.ordo, "UserAlreadyRegistered");
            });

            // Check if user is registered with checkin role , if UKNOWN => not registered
            it("should register an user", async function () {
                await this.ordo.registerUser(this.addr1.address, 1, encryptedData1);
                const user = await this.ordo.users(this.addr1.address);
                expect(user.role).to.equal(1);
                expect(user.encryptedDatas).to.equal(encryptedData1);
            });

            it("should emit an event when an user is registered", async function () {
                await expect(this.ordo.registerUser(this.addr1.address, 1, encryptedData1))
                    .to.emit(this.ordo, "UserRegistered")
                    .withArgs(this.addr1.address, 1);
            });
        });

        describe("Get User Role", function () {
            it("should return role of an user address", async function () {
                await this.ordo.registerUser(this.addr1.address, 1, encryptedData1);
                const role = await this.ordo.getRole(this.addr1.address);
                expect(role).to.equal(1);
            });
        });
    });

    describe("Ordonnance", function () {
        

        describe("Mint Prescription", function () {
            beforeEach(async function () {
                Object.assign(this, await fixtureWithUsers(fixture));
            });

            it("should fail if user is not doctor", async function () {
                await expect(this.ordo.connect(this.addr2).mintPrescription(this.addr3.address, encryptedDetails))
                    .to.be.revertedWithCustomError(this.ordo, "NotDoctor");
            });

            it("should fail if address to mint is not a patient address", async function () {
                await expect(this.ordo.connect(this.addr1).mintPrescription(this.addr2.address, encryptedDetails))
                    .to.be.revertedWithCustomError(this.ordo, "AddressToMintIsNotPatient");
            });

            it("should mint a prescription", async function () {
                await this.ordo.connect(this.addr1).mintPrescription(this.addr3.address, encryptedDetails);
                // check datas prescription is correct
                const prescription = await this.ordo.connect(this.addr3).getPrescription(1);
                expect(prescription[0]).to.equal(this.addr1.address);
                expect(prescription[1]).to.equal(this.addr3.address);
                expect(prescription[2]).to.equal(encryptedDetails);
                expect(prescription[3]).to.be.false;
                //check ownerOf NFT is the address of patient
                const ownerOrdo = await this.ordo.ownerOf(1);
                expect(ownerOrdo).to.equal(this.addr3.address);
            });

            it("should emit an event when an prescription is minted", async function () {
                await expect(this.ordo.connect(this.addr1).mintPrescription(this.addr3.address, encryptedDetails))
                    .to.emit(this.ordo, "PrescriptionMinted")
                    .withArgs(1,this.addr1.address,this.addr3.address );
            });
        });

        describe("Get Prescription", function () {
            beforeEach(async function () {
                Object.assign(this, await fixtureWithNFT(fixture));
            });

            it("should fail if user is not registred", async function () {
                await expect(this.ordo.connect(this.addr5).getPrescription(1))
                    .to.be.revertedWithCustomError(this.ordo, "NotRegistred");
            });

            it("should fail if token does not exist", async function () {
                await expect(this.ordo.connect(this.addr3).getPrescription(2))
                   .to.be.revertedWithCustomError(this.ordo, "ERC721NonexistentToken");
            });

            it("should fail if user is patient but not the owner of nft", async function () {
                await expect(this.ordo.connect(this.addr4).getPrescription(1))
                   .to.be.revertedWithCustomError(this.ordo, "GetPrescriptionUnauthorized");
            });

            it("should get a prescription", async function () {
                await this.ordo.connect(this.addr3).getPrescription(1);
                const prescription = await this.ordo.connect(this.addr3).getPrescription(1);
                expect(prescription[0]).to.equal(this.addr1.address);
                expect(prescription[1]).to.equal(this.addr3.address);
            });

        });

        describe("Mark As Treated", function () {
            beforeEach(async function () {
                Object.assign(this, await fixtureWithNFT(fixture));
            });

            it("should fail if user is not pharmacist", async function () {
                await expect(this.ordo.connect(this.addr1).markAsTreated(1))
                    .to.be.revertedWithCustomError(this.ordo, "NotPharmacist");
            });

            it("should fail if token does not exist", async function () {
                await expect(this.ordo.connect(this.addr2).markAsTreated(2))
                   .to.be.revertedWithCustomError(this.ordo, "ERC721NonexistentToken");
            });

            it("should update treated state of prescription", async function () {
                await this.ordo.connect(this.addr2).markAsTreated(1);
                const prescription = await this.ordo.connect(this.addr3).getPrescription(1);
                expect(prescription[3]).to.be.true;
            })

            it("should emit an event when an prescription is treated", async function () {
                await expect(this.ordo.connect(this.addr2).markAsTreated(1))
                    .to.emit(this.ordo, "PrescriptionTreated")
                    .withArgs(1);
            });

        });
    })

});