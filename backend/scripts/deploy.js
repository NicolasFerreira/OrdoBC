const hre = require("hardhat");
const networkName = hre.network.name;

// Function to convert a string to bytes
function stringToBytes(inputString) {
  return hre.ethers.hexlify(hre.ethers.toUtf8Bytes(inputString));
} 

 // Register users with encrypted data
 const doctorString = JSON.stringify({
  name: "Dr. John Doe",
  specialty: "Cardiology",
  hospital: "General Hospital"
})
const doctorData = stringToBytes(doctorString);

const pharmacistString = JSON.stringify({
  name: "Pharmacist Jane Smith",
  pharmacy: "HealthPlus Pharmacy"
});
const pharmacistData = stringToBytes(pharmacistString);

const patientString = JSON.stringify({
  name: "Patient Bob Brown",
  dob: "1990-01-01",
  insurance: "123456789"
});
const patientData = stringToBytes(patientString);

const prescriptionData = "U2FsdGVkX18g5plfMkBQMvZdHEeV/xjEe+5IIQrszV9i3YXBPGFaLVvIjDcIF7vG6+fix+n+qcPhbmwfKiF2+wQFX6L8miJx3uwVjYA9PY/wTMIzXKsSFlcBvgftACMtSuP0odxX8qacP0eg1mhTrdxtrZW6KRr2ZbbrK5hTuUqRVeIEJSiyfU7hy+cK8DF33FUF/gMOtV+W9eWTWHNoea51JlQ8HCofH04oENOHBqJE1hsOW/mUpiVjDqpdCxSBigctvx/IAqyQYWwm0oLiiF7HVrZbjxeU6QG+prPpS3KOALweejEN39pHabX4RhUAeILKDWiw2TNB2+HgBI+zYHt5MobhGeSakJFcWgDe4t28p+K+k8Q9AbR+kE7YGnhgVuL/A0YDvBugDGVpcidr9ItVkV1ZvZI/VxECHN2v/xrGW2nhqVtgsQHhvKmzLGfoI3rns1sevf/m4K2Jxa9nZZg4BzWDNoZf+tCthNUMBkaQvSU/1YcjjWWdvYYEn3G0opdctNXDyxUD90ete2QzBU3+gYb2Fwp6f0c2Ls56mqA=";


async function main() {
  // Get the contract to deploy
  const Ordo = await hre.ethers.deployContract("Ordo");
  await Ordo.waitForDeployment();
  console.log("Ordo deployed to:", Ordo.target);

  if (networkName === "localhost") {
    // Define test addresses (replace these with actual addresses for real deployment)
    const [owner, doctor, pharmacist, patient] = await ethers.getSigners();

   
    await Ordo.registerUser(doctor.address, 1, doctorData);
    console.log("Doctor registered:", doctor.address);

    await Ordo.registerUser(pharmacist.address, 2, pharmacistData);
    console.log("Pharmacist registered:", pharmacist.address);

    await Ordo.registerUser(patient.address, 3, patientData);
    console.log("Patient registered:", patient.address);

    try {
      await Ordo.connect(doctor).mintPrescription(patient.address, prescriptionData);
      console.log("Prescription minted : ", prescriptionData);
    } catch (error) {
      console.log("Error: Prescription minted");
    }
    
  }

  if (networkName === "base-sepolia"){
    // Nico wallets
    await Ordo.registerUser("0x520Aae94Da19a41eb6feD3994b6421b0e33bA83c", 1, doctorData);
    console.log("Doctor registered:");

    await Ordo.registerUser("0x6209fa9edbcb606adb55B29Af7208EB56920B404", 2, pharmacistData);
    console.log("Pharmacist registered:");

    await Ordo.registerUser("0xf7ccd5DaB1059204304146AF1f7DDC87B93545Ba", 3, patientData);
    console.log("Patient registered:");


    // Gui Wallets 
    await Ordo.registerUser("0x9B123a0C4Be8a658593Ca17E101FC126B0a9D867", 1, doctorData);
    console.log("Doctor registered:");

    await Ordo.registerUser("0x147ea91C4E150ba3F5dF7607C7771ACB8741e3AD", 2, pharmacistData);
    console.log("Pharmacist registered:");

    await Ordo.registerUser("0x63522F008590179d35E1F8aBE9A78b407e666667", 3, patientData);
    console.log("Patient registered:");

    // so Wallets
    await Ordo.registerUser("0x3D836C9149c26F3Cb2eCB084cc817fE0C877c191", 1, doctorData);
    console.log("Doctor registered:");

    await Ordo.registerUser("0xb79B525aC89965d8f164Ed0c670F7e38CBA37e65", 2, pharmacistData);
    console.log("Pharmacist registered:");

    await Ordo.registerUser("0xF4d15Ad565796d69FD3D4CB66F7A3508136ab63f", 3, patientData);
    console.log("Patient registered:");

  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
