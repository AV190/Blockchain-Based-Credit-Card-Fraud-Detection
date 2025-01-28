const CreditCardFraudDetection = artifacts.require('CreditCardFraudDetection');

module.exports = function (deployer) {
    deployer.deploy(CreditCardFraudDetection);
};