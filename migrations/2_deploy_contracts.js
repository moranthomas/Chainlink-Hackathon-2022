var ProofOfExperiment = artifacts.require("./ProofOfExperiment.sol");

module.exports = function(deployer) {
  deployer.deploy(ProofOfExperiment);
};
