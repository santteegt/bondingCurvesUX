import PropTypes from "prop-types";
import React, { Component } from "react";
import ReactVisBondingCurve from "./ReactVisBondingCurve";
import Loader from "../../Loader";
import { calculateSaleReturn, calculateBuyPrice } from "../../../../utils/bondingcurveCalculator";
import Footer from "../../Footer";
import numeral from "numeral";
import {BigNumber} from "bignumber.js";
export default class BondingCurveChart extends Component {

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

            const dropsSupply = +await bondingCurveContract.methods.dropsSupply().call();
            const reserveRatio = .2;
            const poolBalance = 4000000;
            const scale = +await bondingCurveContract.methods.scale().call();
            // eslint-disable-next-line
            const totalSupply = 1000000;
            const ndrops = +await bondingCurveContract.methods.ndrops().call();
            const nOcean = +await bondingCurveContract.methods.nOcean().call();
            const ghostSupply = +await bondingCurveContract.methods.ghostSupply().call();

            const params = {
                dropsSupply,
                reserveRatio,
                poolBalance,
                scale,
                totalSupply,
                ghostSupply,
                nOcean,
                ndrops,
                price: poolBalance / (totalSupply * reserveRatio)
            }

            this.setState({ loading: true })

            console.log(params)

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

    getChartData({ totalSupply, reserveRatio, poolBalance, price: currentPrice, scale }) {

        let data = [];
        let step = Math.round(totalSupply / 100);

        for (let i = step; i < totalSupply * 1.5; i += step) {
            if (i < totalSupply) {
                
                let eth = calculateSaleReturn({
                    totalSupply:10,
                    poolBalance,
                    reserveRatio,
                    amount: new BigNumber(totalSupply).minus(i).toString(10)
                });

                const price = (parseFloat(poolBalance, 10) - Math.round(eth)) / (reserveRatio * i);
                data.push({ supply: i, sell: +price.toFixed(4), value: +price.toFixed(4) });
            } else if (i > totalSupply) {
                let eth = Math.round(calculateBuyPrice({
                    totalSupply,
                    poolBalance,
                    reserveRatio,
                    amount: i - totalSupply
                }));
                const price = (eth + parseFloat(poolBalance, 10)) / (reserveRatio * i);
                data.push({ supply: +i, buy: +price.toFixed(4), value: +price.toFixed(4) });
            }
        }

        console.log(data)

        return { data, currentPrice: { supply: totalSupply, value: currentPrice / scale } };
    }

    setDetail = (selectedItem) => {
        this.setState({ selectedItem })
    }

    render() {
        const { data, loading, selectedItem, currentPrice } = this.state;
        const { height } = this.props;

        if (this.state.error) throw this.state.error;

        if (loading) return <Loader height={height} />;

        return (
            <div>
                <div style={{ minHeight: height }}>
                    <ReactVisBondingCurve
                        data={data}
                        onShowDetail={this.setDetail}
                        height={200}
                    />
                </div>

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
