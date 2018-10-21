import PropTypes from 'prop-types';
import { Component } from 'react';
import React from "react";
import ReactVisTimeline from './ReactVisTimeline';
import styles from "./timeline.module.scss";
import cn from "classnames";
import moment from "moment";
import Footer from '../../Footer';

export default class Timeline extends Component {

    static propTypes = {
        bondingCurveContract: PropTypes.object.isRequired,
        web3: PropTypes.object.isRequired,
        height: PropTypes.number.isRequired,
        contractAddress: PropTypes.string.isRequired,
    }

    state = {
        minDomain: 0,
        selectedItem: null,
        data: [],
        activeFilter: 'MAX',
        maxValue: 0,
        error: null
    }

    filters = ["1D", "5D", "1M", "1Y", "MAX"]

    async componentDidMount() {
        try {
            await this.getData(this.props);
        } catch (error) {
            this.setState({ error })
        }
    }

    async componentWillReceiveProps(nextProps) {
        try {
            if (nextProps.contractAddress !== this.props.contractAddress) {
                this.setState({
                    data: []
                }, () => {
                    this.getData(nextProps)
                })
            };
        } catch (error) {
            this.setState({ error })
        }
    }

    getData = async (props) => {
        const { bondingCurveContract } = props;

        try {

            const scale = await bondingCurveContract.methods.scale().call()

            bondingCurveContract.events.allEvents({
                fromBlock: 0,
                toBlock: 'latest'
            })
                .on('data', async (event) => {

                    try {
                        if (["TokenBuyDrops", "TokenSellDrops"].indexOf(event.event) !== -1) {
                            await this.handleEvent(event, scale)
                        }
                    } catch (err) {
                        throw err;
                    }

                })
                .on('changed', (event) => {
                    console.log("changed", event)
                })
                .on('error', console.error);

        } catch (error) {
            this.setState({ error })
        }
    }

    handleEvent = async (event, scale) => {
        try {

            const { web3 } = this.props;

            const price = event.returnValues._price / scale;
            const block = await web3.eth.getBlock(event.blockNumber)

            const date = moment(block.timestamp * 1000).valueOf();

            let newMaxValue = this.state.maxValue;

            if (price > this.state.maxValue) {
                newMaxValue = price;
            }

            this.setState((prevState) => ({
                data: [
                    ...prevState.data,
                    {
                        y: +price,
                        x: date
                    }
                ],
                maxValue: newMaxValue
            }))

        } catch (err) {
            throw err;
        }
    }

    setFilter = (filter) => {
        let minDomain = 0;

        if (filter !== "MAX") {
            const duration = moment.duration(`P${filter}`)
            minDomain = moment().subtract(duration).valueOf()
        }

        this.setState({
            activeFilter: filter,
            minDomain
        })

    }

    setDetail = (selectedItem) => {
        this.setState({ selectedItem })
    }

    render() {
        const { activeFilter, selectedItem, minDomain, maxValue, data } = this.state;
        const { height } = this.props;

        if (this.state.error) throw this.state.error;

        const detail = selectedItem || data.slice(-1)[0]

        return (
            <div>
                <div style={{ minHeight: height }}>
                    <ReactVisTimeline
                        activeFilter={activeFilter}
                        minDomain={minDomain}
                        maxValue={maxValue}
                        height={height}
                        onShowDetail={this.setDetail}
                        data={this.state.data} />
                </div>

                <Footer
                    symbol="OCN"
                    detail={detail ? {
                        title: `${detail.y.toFixed(4)}`,
                        sub: moment(detail.x).format("lll")
                    } : null}
                >
                    <ul className={styles.timeline_filter}>
                        {this.filters.map((filter) => (
                            <li
                                key={filter}
                                className={cn({ active: filter === activeFilter })}
                                onClick={this.setFilter.bind(this, filter)}>
                                {filter}
                            </li>
                        ))}
                    </ul>
                </Footer>
            </div>
        )
    }
}
