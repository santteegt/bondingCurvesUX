/* global artifacts, assert, contract, describe, it */
/* eslint-disable no-console, max-len */
/* This testing demos the buy and sell of drops according to bonding curve */

const Token = artifacts.require('Token.sol')
const BondingCurve = artifacts.require('BondingCurve.sol')

contract('BondingCurve', (accounts) => {
    describe('Test User stories', () => {
        it('Should query the price of drops at different supply', async () => {
            const token = await Token.deployed()
            const bonding = await BondingCurve.deployed()
            console.log('BondingCurve contract address', bonding.address)

            await bonding.requestTokens(web3.utils.toWei('10000', 'ether'), { from: accounts[0] })
            await token.approve(bonding.address, web3.utils.toWei('10000', 'ether'), { from: accounts[0] })

            let i
            let supply
            let receipt
            const drops_supply_range = 10000
            for (i = 0; i < 100000; i++) {
                receipt = await bonding.buyDrops(web3.utils.toWei('50', 'ether'), { from: accounts[0] })
                supply = await bonding.dropsSupply({ from: accounts[0] })
                console.log( '[' + i + '] drops supply :=' + supply.toNumber() + ' with price :=' + web3.utils.fromWei(receipt.logs[0].args._price, 'ether') + ' Ocean token per drop')
                if ( supply > drops_supply_range){
                  break;
                }
            }

            const drops = await bonding.dropsBalance({ from: accounts[0] })
            await bonding.sellDrops(drops.valueOf(), { from: accounts[0] })
        })

        it('Should walk through typical user story', async () => {
            // const marketPlace = await Market.deployed();
            const token = await Token.deployed()
            const bonding = await BondingCurve.deployed()

            await bonding.requestTokens(web3.utils.toWei('2000', 'ether'), { from: accounts[0] })
            const bal1 = await token.balanceOf.call(accounts[0])
            console.log(`User has ${web3.utils.fromWei(bal1, 'ether')} tokens now.`)

            const ntokens = web3.utils.toWei('10', 'ether')
            await token.approve(bonding.address, web3.utils.toWei('2000', 'ether'), { from: accounts[0] })

            let tx = await bonding.buyDrops(ntokens, { from: accounts[0] })
            console.log('user[0] buy drops at effective price :=' + web3.utils.fromWei(tx.logs[0].args._price, 'ether') + ' token per drop')
            const bal2 = await token.balanceOf.call(accounts[0])
            console.log(`provider has balance of Tokens := ${web3.utils.fromWei(bal2, 'ether')}`)
            const drops1 = await bonding.dropsBalance({ from: accounts[0] })
            console.log(`User [0] should have ${drops1.toNumber()} drops now.`)


            await bonding.requestTokens(web3.utils.toWei('2000', 'ether'), { from: accounts[1] })
            await token.approve(bonding.address, ntokens, { from: accounts[1] })
            tx = await bonding.buyDrops(ntokens, { from: accounts[1] })
            console.log('user[1] buy drops at effective price :=' + web3.utils.fromWei(tx.logs[0].args._price, 'ether') + ' token per drop')
            const drops2 = await bonding.dropsBalance({ from: accounts[1] })
            console.log(`User [1] should have ${drops2.toNumber()} drops now.`)

            tx = await bonding.sellDrops(drops1.valueOf(), { from: accounts[0] })
            console.log('user[0] sell drops at effective price :=' + web3.utils.fromWei(tx.logs[0].args._price, 'ether') + ' token per drop')
            await bonding.withdraw({ from: accounts[0] })
            const tokenBalance1 = await token.balanceOf.call(accounts[0])
            console.log(`user[0] balance of tokens := ${web3.utils.fromWei(tokenBalance1, 'ether')} (5 tokens as profit)`)
        })
    })
})
