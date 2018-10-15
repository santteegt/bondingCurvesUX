[![banner](https://raw.githubusercontent.com/oceanprotocol/art/master/github/repo-banner%402x.png)](https://oceanprotocol.com)

# bounty-contracts

> Ocean Protocol Bounties Smart Contract - ERC20 token with Freeze, Airdrop and Bounty Functions
> [oceanprotocol.com](https://oceanprotocol.com)

[![js oceanprotocol](https://img.shields.io/badge/js-oceanprotocol-7b1173.svg)](https://github.com/oceanprotocol/eslint-config-oceanprotocol)

---

**🐲🦑 THERE BE DRAGONS AND SQUIDS. This is in alpha state and you can expect running into problems. If you run into them, please open up [a new issue](https://github.com/oceanprotocol/bounty-contracts/issues). 🦑🐲**

---

## Table of Contents

  - [Specifications](#specifications)
  - [Development](#development)
     - [Contract testing](#contract-testing)
     - [Contract deployment](#contract-deployment)
  - [Freeze Account](#freeze-account)
  - [License](#license)

---

## Specifications

1. the account that deployes the contract is the `token contract owner`;
1. `contract owner` has all the tokens at the begining;
1. transfer funds between accounts;
1. owner can freeze any account to prevent tranferring funds out from these accounts;
1. owner can unfreeze accounts to enable transfer;
1. owner can return a list of all accounts that received tokens;

## Development

As a pre-requisite, you need:

- Node.js >=8
- npm

```bash
npm install 
```

### Contract testing

The token contract can be tested with `test/TestToken.js` file:

```bash
npm test
```

The result is similar to following:

<img src='img/testImage.jpg' width="600"/>

### Contract deployment

Deploy the contracts to the Ropsten test network after compiling them with:

```bash
npm run compile
npm run deploy:ropsten
```

## Freeze Account

You can freeze an account by using the included web app. Launch the web server with:

```bash
npm start
```

Simply switch the proper network (e.g., Rinkeby or Main) and login the owner account in MetaMask, and type in account address to be unfreezed and click button.

<img src='img/web.jpg' width="600"/>

## License

```
Copyright 2018 Ocean Protocol Foundation Ltd.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```