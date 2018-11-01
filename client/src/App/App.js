import React, { PureComponent } from 'react'
import { ReactComponent as Logo } from '@oceanprotocol/art/logo/logo.svg'
import styles from './App.module.scss'
import BondingCurve from '../BondingCurve/BondingCurve'
// CRA doesn't allow us to import outside the src, so this is a copy
import contractArtifact from './BondingCurve.json'

class App extends PureComponent {
  state = { contractAddress: '0x96eaf28b6e59defc8f736faa1681d41382d3aa32' };

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
