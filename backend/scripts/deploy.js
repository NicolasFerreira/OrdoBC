const hre = require("hardhat");
const networkName = hre.network.name;

async function main() {
  // Get the contract to deploy
  const Ordo = await hre.ethers.deployContract("Ordo");
  await Ordo.waitForDeployment();
  console.log("Ordo deployed to:", Ordo.target);

  if (networkName === "localhost") {
    // Define test addresses (replace these with actual addresses for real deployment)
    const [owner, doctor, pharmacist, patient, patient2, doctor2] = await ethers.getSigners();


    await Ordo.registerUser(doctor.address, 1, "U2FsdGVkX18/oaPf6eggDoTB37NUkSeMCPePb+tw7Y0GM9i9A94LfVzSEU4k2Z4UgQD1b6V/Dqb4Y9KnA9y4ePxojxweOTqxBpmgNRaD17ASwyJ9DWGACnmQgfFfhh4HUA5NPsgIRkQCw13reQOMJhX6oFOTMSkYtQ6OVlaSTm0cljgsh+LWvSHx9LOzM/be4i0T4tqc2UjeQ6tZPyBtPA==");
    console.log("Doctor registered:", doctor.address);

    await Ordo.registerUser(pharmacist.address, 2, "U2FsdGVkX1+osHqlAij+lUv3hDfwLn00k/ZQjzyWg0zhxIvUDVvWOENQDE3mew2HQXif7kL+C1dSl+tvulVZBKGj2kEVvEJm5dTPJo+L3NX6lj0ab90VldcSYo/6Vr1YugQIwwWqL+pHfmOrrSHOgvMcaTj0KzLDtuuk3rcraABRx2DSYjoJ7PDyptLzYF0j");
    console.log("Pharmacist registered:", pharmacist.address);

    await Ordo.registerUser(patient.address, 3, "U2FsdGVkX18zDYttURT9/yIuQMuXv/VdW5nPsXgfg3j0BpyzneJfhYlLhL/RvoQ/QIgrdKB5gF7nrw2Y93ubeA7ymhfdaPKf6yzqnSMI18ouqzMRoqvDaAxQuZlBPaZAkpQPDGz26cLbUOJMFIO4zA==");
    console.log("Patient registered:", patient.address);

    await Ordo.registerUser(doctor2.address, 1, "U2FsdGVkX1/DC+gVuBR2Jdw4Q8XVLSmcnwSYwnvnWwV4hO9+ZQsg6m9+4D2BcRXm4C9Rxakj8xYf1BU4n53cuwetebaJUKtwHeE8sonL4Bw4imCtHrSUazhOZWNV/OpLxM7Wg0VGOnucPpeKIHWxxoebFX0DXIDnuFaTzcI1+R1oqGA9TwC61V6jCdrdiZW5our6pZjmdS16c2m4gCy1Dw==");
    console.log("Doctor registered:", doctor2.address);

    await Ordo.registerUser(patient2.address, 3, "U2FsdGVkX1+93ZtHpgDdClTYHyPofckvknU9X/okZt9PKNzd3Ksz1RxOW5mydJUPVi7FwnEomczMAd+YiHkKcXof/OznfLITaTHYoJdn0/1ApQDNGrTHM8of5jNt25G9QfQtUl48HPyFa/CccicClQ==");
    console.log("Patient registered:", patient2.address);

    // try {
    //   await Ordo.connect(doctor).mintPrescription(patient.address, prescriptionData);
    //   console.log("Prescription minted : ", prescriptionData);
    // } catch (error) {
    //   console.log("Error: Prescription minted");
    // }

  }

  if (networkName === "base-sepolia") {

    const users = [
      { address: "0x520Aae94Da19a41eb6feD3994b6421b0e33bA83c", role: 1, data: "U2FsdGVkX18/oaPf6eggDoTB37NUkSeMCPePb+tw7Y0GM9i9A94LfVzSEU4k2Z4UgQD1b6V/Dqb4Y9KnA9y4ePxojxweOTqxBpmgNRaD17ASwyJ9DWGACnmQgfFfhh4HUA5NPsgIRkQCw13reQOMJhX6oFOTMSkYtQ6OVlaSTm0cljgsh+LWvSHx9LOzM/be4i0T4tqc2UjeQ6tZPyBtPA==", message: "Doctor registered:" },
      { address: "0x6209fa9edbcb606adb55B29Af7208EB56920B404", role: 2, data: "U2FsdGVkX1+osHqlAij+lUv3hDfwLn00k/ZQjzyWg0zhxIvUDVvWOENQDE3mew2HQXif7kL+C1dSl+tvulVZBKGj2kEVvEJm5dTPJo+L3NX6lj0ab90VldcSYo/6Vr1YugQIwwWqL+pHfmOrrSHOgvMcaTj0KzLDtuuk3rcraABRx2DSYjoJ7PDyptLzYF0j", message: "Pharmacist registered:" },
      { address: "0xf7ccd5DaB1059204304146AF1f7DDC87B93545Ba", role: 3, data: "U2FsdGVkX18zDYttURT9/yIuQMuXv/VdW5nPsXgfg3j0BpyzneJfhYlLhL/RvoQ/QIgrdKB5gF7nrw2Y93ubeA7ymhfdaPKf6yzqnSMI18ouqzMRoqvDaAxQuZlBPaZAkpQPDGz26cLbUOJMFIO4zA==", message: "Patient registered:" },
      { address: "0x9B123a0C4Be8a658593Ca17E101FC126B0a9D867", role: 1, data: "U2FsdGVkX1/DC+gVuBR2Jdw4Q8XVLSmcnwSYwnvnWwV4hO9+ZQsg6m9+4D2BcRXm4C9Rxakj8xYf1BU4n53cuwetebaJUKtwHeE8sonL4Bw4imCtHrSUazhOZWNV/OpLxM7Wg0VGOnucPpeKIHWxxoebFX0DXIDnuFaTzcI1+R1oqGA9TwC61V6jCdrdiZW5our6pZjmdS16c2m4gCy1Dw==", message: "Doctor registered:" },
      { address: "0x147ea91C4E150ba3F5dF7607C7771ACB8741e3AD", role: 2, data: "U2FsdGVkX1+OUJ2r7obVUhT+eErsxCgyke/fapP0XHPs+Yi7iwa0+ok/qjsEACdTWJ20WQ3rdCCtEIzK5tOnpD5P/fZmP/FkPLq+3OA3DzuL/OlwsI9xR9t74q+4WqPzGJF0z2TnVdQFRjunuOsQRx4TT1/pwsbBbHgy/r7m30k=", message: "Pharmacist registered:" },
      { address: "0x63522F008590179d35E1F8aBE9A78b407e666667", role: 3, data: "U2FsdGVkX1+93ZtHpgDdClTYHyPofckvknU9X/okZt9PKNzd3Ksz1RxOW5mydJUPVi7FwnEomczMAd+YiHkKcXof/OznfLITaTHYoJdn0/1ApQDNGrTHM8of5jNt25G9QfQtUl48HPyFa/CccicClQ==", message: "Patient registered:" },
      { address: "0x3D836C9149c26F3Cb2eCB084cc817fE0C877c191", role: 1, data: "U2FsdGVkX1+hHvdRua3sWPn21KlRJa+bdD4FI8vv/+UBigOfxvGZ/ddT1ggzGirh4rLOa2uXgPoVv9i5bExG4JI1pa+UDhXlK+oMbwGqZH9OC0yuV/cW2koQPod0t6Ka2RHoMy3UOkyfsPBj3/6iY+thYXuRaS6aHGL7wretSIzLMEOLNtjvh0u4Gcy67Dvh", message: "Doctor registered:" },
      { address: "0xb79B525aC89965d8f164Ed0c670F7e38CBA37e65", role: 2, data: "U2FsdGVkX1/2GOGnwxN3auFA6AFsNEFdQRQ4HeZR92MSFBA3IS9EfXkxCJvmtxj6RYdApL4dJK9f8WftbAX4x/UfngepKG7E5PuhHAtCCUsiZCSlEF+eXLh5Qi8L1B/bY0Kf40YNhZkOQHXKTfKNctb48KzhEUchLEhxJwMLlFc=", message: "Pharmacist registered:" },
      { address: "0xF4d15Ad565796d69FD3D4CB66F7A3508136ab63f", role: 3, data: "U2FsdGVkX1/XRY1yrWlbFJQ/HM+usOXeZuFVKLxRV64+vvVb4dUkl3hSglPxfLTtbh/77+yztzzNg7EHGr/NDxHh6HY8xJH3fw/qFtpTsXBHqoAGCEeR3DOlXfk4BlUFnqpBAA/3QgySjVIxISF0xZyq32IUt15gwCR4cyRVoEU=", message: "Patient registered:" },
      { address: "0xAF0C644cFb9dE8fbe763Ba798b369ecCf0e39F17", role: 1, data: "U2FsdGVkX18eI70906WYOYQG/iPN+lqj4V9SVRhagie/eU9V5v8dU31hRN9HiFez+3EIflRJJU/I6glVHnldI44abFtmIAIGLN6IFEr0Hl0cqilBgaHxnfiHSNB4+s+Zchp/UfiEP0Unw4fuK+QL/ioyyj2pWJ9/zY5gIpe0d5DfWPDaiDPHzWv5egBRBkAWdDD8PxY2XlkkTZADC6AUdg==", message: "Doctor registered:" },
      { address: "0xa7c2f85cCB78Df84a664D638a3b14275Db51ab32", role: 2, data: "U2FsdGVkX1/wUedPT/YTxaLnsFtaYJfXR8YRuA6H4cIATEQcnd8bsAA5K6UZCbNbSPBjqXuG9RGC+kqeoYxCw2LbZw+CDzipMC6tNHDaUjT3n9fxk8mLAdacrZkiWnbEbGv2a+iwF79iPcT7o9X+liP2A4FhowEotvObK1oXTWu/WLNlAr19oq4dXHmf40RQ", message: "Pharmacist registered:" },
      { address: "0x6CD9DF341B8Ca50e40605948Dd6aC8c880642670", role: 3, data: "U2FsdGVkX19R3NObtOmL5wyrATRKmlGzkvhgzWv4T4Ms32I0HPdXHK9BF/xiesiz5NXXjCr20ZQtKXnwVUqqvUchKr9Vvne3jnw2RY4lKt/mvUbuD31Y+pOaEf8j4afx7b6zN1/9HFGbQ+u7/XgD9g//FSa61RtDkMSQhLn83YU=", message: "Patient registered:" }
    ];

    async function registerUsers(users) {
      for (const user of users) {
        await Ordo.registerUser(user.address, user.role, user.data);
        console.log(user.message, user.address);
      }
    }

    await registerUsers(users);
    console.log("All users registered successfully!");
  }
}


main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
