// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

/**
 * Request testnet LINK and ETH here: https://faucets.chain.link/
 * Find information on LINK Token Contracts and get the latest ETH and LINK faucets here: https://docs.chain.link/docs/link-token-contracts/
 */

contract TrialsAPIConsumer is ChainlinkClient {
    using Chainlink for Chainlink.Request;

    uint256 public numTrials;
    string public studyFields;
    string public testString = "a string";
    string public testBytes = string(testString);

    address private oracle;
    bytes32 private jobId;
    uint256 private fee;

    /**
     * Network: Kovan
     * Oracle: 0xc57B33452b4F7BB189bB5AfaE9cc4aBa1f7a4FD8 (Chainlink Devrel Node)
     * Job ID: d5270d1c311941d0b08bead21fea7747
     * Fee: 0.1 LINK
     */
    constructor() {
        setPublicChainlinkToken();
        oracle = 0xc57B33452b4F7BB189bB5AfaE9cc4aBa1f7a4FD8;
        jobId = "d5270d1c311941d0b08bead21fea7747";
        fee = 0.1 * 10 ** 18; // (Varies by network and job)
    }

    /**
     * Create a Chainlink request to retrieve API response, find the target
     * data, then multiply by 1000000000000000000 (to remove decimal places from data).
     */
    function requestNumTrials() public returns (bytes32 requestId)
    {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);

        // Set the URL to perform the GET request on
        request.add("get", "https://clinicaltrials.gov/api/query/study_fields?expr=asthma&fields=PrimaryOutcomeMeasure&min_rnk=2&max_rnk=2&fmt=json");

        // Set the path to find the desired data in the API response
        request.add("path", "StudyFieldsResponse,NStudiesAvail"); // Chainlink nodes 1.0.0 and later support this format

        // Multiply the result by 1000000000000000000 to remove decimals
        int timesAmount = 10**18;
        request.addInt("times", timesAmount);

        // Sends the request
        return sendChainlinkRequestTo(oracle, request, fee);
    }

    function requestTrialData() public returns (bytes32 requestId)
    {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfillData.selector);

        // Set the URL to perform the GET request on
        request.add("get", "https://clinicaltrials.gov/api/query/study_fields?expr=asthma&fields=PrimaryOutcomeMeasure&min_rnk=2&max_rnk=2&fmt=json");

        // Set the path to find the desired data in the API response
        request.add("path", "StudyFieldsResponse,DataVrs"); // Chainlink nodes 1.0.0 and later support this format

        // Sends the request
        return sendChainlinkRequestTo(oracle, request, fee);
    }

    /**
     * Receive the response in the form of uint256
     */
    function fulfill(bytes32 _requestId, uint256 _numTrials) public recordChainlinkFulfillment(_requestId)
    {
        numTrials = _numTrials;
    }

    /**
     * Receive the response in the form of string
     */
    function fulfillData(bytes32 _requestId, bytes32 _studyFields) public recordChainlinkFulfillment(_requestId)
    {
        studyFields = bytes32ToString(_studyFields);
    }

    function bytes32ToString(bytes32 _bytes32) public pure returns (string memory) {
        uint8 i = 0;
        while(i < 32 && _bytes32[i] != 0) {
            i++;
        }
        bytes memory bytesArray = new bytes(i);
        for (i = 0; i < 32 && _bytes32[i] != 0; i++) {
            bytesArray[i] = _bytes32[i];
        }
        return string(bytesArray);
    }


    // function withdrawLink() external {} - Implement a withdraw function to avoid locking your LINK in the contract
}

