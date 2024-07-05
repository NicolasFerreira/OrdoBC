// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Custom errors
error NotDoctor();
error UserAlreadyRegistered();
error UserNotRegistered();
error NotRegistred();
error GetPrescriptionUnauthorized();
error NotPharmacist();
error AddressToMintIsNotPatient(address);
error SoulboundTransferFailed();

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
        string encryptedDatas;
    }

    // Struct to define prescription data
    struct Prescription {
        address doctor;
        address patient;
        string encryptedDetails;
        bool treated;
        uint256 date_created;
    }

    // Mapping to store prescriptions
    mapping(uint256 => Prescription) private _prescriptions;

    // Events
    event UserRegistered(address indexed user, Roles role, string encryptedDatas);
    event PrescriptionMinted(uint256 indexed tokenId, address indexed doctor, address indexed patient, string encryptedDetails, uint256 date_created);
    event PrescriptionTreated(uint256 indexed tokenId);

    /**
     * @dev Constructor to initialize the contract with a name and symbol for the NFT.
     */
    constructor() ERC721("Ordo", "ORDO") Ownable(msg.sender) {}

    /**
     * @dev Modifier to restrict access to functions to only doctors.
     */
    modifier onlyDoctor() {
        if (users[msg.sender].role != Roles.DOCTOR) {
            revert NotDoctor();
        }
        _;
    }

    /**
     * @dev Modifier to restrict access to functions to only registered users.
     */
    modifier onlyRegistred() {
        if (users[msg.sender].role == Roles.UNKNOWN) {
            revert NotRegistred();
        }
        _;
    }

    /**
     * @dev Modifier to restrict access to functions to only pharmacists.
     */
    modifier onlyPharmacist() {
        if (users[msg.sender].role != Roles.PHARMACIST) {
            revert NotPharmacist();
        }
        _;
    }

    /**
     * @dev Modifier to check if a token exists.
     * @param _tokenId The ID of the token to check.
     */
    modifier checkTokenExists(uint256 _tokenId) {
        _requireOwned(_tokenId);
        _;
    }

    /**
     * @dev Registers a new user with a specified role and encrypted data.
     * @param _userAddress The address of the user to register.
     * @param _role The role of the user (DOCTOR, PHARMACIST, PATIENT).
     * @param _encryptedDatas The encrypted data of the user.
     * Emits a {UserRegistered} event.
     */
    function registerUser(address _userAddress, Roles _role, string memory _encryptedDatas) external onlyOwner {
        if (users[_userAddress].role != Roles.UNKNOWN) {
            revert UserAlreadyRegistered();
        }
        users[_userAddress] = User({
            role: _role,
            encryptedDatas: _encryptedDatas
        });
        emit UserRegistered(_userAddress, _role, _encryptedDatas);
    }

    /**
     * @dev Mints a new prescription NFT for a patient.
     * @param _to The address of the patient.
     * @param _encryptedDetails The encrypted details of the prescription.
     * Emits a {PrescriptionMinted} event.
     */
    function mintPrescription(address _to, string memory _encryptedDetails) external onlyDoctor {
        if(getRole(_to) != Roles.PATIENT){
            revert AddressToMintIsNotPatient(_to);
        }
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;
        // Store prescription details
        _prescriptions[tokenId] = Prescription({
            doctor: msg.sender,
            patient: _to,
            encryptedDetails: _encryptedDetails,
            treated: false,
            date_created: block.timestamp
        });

        _safeMint(_to, tokenId);
        
        emit PrescriptionMinted(tokenId, msg.sender, _to, _encryptedDetails, block.timestamp);
    }

    /**
     * @dev Retrieves the details of a prescription.
     * @param _tokenId The ID of the prescription token.
     * @return The details of the prescription.
     */
    function getPrescription(uint256 _tokenId) external onlyRegistred checkTokenExists(_tokenId) view returns (Prescription memory) {
        Prescription memory prescription = _prescriptions[_tokenId];
        if (users[msg.sender].role == Roles.PATIENT && msg.sender != prescription.patient) {
            revert GetPrescriptionUnauthorized();
        }
        return prescription;
    }

    /**
     * @dev Marks a prescription as treated.
     * @param _tokenId The ID of the prescription token.
     * Emits a {PrescriptionTreated} event.
     */
    function markAsTreated(uint256 _tokenId) external onlyPharmacist checkTokenExists(_tokenId) {
        Prescription storage prescription = _prescriptions[_tokenId];
        prescription.treated = true;
        emit PrescriptionTreated(_tokenId);
    }

    /**
     * @dev Sets the base URI for the NFTs.
     * @return The base URI as a string.
     */
    function _baseURI() internal pure override returns (string memory) {
        return "https://api.example.com/metadata/";
    }

    /**
     * @dev Retrieves the role of a specified address.
     * @param _address The address to check.
     * @return The role of the address.
     */
    function getRole(address _address) public view returns (Roles) {
        return users[_address].role;
    }

    /**
     * @dev Internal function to handle token transfers.
     * Restricts the transfer of Soulbound tokens.
     * @param to The address to transfer the token to.
     * @param tokenId The ID of the token to transfer.
     * @param auth The address that authorized the transfer.
     * @return The address of the new owner.
     */
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721)
        returns (address)
    {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) {
            revert SoulboundTransferFailed();
        }

        return super._update(to, tokenId, auth);
    }
}
