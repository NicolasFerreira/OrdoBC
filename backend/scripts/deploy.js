const hre = require("hardhat");
const networkName = hre.network.name;

// Function to convert a string to bytes
function stringToBytes(inputString) {
  return hre.ethers.hexlify(hre.ethers.toUtf8Bytes(inputString));
} 

async function main() {
  // Get the contract to deploy
  const Ordo = await hre.ethers.deployContract("Ordo");
  await Ordo.waitForDeployment();
  console.log("Ordo deployed to:", Ordo.target);

  if (networkName === "localhost") {
    // Define test addresses (replace these with actual addresses for real deployment)
    const [owner, doctor, pharmacist, patient] = await ethers.getSigners();

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

    const prescriptionString = JSON.stringify({
      prescriptionId: "ABC123",
      medication: "Aspirin",
      dosage: "200 mg",
      frequency: "twice a day"  
    });
    const prescriptionData = "U2FsdGVkX18g5plfMkBQMvZdHEeV/xjEe+5IIQrszV9i3YXBPGFaLVvIjDcIF7vG6+fix+n+qcPhbmwfKiF2+wQFX6L8miJx3uwVjYA9PY/wTMIzXKsSFlcBvgftACMtSuP0odxX8qacP0eg1mhTrdxtrZW6KRr2ZbbrK5hTuUqRVeIEJSiyfU7hy+cK8DF33FUF/gMOtV+W9eWTWHNoea51JlQ8HCofH04oENOHBqJE1hsOW/mUpiVjDqpdCxSBigctvx/IAqyQYWwm0oLiiF7HVrZbjxeU6QG+prPpS3KOALweejEN39pHabX4RhUAeILKDWiw2TNB2+HgBI+zYHt5MobhGeSakJFcWgDe4t28p+K+k8Q9AbR+kE7YGnhgVuL/A0YDvBugDGVpcidr9ItVkV1ZvZI/VxECHN2v/xrGW2nhqVtgsQHhvKmzLGfoI3rns1sevf/m4K2Jxa9nZZg4BzWDNoZf+tCthNUMBkaQvSU/1YcjjWWdvYYEn3G0opdctNXDyxUD90ete2QzBU3+gYb2Fwp6f0c2Ls56mqA=";

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
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
