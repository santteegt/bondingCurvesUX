import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import ErrorBoundary from 'react-error-boundary'
import { getWeb3 } from '../utils/getWeb3'
import styles from './BondingCurve.module.scss'
import BondingCurveChart from './components/charts/BondingCurve'
import Timeline from './components/charts/Timeline'
import ErrorComponent from './components/Error'
import Loader from './components/Loader'

import 'react-vis/dist/style.css'
import { timeFormatDefaultLocale } from 'd3-time-format'
import english from 'd3-time-format/locale/en-US.json'

// To prevent overflowing of large month names
timeFormatDefaultLocale({
    ...english,
    months: english.shortMonths
})

export default class BondingCurve extends PureComponent {
    static propTypes = {
        defaultTab: PropTypes.string,
        contractAddress: PropTypes.string.isRequired,
        contractArtifact: PropTypes.object.isRequired,
        height: PropTypes.number,
        onError: PropTypes.func,
        onLoaded: PropTypes.func
    }

    static defaultProps = {
        height: 200,
        onLoaded: () => { }
    }

    state = {
        activeTab: this.props.defaultTab || 'timeline',
        error: false,
        web3: null,
        contract: null,
        loading: true
    }

    componentDidMount = async () => {
        try {
            await this.getContract(this.props)
        } catch (error) {
            this.setState({ error, loading: false })
        }
    };

    componentDidUpdate = async (prevProps) => {
        try {
            if (this.props.contractAddress !== prevProps.contractAddress) {
                await this.getContract(this.props)
            }
        } catch (error) {
            this.setState({ error, loading: false })
        }
    };

    getContract = async (props) => {
        const { contractAddress, contractArtifact, onLoaded } = props

        // Reset state
        this.setState({
            loading: true,
            contractAddress: null,
            contract: null,
            error: null
        })

        try {
            // Get network provider and web3 instance.
            const web3 = getWeb3()

            // Check if connected
            await web3.eth.net.isListening()

            if (!web3.utils.isAddress(contractAddress)) {
                this.setState({
                    loading: false,
                    error: 'Invalid address'
                })
            } else {
                const contract = new web3.eth.Contract(contractArtifact.abi, contractAddress)

                const code = await web3.eth.getCode(contractAddress)

                if (code === '0x') {
                    this.setState({
                        loading: false,
                        error: 'Invalid contract'
                    })
                } else {
                    onLoaded()

                    this.setState({ web3, contract, loading: false })
                }
            }
        } catch (error) {
            throw error
        }
    }

    toggleTab(tabName) {
        this.setState({
            activeTab: tabName
        })
    }

    renderErrorComponent = (error) => {
        const { height, onError } = this.props

        let message = error
        let originalMessage = error

        if (error.error || error.message) {
            originalMessage = error.message || error.error.message
            console.error(error.message || error.error.message)
            message = 'An error has occurred'
        } else {
            console.error(message)
        }

        if (onError) {
            onError(originalMessage)
            return null
        }

        return (
            <ErrorComponent
                message={message}
                height={height} />
        )
    }

    render() {
        return (
            <div className={styles.bondingModule}>
                {this.renderContent()}
            </div>
        )
    }

    renderContent = () => {
        const { activeTab, web3, error, loading, contract } = this.state
        const { contractAddress, height } = this.props

        if (loading) return <Loader style={{ minHeight: height }} />

        // Unable to load contract
        if (!loading && !web3 && !error) return null

        const isActive = (key) => activeTab === key

        const Tab = isActive('timeline') ? Timeline : BondingCurveChart

        return (
            <>
                <ul className={styles.tabs}>
                    <li>
                        <button
                            className={isActive('timeline') ? styles.tab__active : styles.tab}
                            onClick={this.toggleTab.bind(this, 'timeline')}>
                            Timeline
                        </button>
                    </li>
                    <li>
                        <button
                            className={isActive('bonding-curve') ? styles.tab__active : styles.tab}
                            onClick={this.toggleTab.bind(this, 'bonding-curve')}>
                            Bonding Curve
                        </button>
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
                                    contractAddress={contractAddress}
                                    bondingCurveContract={contract}
                                />
                            </div>
                        )
                    }
                </ErrorBoundary>
            </>
        )
    }
}
