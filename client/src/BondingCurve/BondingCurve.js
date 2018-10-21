import cn from "classnames";
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ErrorBoundary from 'react-error-boundary';
import { getWeb3 } from '../utils/getWeb3';
import styles from './BondingCurve.module.scss';
import BondingCurveChart from './components/charts/BondingCurve';
import Timeline from './components/charts/Timeline';
import ErrorComponent from './components/Error';
import Loader from './components/Loader';

export default class BondingCurve extends Component {

    static propTypes = {
        defaultTab: PropTypes.string,
        contractAddress: PropTypes.string.isRequired,
        contractArtifact: PropTypes.object.isRequired,
        height: PropTypes.number
    }

    static defaultProps = {
        height: 200
    }

    state = {
        activeTab: this.props.defaultTab || 'bonding-curve',
        error: false,
        web3: null,
        accounts: null,
        contract: null,
        loading: true
    }

    componentDidMount = async () => {
        try {
            await this.getContract(this.props);
        } catch (error) {
            this.setState({ error, loading: false })
        }
    };

    componentWillReceiveProps = async (nextProps) => {
        try {
            if (this.props.contractAddress !== nextProps.contractAddress) {
                await this.getContract(nextProps);
            }
        } catch (error) {
            this.setState({ error, loading: false })
        }
    };

    getContract = async (props) => {
        const { contractAddress, contractArtifact } = props;

        // Reset state
        this.setState({
            loading: true,
            contractAddress: null,
            contract: null,
            error: null
        })

        try {

            // Get network provider and web3 instance.
            const web3 = getWeb3();

            // Check if connected
            await web3.eth.net.isListening();

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();

            if (!web3.utils.isAddress(contractAddress)) {
                this.setState({
                    loading: false,
                    error: "Invalid address"
                })
            } else {
                const contract = new web3.eth.Contract(contractArtifact.abi, contractAddress);

                const code = await web3.eth.getCode(contractAddress);

                if (code === "0x") {
                    this.setState({
                        loading: false,
                        error: "Invalid contract"
                    })
                } else {
                    this.setState({ web3, accounts, contract, loading: false });
                }
            }
        } catch (error) {
            throw error;
        }
    }

    toggleTab(tabName) {
        this.setState({
            activeTab: tabName
        });
    }

    renderErrorComponent = (error) => {
        const { height } = this.props;

        let message = error;

        if (error.error || error.message) {
            console.error(error.message || error.error.message);
            message = "An error has occurred";
        } else {
            console.error(message)
        }

        return (
            <ErrorComponent
                message={message}
                height={height} />
        )
    }

    render() {
        const { activeTab, web3, error, accounts, loading, contract } = this.state;
        const { contractAddress, height } = this.props;

        if (loading) return <Loader height={height} />;

        // Unable to load contract
        if (!loading && !web3 && !error) return null;

        const Tab = activeTab === 'timeline' ? Timeline : BondingCurveChart;

        return (

            <div className={styles.BondingModule}>
                <ul className={styles.Tabs}>
                    <li className={cn({ active: activeTab === 'timeline' })}>
                        <button onClick={this.toggleTab.bind(this, "timeline")}>Timeline</button>
                    </li>
                    <li className={cn({ active: activeTab === 'bonding-curve' })}>
                        <button onClick={this.toggleTab.bind(this, "bonding-curve")}>Bonding Curve</button>
                    </li>
                </ul>

                <ErrorBoundary
                    FallbackComponent={this.renderErrorComponent}>

                    {
                        error ? this.renderErrorComponent(error) : null
                    }

                    {
                        web3 && !error && contract && (
                            <div className={styles.Tab_content}>
                                <Tab
                                    key={activeTab}
                                    web3={web3}
                                    height={height}
                                    account={accounts[0]}
                                    contractAddress={contractAddress}
                                    bondingCurveContract={contract}
                                />
                            </div>
                        )
                    }
                </ErrorBoundary>

            </div>
        );
    }
}