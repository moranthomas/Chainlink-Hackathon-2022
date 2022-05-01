import React, { Component } from 'react'
import styled from "styled-components";
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faInfoCircle, faNetworkWired, faSync} from '@fortawesome/free-solid-svg-icons';
import getWeb3 from "../getWeb3";
import ProofOfExperimentContract from "../artifacts/contracts/ProofOfExperiment.json";

export class SubmitResearch extends Component {

    state = {
        chosenCurrency: '',
        web3: '',
        amountValue: '',
        selectedInputFile: '',
        displayWalletBalance: '',
        depositCurrencyValid: false,
        depositCurrencyDecimals: null,
        depositCurrencyAddress: null,
        proofHash: '',
        generateSuccessMessage: '',
        selectedInputFile: ''
    };

    uploadFiles = [
        { label: "TB-Trial-Research-1010.json", value: "Test-Result-2001.json" },
        { label: "TB-Trial-Research-1011.json", value: "Test-Result-2002.json" },
        { label: "TB-Trial-Research-1014.json", value: "Test-Result-2003.json" },
    ];

    componentDidMount = async () => {
        try {
            await this.loadBlockchainData();
            await this.loadContractsFromBlockchain();
        } catch (error) {
            console.error('Failed to load web3, accounts, or contract on Component Mount. Check console for details.' + error);
        }
    };

    componentDidUpdate() {
          // console.log("componentDidUpdate -> when the component receives new state or props. Need to Update the UI ");
    }

    //TODO - Move to common interface
    loadBlockchainData = async () => {

        const web3 = await getWeb3();                         // Get network provider and web3 instance.
        this.setState({ web3: web3 });

        const userAccounts = await web3.eth.getAccounts();    // Use web3 to get the user's accounts.
        const networkId = await web3.eth.net.getId();         // Get the contract instance.
        const chainId = await web3.eth.getChainId()
        const networkPort = await web3.eth.net

        console.log("networkPort: ", networkPort);
        console.log("networkId: ", networkId);
        console.log("chainId: ", chainId);
        console.log("User Accounts:" , userAccounts);

        // getEthBalance
        var balance = await web3.eth.getBalance(userAccounts[0]);
        const balanceInEth = web3.utils.fromWei(balance, 'ether');
        this.setState( { balanceInEth: balanceInEth.substring(0,8)});

        let displayAccount = userAccounts[0].substring(0,8);
        this.setState({ accounts: userAccounts });
        this.setState({ displayAccount: displayAccount });
        this.setState({ networkId: networkId });
        this.setState({ chainId: chainId });
    }

    //TODO - Move to common interface
    loadContractsFromBlockchain = async () => {
        const web3 = await this.state.web3;
        const deployedNetwork = ProofOfExperimentContract.networks[this.state.networkId];
        //console.log("ProofOfExperimentContract.abi = " , ProofOfExperimentContract.abi);
        //console.log("deployedNetwork.address = " , web3.utils.toChecksumAddress(deployedNetwork.address));
        const ExperimentContractInstance = new web3.eth.Contract(ProofOfExperimentContract.abi, web3.utils.toChecksumAddress(deployedNetwork.address));
        //console.log("ExperimentContractInstance:" , ExperimentContractInstance);

        // Set contract to the state, and  proceed to interact with contract methods.
        this.setState({ experimentContractInstance: ExperimentContractInstance});
    }

    handleChangeSelectResearchDropdown = async(event) => {
        event.preventDefault();
        let inputFile = event.target.value;
        this.setState({
            proofHash: "" ,
            generateSuccessMessage : "",
            selectedInputFile: inputFile
        });
        console.log('selected input file = ' +  inputFile);
    }

    handleCheckFile = async(event) => {
        event.preventDefault();
        const file  = event.target.value;
        console.log(file + " Successfully checked for valid formatting...... ");
        //this.setState({ selectedInputFile: file});
    }


