import PropTypes from "prop-types";
import React, { Component } from "react";
import ReactVisBondingCurve from "./ReactVisBondingCurve";
import Loader from "../../Loader";
import { calculateSaleReturn, calculateBuyPrice } from "../../../../utils/bondingcurveCalculator";
import Footer from "../../Footer";
import numeral from "numeral";

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

        const { account, bondingCurveContract } = this.props;

        try {

            const tokenBalance = account ? +await bondingCurveContract.methods.tokenBalance().call() : 0;
            const dropsBalance = account ? +await bondingCurveContract.methods.dropsBalance().call() : 0;
            const dropsSupply = account ? +await bondingCurveContract.methods.dropsSupply().call() : 0;
            const reserveRatio = +await bondingCurveContract.methods.reserveRatio().call() / 1000000
            const poolBalance = +await bondingCurveContract.methods.poolBalance().call();
            const scale = +await bondingCurveContract.methods.scale().call();
            const totalSupply = +await bondingCurveContract.methods.totalSupply().call();
            const ndrops = +await bondingCurveContract.methods.ndrops().call();
            const nOcean = +await bondingCurveContract.methods.nOcean().call();
            const ghostSupply = +await bondingCurveContract.methods.ghostSupply().call();

            const params = {
                dropsSupply,
                tokenBalance,
                dropsBalance,
                reserveRatio,
                poolBalance,
                scale,
                totalSupply: nOcean,
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

        for (let i = step; i < totalSupply * 1.3; i += step) {
            if (i < totalSupply) {
                let eth = calculateSaleReturn({
                    totalSupply,
                    poolBalance,
                    reserveRatio,
                    amount: totalSupply - i
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
                data.push({ supply: i, buy: +price.toFixed(4), value: +price.toFixed(4) });
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
