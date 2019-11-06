import React, { PureComponent } from 'react'
import { ReactComponent as Logo } from '@oceanprotocol/art/logo/logo.svg'
import styles from './App.module.scss'
import BondingCurve from '../BondingCurve/BondingCurve'
// CRA doesn't allow us to import outside the src, so this is a copy
import contractArtifact from './BondingCurve.json'

class App extends PureComponent {
  state = { contractAddress: '0x62Df148cA261814F673033E71c0d9F2a66ab4B8e' };

  handleChange = (event) => {
      this.setState({ contractAddress: event.target.value })
  }

  render() {
      return (
          <div className={styles.app}>
              <header className={styles.app_header}>
                  <Logo className={styles.app_logo} />
                  <input
                      className={styles.app_header__input}
                      type="text"
                      value={this.state.contractAddress}
                      onChange={this.handleChange}
                  />
              </header>

              <div className={styles.bondingcurve}>
                  <BondingCurve
                      contractAddress={this.state.contractAddress}
                      contractArtifact={contractArtifact}
                      settings={{
                          poolBalance: 4000000,
                          totalSupply: 1000000,
                          reserveRatio: 0.2
                      }}
                  />
              </div>
          </div>
      )
  }
}

export default App
