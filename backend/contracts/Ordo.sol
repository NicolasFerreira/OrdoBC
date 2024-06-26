// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

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
    error AddressToMintIsNotPatient(address);

contract Ordo is ERC721, Ownable {
    uint256 private _tokenIdCounter;

    // Mapping to store users
    mapping(address => User) public users;

    // Enum to define user roles
    enum Roles {
        UNKNOWN,
        DOCTOR,
        PHARMACIST,
        PATIENT
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

    // Events
    event UserRegistered(address indexed user, Roles role);
    event PrescriptionMinted(uint256 indexed tokenId, address indexed doctor, address indexed patient);
    event PrescriptionTreated(uint256 indexed tokenId);

    constructor() ERC721("Ordo", "ORDO") Ownable(msg.sender) {}

    // Modifier to restrict function access to doctors only
    modifier onlyDoctor() {
        if (users[msg.sender].role != Roles.DOCTOR) {
            revert NotDoctor();
        }
        _;
    }

    modifier onlyRegistred(){
         if (users[msg.sender].role == Roles.UNKNOWN) {
            revert NotRegistred();
        }
        _;
    }

    modifier onlyPharmacist() {
         if (users[msg.sender].role != Roles.PHARMACIST) {
            revert NotPharmacist();
        }
        _;
    }

    modifier checkTokenExists(uint256 _tokenId) {
        _requireOwned(_tokenId);
        _;
    }

    // Function to register a new user
    function registerUser(address _userAddress, Roles _role, bytes memory _encryptedDatas) external onlyOwner {
        if (users[_userAddress].role != Roles.UNKNOWN) {
            revert UserAlreadyRegistered();
        }
        users[_userAddress] = User({
            role: _role,
            encryptedDatas: _encryptedDatas
        });
        emit UserRegistered(_userAddress, _role);
    }

    // Function to mint a new NFT
    function mintPrescription(address _to, bytes memory _encryptedDetails) external onlyDoctor {
        if((getRoles(_to) != Roles.PATIENT)){
            revert AddressToMintIsNotPatient(_to);
        }
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;
        // Store prescription details
        _prescriptions[tokenId] = Prescription({
            doctor: msg.sender,
            patient: _to,
            encryptedDetails: _encryptedDetails,
            treated: false
        });

        _safeMint(_to, tokenId);
        emit PrescriptionMinted(tokenId, msg.sender, _to);
    }

    // Function to get prescription details
    function getPrescription(uint256 _tokenId) external onlyRegistred checkTokenExists(_tokenId) view returns (address, address, bytes memory, bool) {
        Prescription memory prescription = _prescriptions[_tokenId];
        if (users[msg.sender].role == Roles.PATIENT && msg.sender != prescription.patient) {
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
    function markAsTreated(uint256 _tokenId) external onlyPharmacist checkTokenExists(_tokenId) {
        Prescription storage prescription = _prescriptions[_tokenId];
        if (msg.sender != prescription.doctor) {
            revert Unauthorized();
        }
        prescription.treated = true;
        emit PrescriptionTreated(_tokenId);
    }

    // Function to set base URI for the NFTs
    function _baseURI() internal pure override returns (string memory) {
        return "https://api.example.com/metadata/";
    }

    function getRoles(address _address) public view returns (Roles) {
        return users[_address].role;
    }
}
