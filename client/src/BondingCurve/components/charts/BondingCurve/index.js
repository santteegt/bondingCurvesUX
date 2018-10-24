import { BigNumber as BN } from "bignumber.js";
import numeral from "numeral";
import PropTypes from "prop-types";
import React from "react";
import { calculateBuyPrice } from "../../../../utils/bondingcurveCalculator";
import Footer from "../../Footer";
import Loader from "../../Loader";
import ReactVisBondingCurve from "./ReactVisBondingCurve";

export default class BondingCurveChart extends React.PureComponent {

    static propTypes = {
        bondingCurveContract: PropTypes.object.isRequired,
        web3: PropTypes.object.isRequired,
        height: PropTypes.number.isRequired
    }

    state = {
        params: {},
        loading: false,
        data: [],
        selectedItem: null,
        currentPrice: {
            value: 0,
            supply: 0
        },
    }

    async componentDidMount() {

        const { bondingCurveContract } = this.props;

        try {

            this.setState({ loading: true })

            const dropsSupply = BN(await bondingCurveContract.methods.dropsSupply().call());
            const scale = BN(await bondingCurveContract.methods.scale().call());
            const reserveRatio = BN(await bondingCurveContract.methods.reserveRatio().call()).div(1000000)
            const poolBalance = BN(await bondingCurveContract.methods.poolBalance().call()).div(scale);
            // eslint-disable-next-line
            const totalSupply = BN(await bondingCurveContract.methods.totalSupply().call());
            const ndrops = BN(await bondingCurveContract.methods.ndrops().call());
            const nOcean = BN(await bondingCurveContract.methods.nOcean().call()).div(scale);
            const ghostSupply = BN(await bondingCurveContract.methods.ghostSupply().call());

            console.log({
                dropsSupply: dropsSupply.toNumber(),
                reserveRatio: reserveRatio.toNumber(),
                poolBalance: poolBalance.toNumber(),
                scale: scale.toNumber(),
                totalSupply: totalSupply.toNumber(),
                ghostSupply: ghostSupply.toNumber(),
                nOcean: nOcean.toNumber(),
                ndrops: ndrops.toNumber(),
                price: poolBalance.div(totalSupply.times(reserveRatio)).toNumber()
            })

            const params = {
                dropsSupply,
                reserveRatio,
                poolBalance,
                scale,
                totalSupply,
                ghostSupply,
                nOcean,
                ndrops,
                price: poolBalance.div(totalSupply.times(reserveRatio)).toNumber()
            }

            const { data, currentPrice } = this.getChartData(params);

            this.setState({
                params,
                data,
                currentPrice,
                loading: false,
            })

        } catch (error) {
            this.setState({ error })
        }
    }

    getChartData({ totalSupply, reserveRatio, poolBalance, price: currentPrice }) {

         // TODO - remark - Not sure how much we should display

         /*
          * TODO - remark - Not sure if we need to display buy prices if supply < total supply like https://bondingcurves.relevant.community/
          * If so, we'll need to do something like this. The issue is that when doing this, we can't have a variable supply/pool balance to calculate the price.
          * When using a variable amount like relevant, the calculations didn't seem to be correct for me.
          * https://github.com/relevant-community/bonding-curve-component/blob/ceba574b9eb740715331e3124635b87b06c3790f/src/Chart.js#L31
          */


        const total = 100000;

        const step = Math.round(total / 100);
        const amount = BN(step);

        let _supply = BN(10);
        let _balance = BN(1)

        const data = [];

        for (let i = step; i < total * 1.5; i += step) {

            const [tokens, price] = calculateBuyPrice({
                totalSupply: _supply,
                amount,
                poolBalance: _balance,
                reserveRatio
            })

            _supply = _supply.plus(tokens);
            _balance = _balance.plus(amount);

            data.push({
                supply: _supply.toNumber(),
                sell: +price.toFixed(4),
                value: +price.toFixed(4)
            })

        }

        return { data, currentPrice: { supply: totalSupply, value: currentPrice } };
    }

    setDetail = (selectedItem) => {
        this.setState({ selectedItem })
    }

    render() {
        const { data, loading, selectedItem, currentPrice, error } = this.state;
        const { height } = this.props;

        if (error) throw error;

        return (
            <div>
                {
                    loading ? (
                        <Loader height={height} />
                    ) : (
                            <div style={{ minHeight: height }}>
                                <ReactVisBondingCurve
                                    data={data}
                                    onShowDetail={this.setDetail}
                                    height={200}
                                />
                            </div>
                        )
                }


                <Footer
                    symbol="OCN"
                    detail={{
                        title: `${selectedItem ? selectedItem.value : currentPrice.value.toFixed(4)}`,
                        sub: selectedItem ? `Supply: ${numeral(selectedItem.supply).format('0,0')}` : `Total supply: ${numeral(currentPrice.supply).format('0,0')}`
                    }}
                />
            </div>
        )
    }
}
