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
            const scale = 1e18

            await bonding.requestTokens(10000 * scale, { from: accounts[0] })
            await token.approve(bonding.address, 10000 * scale, { from: accounts[0] })

            let i
            let supply
            let receipt
            const drops_supply_range = 10000
            for (i = 0; i < 100000; i++) {
                receipt = await bonding.buyDrops(50 * scale, { from: accounts[0] })
                supply = await bonding.dropsSupply({ from: accounts[0] })
                console.log( '[' + i + '] drops supply :=' + supply.toNumber() + ' with price :=' + receipt.logs[0].args._price.toNumber() / scale + ' Ocean token per drop')
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
            const scale = 1e18

            await bonding.requestTokens(2000 * scale, { from: accounts[0] })
            const bal1 = await token.balanceOf.call(accounts[0])
            console.log(`User has ${bal1.toNumber() /scale} tokens now.`)

            const ntokens = 10 * scale
            await token.approve(bonding.address, 2000 * scale, { from: accounts[0] })

            let tx = await bonding.buyDrops(ntokens, { from: accounts[0] })
            console.log('user[0] buy drops at effective price :=' + tx.logs[0].args._price.toNumber() / scale + ' token per drop')
            const bal2 = await token.balanceOf.call(accounts[0])
            console.log(`provider has balance of Tokens := ${bal2.valueOf() / scale }`)
            const drops1 = await bonding.dropsBalance({ from: accounts[0] })
            console.log(`User [0] should have ${drops1.toNumber()} drops now.`)


            await bonding.requestTokens(2000 * scale, { from: accounts[1] })
            await token.approve(bonding.address, ntokens, { from: accounts[1] })
            tx = await bonding.buyDrops(ntokens, { from: accounts[1] })
            console.log('user[1] buy drops at effective price :=' + tx.logs[0].args._price.toNumber() / scale + ' token per drop')
            const drops2 = await bonding.dropsBalance({ from: accounts[1] })
            console.log(`User [1] should have ${drops2.toNumber()} drops now.`)

            tx = await bonding.sellDrops(drops1.valueOf(), { from: accounts[0] })
            console.log('user[0] sell drops at effective price :=' + tx.logs[0].args._price.toNumber() / scale + ' token per drop')
            await bonding.withdraw({ from: accounts[0] })
            const tokenBalance1 = await token.balanceOf.call(accounts[0])
            console.log(`user[0] balance of tokens := ${tokenBalance1.toNumber() / scale} (5 tokens as profit)`)
        })
    })
})
