import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './layout/Navbar';
import Banner from './layout/Banner';
import './App.css';
import getWeb3 from "./getWeb3";
import ProofOfExperimentContract from "./artifacts/contracts/ProofOfExperiment.json";
import MetaMaskOnboarding from '@metamask/onboarding'
import { OnboardingButton } from './components/OnboardingButton';
//import map from "./artifacts/deployments/map.json";               // map gets created on brownie deploy

class App extends Component {

    state = {
        web3: null,
        accounts: '',
        displayAccount: '',
        networkId: '',
        chainId: '',
        contract: null,
        balanceInEth: '0',
        flemingTokenBalance: '0',
        reputationScore: '0',
        experimentContractInstance: ''
    };

    isMetaMaskInstalled = () => MetaMaskOnboarding.isMetaMaskInstalled()

    // TODO - Implement so change to reputation or token balance gets reflected in App/Navbar - functional components!
    componentDidUpdate = async(prevProps, prevState) => {
      if(prevState.reputationScore != this.state.reputationScore) {
        console.log("componentDidUpdate -> update UI when component receives new state or props. flemingTokenBalance = " +  this.state.flemingTokenBalance);
        await this.getContractReputation();
        // await this.getContractFlemingBalance();
      }
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



    componentDidMount = async () => {
      try {
          await this.loadBlockchainData();
          await this.loadContractsFromBlockchain();
          await this.getContractReputation();
          await this.getContractFlemingBalance();

        } catch (error) {
          // Catch any errors for any of the above operations.
          console.error('Failed to load web3, accounts, or contract. Check console for details.' + error);
        }
    };


    async setContractReputation (newReputation) {
            //event.preventDefault();
            //const experimentContractInstance = this.state.experimentContractInstance;
            //TODO - const reputation = await experimentContractInstance.methods.setReputationByAddress(newReputation, this.state.accounts[0]).call();
            const reputation = 5;
            console.log('setting reputation = ', reputation);
            this.setState({ reputationScore: reputation }, this.runExample);
    }

    async getContractReputation () {
        //event.preventDefault();
        const experimentContractInstance = this.state.experimentContractInstance;
        console.log('experimentContractInstance = ', experimentContractInstance);
        console.log('this.state.accounts[0] = ', this.state.accounts[0]);
        const reputation = await experimentContractInstance.methods.getReputationByAddress(this.state.accounts[0]).call();
        console.log('reputation = ', reputation);
        this.setState({ reputationScore: reputation }, this.runExample);
    }

    async getContractFlemingBalance () {
        //event.preventDefault();
        const experimentContractInstance = this.state.experimentContractInstance;
        const flemingTokenBalance = await experimentContractInstance.methods.getTokenBalanceByAddress(this.state.accounts[0]).call();
        console.log('flemingTokenBalance = ', flemingTokenBalance);
        this.setState({ flemingTokenBalance: flemingTokenBalance });
    }

    render() {

        return (
            <div>
                <Router>
                  <Navbar
                    userAccounts={this.state.accounts}
                    displayAccount={this.state.displayAccount}
                    web3={this.state.web3}
                    networkId={this.state.networkId}
                    chainId={this.state.chainId}
                    //pass blocksToExpiry and expiryBlock as props so that we can display it in the deposit page
                    expiryBlock={this.state.expiryBlock}
                    balanceInEth={this.state.balanceInEth}
                    balanceInUSDC={this.state.balanceInUSDC}
                    flemingTokenBalance={this.state.flemingTokenBalance}
                    reputationScore={this.state.reputationScore}
                    />

                    <OnboardingButton></OnboardingButton>

                  <Banner />
                </Router>
            </div>
        );
  }
}

export default App;
