// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Custom errors
    error NotDoctor();
    error Unauthorized();
    error UserAlreadyRegistered();
    error UserNotRegistered();
    error NotRegistred();
    error GetPrescriptionUnauthorized();
    error NotPharmacist();

contract Ordo is ERC721, Ownable {
    uint256 private _tokenIdCounter;

    // Mapping to store users
    mapping(address => User) public users;

    // Enum to define user roles
    enum Roles {
        Unknown,
        Doctor,
        Pharmacist,
        Patient
    }

    // Struct to define user data
    struct User {
        Roles role;
        bytes encryptedDatas;
    }

    // Struct to define prescription data
    struct Prescription {
        address doctor;
        address patient;
        bytes encryptedDetails;
        bool treated;
    }

    // Mapping to store prescriptions
    mapping(uint256 => Prescription) private _prescriptions;

    constructor() ERC721("Ordo", "ORDO") Ownable(msg.sender) {}

    // Modifier to restrict function access to doctors only
    modifier onlyDoctor() {
        if (users[msg.sender].role != Roles.Doctor) {
            revert NotDoctor();
        }
        _;
    }

    modifier onlyRegistred(){
         if (users[msg.sender].role == Roles.Unknown) {
            revert NotRegistred();
        }
        _;
    }

    modifier onlyPharmacist() {
         if (users[msg.sender].role != Roles.Pharmacist) {
            revert NotPharmacist();
        }
        _;
    }

    // Function to register a new user
    function registerUser(address _userAddress, Roles _role, bytes memory _encryptedDatas) external onlyOwner {
        if (users[_userAddress].role != Roles.Unknown) {
            revert UserAlreadyRegistered();
        }
        users[_userAddress] = User({
            role: _role,
            encryptedDatas: _encryptedDatas
        });
    }

    // Function to mint a new NFT
    function mintPrescription(address _to, bytes memory _encryptedDetails) external onlyDoctor {
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;
        _mint(_to, tokenId);

        // Store prescription details
        _prescriptions[tokenId] = Prescription({
            doctor: msg.sender,
            patient: _to,
            encryptedDetails: _encryptedDetails,
            treated: false
        });
    }

    // Function to get prescription details
    function getPrescription(uint256 _tokenId) external onlyRegistred view returns (address, address, bytes memory, bool) {
        Prescription memory prescription = _prescriptions[_tokenId];
        if (users[msg.sender].role == Roles.Patient && msg.sender != prescription.patient) {
            revert GetPrescriptionUnauthorized();
        }
        return (
            prescription.doctor,
            prescription.patient,
            prescription.encryptedDetails,
            prescription.treated
        );
    }

    // Function to mark a prescription as treated
    function markAsTreated(uint256 _tokenId) external onlyPharmacist {
        Prescription storage prescription = _prescriptions[_tokenId];
        if (msg.sender != prescription.doctor) {
            revert Unauthorized();
        }
        prescription.treated = true;
    }

    // Function to set base URI for the NFTs
    function _baseURI() internal pure override returns (string memory) {
        return "https://api.example.com/metadata/";
    }
}
