/* global artifacts, assert, contract, describe, it */
/* eslint-disable no-console, max-len */
/* This testing demos the buy and sell of drops according to bonding curve */

const Token = artifacts.require('Token.sol')
const BondingCurve = artifacts.require('BondingCurve.sol')
const { BigNumber } = require("bignumber.js");

 const calculateSaleReturn = ({ totalSupply, poolBalance, reserveRatio, amount })  => {
    if (!totalSupply || !poolBalance || !reserveRatio || !amount) return 0;

    if (totalSupply === 0 || reserveRatio === 0 || poolBalance === 0 || amount === 0) return 0;
    if (amount === totalSupply) return poolBalance;
    if (reserveRatio === 1) return poolBalance;

    return poolBalance * (1 - (1 - (amount / totalSupply)) ** (1 / reserveRatio));
}

 const calculateBuyPrice = ({ totalSupply, poolBalance, reserveRatio, amount }) => {
    if (!totalSupply || !poolBalance || !reserveRatio || !amount) return 0;
    if (totalSupply === 0 || reserveRatio === 0 || poolBalance === 0 || amount === 0) return 0;

    return poolBalance * ((1 + (amount / totalSupply)) ** (1 / reserveRatio) - 1);
}

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

            for (i = 0; i < 1; i++) {
                console.log((await bonding.ndrops.call()).toNumber(), (await bonding.nOcean.call()).toNumber() / scale, (await bonding.reserveRatio.call()).toNumber(), 1 * (await bonding.scale.call()).toNumber());
                // _connectorBalance * (1 - (1 - _sellAmount / _supply) ^ (1 / (_connectorWeight / 1000000)))

                const _connectorBalance = new BigNumber(1);
                const _sellAmount = new BigNumber(1*scale);
                const _supply = new BigNumber(10);
                const _connectorWeight = new BigNumber(900000);

                const one = new BigNumber(1).minus(new BigNumber(1).minus(_sellAmount).div(_supply))
                const second = new BigNumber(1).div(_connectorWeight.div(new BigNumber(1000000)))

                const sell = new BigNumber(_connectorBalance.times(one).toNumber() ** second.toNumber()).times(scale)



                console.log("sell", sell.toNumber(), sell.div(_sellAmount).toNumber(), sell.div(_sellAmount).div(scale).toNumber())

                // _supply * ((1 + _depositAmount / _connectorBalance) ^ (_connectorWeight / 1000000) - 1)


                const buyone = new BigNumber(1).plus(1)/*_depositAmount*/.div(1)/*_connectorBalance*/;
                const buysecond = new BigNumber(900000).div(1000000)

                const buy = new BigNumber(10)/*supply*/.times(new BigNumber(Math.pow(buyone.toNumber(), buysecond.toNumber())).minus(new BigNumber(1)))

                console.log("buy", Math.floor(buy.toNumber()),new BigNumber(1).div(Math.floor(buy.toNumber())).toNumber())
                console.log("calculateBuyPrice",calculateBuyPrice({totalSupply:10,reserveRatio:.9,poolBalance:1,amount:1}))

                // var event = bonding.Debug({ fromBlock: 0, toBlock: 'latest' });

                // event.watch((error, result) => {
                //     if (!error)
                //         console.log(error)
                //     console.log("debug",result);
                // });

                var event = bonding.TokenBuyDrops({ fromBlock: 0, toBlock: 'latest' });

                event.watch((error, result) => {
                    if (!error)
                        console.log(error)
                    console.log("_ocn,_drops,_price",result.args._ocn.toNumber(),result.args._drops.toNumber(),result.args._price.toNumber());
                });




                receipt = await bonding.buyDrops(1 * scale, { from: accounts[0] })
                supply = await bonding.dropsSupply({ from: accounts[0] })

                console.log('[' + i + '] drops supply :=' + supply.toNumber() + ' with price :=' + receipt.logs[0].args._price.toNumber() / scale + ' Ocean token per drop')
                if (supply > drops_supply_range) {
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
            console.log(`User has ${bal1.toNumber() / scale} tokens now.`)

            const ntokens = 10 * scale
            await token.approve(bonding.address, 2000 * scale, { from: accounts[0] })

            let tx = await bonding.buyDrops(ntokens, { from: accounts[0] })
            console.log('user[0] buy drops at effective price :=' + tx.logs[0].args._price.toNumber() / scale + ' token per drop')
            const bal2 = await token.balanceOf.call(accounts[0])
            console.log(`provider has balance of Tokens := ${bal2.valueOf() / scale}`)
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
