# bondingCurvesUX [![banner](https://travis-ci.org/Superjo149/bondingCurvesUX.svg?branch=master)](https://travis-ci.org/Superjo149/bondingCurvesUX) [![codecov](https://codecov.io/gh/Superjo149/bondingCurvesUX/branch/master/graph/badge.svg)](https://codecov.io/gh/Superjo149/bondingCurvesUX)
Frontend application for Bonding Curves UX

[![ux](https://camo.githubusercontent.com/a30a16d25ba596dc9d29cab06649ba1c74be6833/68747470733a2f2f7468756d62732e6766796361742e636f6d2f576569676874795365636f6e6468616e64416e61636f6e64612d73697a655f726573747269637465642e676966)]

## Development

As a pre-requisite, you need:

- Node.js >=10
- npm
- truffle 5.x
- ganache-cli


## Installation instructions

- To deploy the smart contracts:

```bash
cd contract
npm install
ganache-cli # on a separate terminal window
truffle migrate
```

If you want to show a default bonding curve in the UI, copy the corresponding address of the deployed BondingCurve smart contract from within the `truffle migrate` logs, and paste it on the `contractAddress` state variable from `client/src/App.js`

- To run the frontend:


```bash
cd client
npm install
npm start
```

## Demo instructions

- To get some simulation data, run the following command on a terminal: directory:

```bash
cd contract
truffle test
```

You should see in the logs (see example above) the address of the BondingCurve contract used to generate simulation data. You need to copy that address in order to see the results within the UI

```
...
Contract: BondingCurve
    Test User stories
BondingCurve contract address 0x8E2111ED22B419bE6Fc15De8A377ED2C486D4F7
...
```

- Finally, in a browser open the [http://localhost:3000](http://localhost:3000) and paste the address of the simulated BondingCurve smart contract in the corresponding field within the UI
