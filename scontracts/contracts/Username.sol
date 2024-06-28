// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract UsernameNFT is ERC721 {
    // Mapping to store whether a username is already claimed or not
    mapping(string => bool) private _usernameExists;
    // Mapping to store owner of each username
    mapping(string => address) private _usernameToOwner;
    // Mapping from token ID to username
    mapping(uint256 => string) private _tokenToUsername;
    // Mapping from Ethereum address to Deso address
    mapping(address => string) private _ethToDesoAddress;
    // Mapping from Ethereum address to array of usernames
    mapping(address => string[]) private _ownerToUsernames;
    // Array to store Ethereum addresses that have a username
    address[] private _addressesWithUsername;

    constructor() ERC721("UsernameNFT", "UNFT") {}

    // Function to claim a username
    function claimUsername(string memory username) external {
        require(!_usernameExists[username], "Username already claimed");
        
        _usernameExists[username] = true;
        _usernameToOwner[username] = msg.sender;

        uint256 tokenId = uint256(keccak256(abi.encodePacked(username)));
        _tokenToUsername[tokenId] = username;

        _ownerToUsernames[msg.sender].push(username);

        // Add the Ethereum address to the array of addresses with a username
        _addressesWithUsername.push(msg.sender);

        _mint(msg.sender, tokenId);
    }

    // Function to check if a username exists
    function usernameExists(string memory username) external view returns (bool) {
        return _usernameExists[username];
    }

    // Function to get owner of a username
    function getUsernameOwner(string memory username) external view returns (address) {
        return _usernameToOwner[username];
    }

    // Function to set a Deso address for the caller's Ethereum address
    function setDesoAddress(string memory desoAddress) external {
        _ethToDesoAddress[msg.sender] = desoAddress;
    }

    // Function to get the Deso address linked to a username
    function getDesoAddress(string memory username) external view returns (string memory) {
        address owner = _usernameToOwner[username];
        require(owner != address(0), "Username not found");
        string memory desoAddress = _ethToDesoAddress[owner];
        require(bytes(desoAddress).length > 0, "Deso address not found");
        return desoAddress;
    }

    // Function to get the usernames for a given Ethereum address
    function getUsernames(address owner) external view returns (string[] memory) {
        return _ownerToUsernames[owner];
    }

    // Override the _transfer functions to update the username owner
    function transferFrom(address from, address to, uint256 tokenId) public virtual override {
        super.transferFrom(from, to, tokenId);
        
        string memory username = _tokenToUsername[tokenId];
        if (bytes(username).length > 0) {
            _usernameToOwner[username] = to;

            // Remove the username from the previous owner's list
            removeUsernameFromOwner(from, username);
            // Add the username to the new owner's list
            _ownerToUsernames[to].push(username);
        }
    }

    // Override the safeTransferFrom function to update the username owner
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory _data) public virtual override {
        super.safeTransferFrom(from, to, tokenId, _data);
        
        string memory username = _tokenToUsername[tokenId];
        if (bytes(username).length > 0) {
            _usernameToOwner[username] = to;

            // Remove the username from the previous owner's list
            removeUsernameFromOwner(from, username);
            // Add the username to the new owner's list
            _ownerToUsernames[to].push(username);
        }
    }

    // Helper function to remove a username from an owner's list
    function removeUsernameFromOwner(address owner, string memory username) private {
        uint256 length = _ownerToUsernames[owner].length;
        for (uint256 i = 0; i < length; i++) {
            if (keccak256(abi.encodePacked(_ownerToUsernames[owner][i])) == keccak256(abi.encodePacked(username))) {
                _ownerToUsernames[owner][i] = _ownerToUsernames[owner][length - 1];
                _ownerToUsernames[owner].pop();
                break;
            }
        }
    }

        // Function to get the Ethereum addresses that have a username
    function getAddressesWithUsername() external view returns (address[] memory) {
        return _addressesWithUsername;
    }
}