    handleGenerateProof = async(event) => {
        event.preventDefault();
        const proofHash = "0xcb371be217faa47dab94e0d0ff0840c6cbf41645f0dc1a6ae3f34447155a76f3";
        const proofHashDisplayed = "Proof Hash: 0xcb371be217faa47da..."
        this.setState({ proofHashDisplayed: proofHashDisplayed, proofHash: proofHash , generateSuccessMessage : "Successfully Generated" });
    }

    handleSubmitResearch = async(event) => {

        event.preventDefault();
        const deployedNetwork = ProofOfExperimentContract.networks[this.props.networkId];
        //console.log("ProofOfExperimentContract.abi = " , ProofOfExperimentContract.abi);
        //console.log("deployedNetwork.address = " , this.props.web3.utils.toChecksumAddress(deployedNetwork.address));
        const ExperimentContractInstance = new this.props.web3.eth.Contract(ProofOfExperimentContract.abi, this.props.web3.utils.toChecksumAddress(deployedNetwork.address));
        console.log("ExperimentContractInstance:" , ExperimentContractInstance);

       const nonce = await this.props.web3.eth.getTransactionCount(this.state.accounts[0]);
       //const gasPrice = this.state.web3.eth.gasPrice.toNumber();

        const rawTx = {
            "from": this.state.accounts[0],
            "nonce": nonce,
            "gas": 210000,  // == gasLimit (optional)
            // "gasPrice": 4500000,  (optional)
            // "data": 'For testing' (optional)
        };

        // Always use arrow functions to avoid scoping and 'this' issues like having to use 'self'
        // TODO -- in general we should probably use .transfer() over .send() method
        const proofHashHardCoded = "0xcb371be217faa47dab94e0d0ff0840c6cbf41645f0dc1a6ae3f34447155a76f3"
        const verifyProof = await ExperimentContractInstance.methods.verifyProofIsValid(101, proofHashHardCoded).send(rawTx);

        console.log('verifyProof = ', verifyProof);
        await this.getContractReputation();

    }

    async getContractReputation () {
        const experimentContractInstance = this.state.experimentContractInstance;
        console.log('experimentContractInstance = ', experimentContractInstance);
        console.log('this.state.accounts[0] = ', this.props.accounts[0]);
        const reputation = await experimentContractInstance.methods.getReputationByAddress(this.props.accounts[0]).call();
        console.log('reputation = ', reputation);
        this.setState({ reputationScore: reputation }, this.runExample);
    }


    render() {
        const Select = styled.select`
            width: 130%;
            height: 35px;
            background: white;
            color: gray;
            padding-left: 5px;
            font-size: 14px;
            border: none;
            margin-left: 10px;

        option {
            color: black;
            background: white;
            display: flex;
            white-space: pre;
            min-height: 20px;
            padding: 0px 2px 1px;
        }
        `;


        return (
            <div className="container-borrow">
            <form onSubmit={this.handleSubmit}>
                {/*<FontAwesomeIcon icon={faSync} size="2x" spin />*/}
                <div className="wrapper">
                    <div className="box a">
                            <Select value={this.state.selectedInputFile} onChange={this.handleChangeSelectResearchDropdown}>
                                <option value="" hidden> Select Research </option>
                                {this.uploadFiles.map((item) => <option key={item.label} value={item.label}>{item.label}</option>)}
                            </Select>
                    </div>
                    <div className="box b">
                        <button id="CheckFile" className="check-file-button" onClick={this.handleCheckFile.bind(this)}> Check File </button>
                    </div>
                    <div className="box c">
                        <button id="GenerateProof" className="check-file-button" onClick={this.handleGenerateProof.bind(this)}> Generate Proof </button>
                    </div>
                     <div className="box c">
                        <p style={{color: "gold"}}>
                            {this.state.generateSuccessMessage}
                            <br/>
                        </p>
                    </div>
                </div>

                <div className="box c">
                    {this.state.proofHashDisplayed}
                </div>
                <div>
                    <button id="SubmitResearch" className="implied-rate-box" onClick={this.handleSubmitResearch.bind(this)}> Submit Research For Validation </button>
                </div>
                </form>
            </div>
        )
    }
}
export default SubmitResearch
