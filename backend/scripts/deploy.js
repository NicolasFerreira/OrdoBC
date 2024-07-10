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

   
    await Ordo.registerUser(doctor.address, 1, "U2FsdGVkX18/oaPf6eggDoTB37NUkSeMCPePb+tw7Y0GM9i9A94LfVzSEU4k2Z4UgQD1b6V/Dqb4Y9KnA9y4ePxojxweOTqxBpmgNRaD17ASwyJ9DWGACnmQgfFfhh4HUA5NPsgIRkQCw13reQOMJhX6oFOTMSkYtQ6OVlaSTm0cljgsh+LWvSHx9LOzM/be4i0T4tqc2UjeQ6tZPyBtPA==");
    console.log("Doctor registered:", doctor.address);

    await Ordo.registerUser(pharmacist.address, 2, pharmacistData);
    console.log("Pharmacist registered:", pharmacist.address);

    await Ordo.registerUser(patient.address, 3, "U2FsdGVkX18zDYttURT9/yIuQMuXv/VdW5nPsXgfg3j0BpyzneJfhYlLhL/RvoQ/QIgrdKB5gF7nrw2Y93ubeA7ymhfdaPKf6yzqnSMI18ouqzMRoqvDaAxQuZlBPaZAkpQPDGz26cLbUOJMFIO4zA==");
    console.log("Patient registered:", patient.address);

    // try {
    //   await Ordo.connect(doctor).mintPrescription(patient.address, prescriptionData);
    //   console.log("Prescription minted : ", prescriptionData);
    // } catch (error) {
    //   console.log("Error: Prescription minted");
    // }
    
  }

  if (networkName === "base-sepolia"){
    // Nico wallets
    await Ordo.registerUser("0x520Aae94Da19a41eb6feD3994b6421b0e33bA83c", 1, "U2FsdGVkX18/oaPf6eggDoTB37NUkSeMCPePb+tw7Y0GM9i9A94LfVzSEU4k2Z4UgQD1b6V/Dqb4Y9KnA9y4ePxojxweOTqxBpmgNRaD17ASwyJ9DWGACnmQgfFfhh4HUA5NPsgIRkQCw13reQOMJhX6oFOTMSkYtQ6OVlaSTm0cljgsh+LWvSHx9LOzM/be4i0T4tqc2UjeQ6tZPyBtPA==");
    console.log("Doctor registered:");

    await Ordo.registerUser("0x6209fa9edbcb606adb55B29Af7208EB56920B404", 2, pharmacistData);
    console.log("Pharmacist registered:");

    await Ordo.registerUser("0xf7ccd5DaB1059204304146AF1f7DDC87B93545Ba", 3, "U2FsdGVkX18zDYttURT9/yIuQMuXv/VdW5nPsXgfg3j0BpyzneJfhYlLhL/RvoQ/QIgrdKB5gF7nrw2Y93ubeA7ymhfdaPKf6yzqnSMI18ouqzMRoqvDaAxQuZlBPaZAkpQPDGz26cLbUOJMFIO4zA==");
    console.log("Patient registered:");


    // Gui Wallets 
    await Ordo.registerUser("0x9B123a0C4Be8a658593Ca17E101FC126B0a9D867", 1, "U2FsdGVkX1/DC+gVuBR2Jdw4Q8XVLSmcnwSYwnvnWwV4hO9+ZQsg6m9+4D2BcRXm4C9Rxakj8xYf1BU4n53cuwetebaJUKtwHeE8sonL4Bw4imCtHrSUazhOZWNV/OpLxM7Wg0VGOnucPpeKIHWxxoebFX0DXIDnuFaTzcI1+R1oqGA9TwC61V6jCdrdiZW5our6pZjmdS16c2m4gCy1Dw==");
    console.log("Doctor registered:");

    await Ordo.registerUser("0x147ea91C4E150ba3F5dF7607C7771ACB8741e3AD", 2, pharmacistData);
    console.log("Pharmacist registered:");

    await Ordo.registerUser("0x63522F008590179d35E1F8aBE9A78b407e666667", 3, "U2FsdGVkX1+93ZtHpgDdClTYHyPofckvknU9X/okZt9PKNzd3Ksz1RxOW5mydJUPVi7FwnEomczMAd+YiHkKcXof/OznfLITaTHYoJdn0/1ApQDNGrTHM8of5jNt25G9QfQtUl48HPyFa/CccicClQ==");
    console.log("Patient registered:");

    // so Wallets
    await Ordo.registerUser("0x3D836C9149c26F3Cb2eCB084cc817fE0C877c191", 1, "U2FsdGVkX1+hHvdRua3sWPn21KlRJa+bdD4FI8vv/+UBigOfxvGZ/ddT1ggzGirh4rLOa2uXgPoVv9i5bExG4JI1pa+UDhXlK+oMbwGqZH9OC0yuV/cW2koQPod0t6Ka2RHoMy3UOkyfsPBj3/6iY+thYXuRaS6aHGL7wretSIzLMEOLNtjvh0u4Gcy67Dvh");
    console.log("Doctor registered:");

    await Ordo.registerUser("0xb79B525aC89965d8f164Ed0c670F7e38CBA37e65", 2, pharmacistData);
    console.log("Pharmacist registered:");

    await Ordo.registerUser("0xF4d15Ad565796d69FD3D4CB66F7A3508136ab63f", 3, "U2FsdGVkX1/XRY1yrWlbFJQ/HM+usOXeZuFVKLxRV64+vvVb4dUkl3hSglPxfLTtbh/77+yztzzNg7EHGr/NDxHh6HY8xJH3fw/qFtpTsXBHqoAGCEeR3DOlXfk4BlUFnqpBAA/3QgySjVIxISF0xZyq32IUt15gwCR4cyRVoEU=");
    console.log("Patient registered:");

    // remi wallets 
    await Ordo.registerUser("0xAF0C644cFb9dE8fbe763Ba798b369ecCf0e39F17", 1, "U2FsdGVkX18eI70906WYOYQG/iPN+lqj4V9SVRhagie/eU9V5v8dU31hRN9HiFez+3EIflRJJU/I6glVHnldI44abFtmIAIGLN6IFEr0Hl0cqilBgaHxnfiHSNB4+s+Zchp/UfiEP0Unw4fuK+QL/ioyyj2pWJ9/zY5gIpe0d5DfWPDaiDPHzWv5egBRBkAWdDD8PxY2XlkkTZADC6AUdg==");
    console.log("Doctor registered:");

    await Ordo.registerUser("0xa7c2f85cCB78Df84a664D638a3b14275Db51ab32", 2, pharmacistData);
    console.log("Pharmacist registered:");

    await Ordo.registerUser("0x6CD9DF341B8Ca50e40605948Dd6aC8c880642670", 3, "U2FsdGVkX19R3NObtOmL5wyrATRKmlGzkvhgzWv4T4Ms32I0HPdXHK9BF/xiesiz5NXXjCr20ZQtKXnwVUqqvUchKr9Vvne3jnw2RY4lKt/mvUbuD31Y+pOaEf8j4afx7b6zN1/9HFGbQ+u7/XgD9g//FSa61RtDkMSQhLn83YU=");
    console.log("Patient registered:");
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
