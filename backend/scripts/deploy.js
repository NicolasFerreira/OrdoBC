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

    await Ordo.registerUser(doctor.address, 1, doctorData);
    console.log("Doctor registered:", doctor.address);

    await Ordo.registerUser(pharmacist.address, 2, pharmacistData);
    console.log("Pharmacist registered:", pharmacist.address);

    await Ordo.registerUser(patient.address, 3, patientData);
    console.log("Patient registered:", patient.address);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
