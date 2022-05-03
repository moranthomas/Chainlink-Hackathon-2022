var ProofOfExperiment = artifacts.require("./ProofOfExperiment.sol");
var FlemingToken = artifacts.require("./FlemingToken.sol");
var TrialsAPIConsumer = artifacts.require("./TrialsAPIConsumer.sol");

module.exports = function(deployer) {
  deployer.deploy(ProofOfExperiment);
  deployer.deploy(FlemingToken, 10000);
  deployer.deploy(TrialsAPIConsumer);
};
