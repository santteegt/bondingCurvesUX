/* global artifacts */
const Token = artifacts.require('Token.sol')
const BondingCurve = artifacts.require('BondingCurve.sol')

const oceanBC = async (deployer) => {
    const tokenAddress = Token.address

    await deployer.deploy(
        BondingCurve,
        tokenAddress
    )

}

module.exports = oceanBC
