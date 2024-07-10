


import AES from 'crypto-js/aes';
import CryptoJS from 'crypto-js';

const privateKey = process.env.ENCRYPTION_KEY; 

export const encrypt = (dataToEncrypt) => {
    console.log("to encrypt", dataToEncrypt, privateKey)
    try {
        const encryptedData = AES.encrypt(JSON.stringify(dataToEncrypt), privateKey).toString();
        console.log(encryptedData)
        return encryptedData;
    } catch (error) {
        console.log(error)
    }
    
};

export const decrypt  = (encryptedData) => {  // Affiche la donnée encryptée dans la console pour vérification
    try {
        const decryptedData = JSON.parse(CryptoJS.AES.decrypt(encryptedData, privateKey).toString(CryptoJS.enc.Utf8));
        console.log("Données décryptées :", decryptedData);
        return decryptedData;
    } catch (error) {
        console.log(error)
    }
    
};

