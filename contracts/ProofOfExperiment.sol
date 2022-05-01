//SPDX-License-Identifier: MIT
pragma solidity  >=0.6.0 <0.9.0;

contract ProofOfExperiment {

    event ProofCreated(uint256 indexed experimentId, bytes32 experimentProof);
    event ProofValidated(uint256 indexed experimentId, bytes32 experimentProof);

    address public owner;
    mapping(uint256 => bytes32) proofsById;
    mapping(address => uint256) reputationByAddress;  //care -- 256 overflow
    mapping(address => uint256) tokenBalanceByAddress;  //care -- 256 overflow

    modifier onlyOwner() {
        require( msg.sender == owner, "Only owner is allowed to access this function." );
        _;
    }

    modifier noProofExistsYet(uint256 experimentId) {
        require(proofsById[experimentId] == "", "A proof already exists for this experiment.");
        _;
    }

    modifier proofAlreadyExists(uint256 experimentId) {
        require(proofsById[experimentId] != "", "No proof exists for this experiment.");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function storeProof(uint256 experimentId, bytes32 experimentProof) public noProofExistsYet(experimentId)
    {
        proofsById[experimentId] = experimentProof;
        emit ProofCreated(experimentId, experimentProof);
    }

    function isProofValid(uint256 experimentId, bytes32 experimentProof) private view returns (bool)
    {
        return proofsById[experimentId] == experimentProof;
    }

    function verifyProofIsValid(uint _experimentId, bytes32 _experimentProof) public proofAlreadyExists(_experimentId) returns (bool)
    {
        // we know that a proof already exists, now we need to validate that the one supplied is the correct one
        if(isProofValid(_experimentId, _experimentProof)) {
            // if rep < 5 then rep ++ and return
            if(reputationByAddress[msg.sender] < 5) {
       x         reputationByAddress[msg.sender]++;
                emit ProofValidated(_experimentId, _experimentProof);
                return true;
            }
            else {
                reputationByAddress[msg.sender]++;
                //mint Fleming Token rewards.
                tokenBalanceByAddress[msg.sender] += 1000;
                emit ProofValidated(_experimentId, _experimentProof);
                return true;
            }
        }
        else {
            return false;
        }
    }

    function setReputationByAddress(uint256 _rep, address _address) onlyOwner public {
        reputationByAddress[_address] = _rep;
    }

    function getReputationByAddress(address _address) public view returns (uint256) {
        return reputationByAddress[_address];
    }

    function getTokenBalanceByAddress(address _address) public view returns (uint256) {
        return tokenBalanceByAddress[_address];
    }

    /* // check if a document has been notarized
     function checkDocument(bytes32 document) view public returns (bool) {
         bytes32 proof = proofFor(document);
         return hasProof(proof);
     }

     // helper function to get a document's sha256
     function proofFor(bytes32 document) view public returns (bytes32) {
         return sha256(abi.encode(document));
     }

     // returns true if proof is stored
     function hasProof(bytes32 proof) view public returns(bool) {
         //TypeError: Type bytes memory is not implicitly convertible to expected type uint256.
         return hashesById[abi.encode(proof)];
     }*/

}