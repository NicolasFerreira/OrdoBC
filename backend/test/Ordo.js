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
    const [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();
    const ordo = await ethers.deployContract("Ordo");

    await ordo.registerUser(addr1.address, 1, encryptedData1);
    await ordo.registerUser(addr2.address, 2, encryptedData2);
    await ordo.registerUser(addr3.address, 3, encryptedData3);

    return { owner, addr1, addr2, addr3, ordo, addr4 };
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
    });

    describe("Ordonnance", function () {
        beforeEach(async function () {
            Object.assign(this, await fixtureWithUsers(fixture));
        });

        describe("Mint Prescription", function () {
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
        });

        describe("Get Prescription", function () {

        });

        describe("Mark As Treated", function () {

        });
    })

});