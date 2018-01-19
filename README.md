# Give The Money Back ! - Smart Contract

## Description

This repository contains the code of the smart contract used for the *Give the Money Back !* experiment, and is used in the article [Building a DApp with the Ethereum blockchain and Angular 5 - part 1:
the Smart Contract](https://huberisation/eu/2018/01/18/making-app-angular-ethereum/).

It allows to:
* request someone an amount of ether
* allow people to back up this request
* dispatched to owed money between all the backers

## Requirements
* Truffle v4.0.5

You can install Truffle using npm:

```
$ npm install -g truffle
```

## Test

Once you have clone the repository, launch the *Truffle development* environment using

```
$ truffle develop
```

There, you can run the test using

```
$ truffle(develop)> test
```

## Deploy
Specify the network you want to deploy this smart contract to in the `truffle-config.js` file, and write the parameters you will use for the constructor in the `1_initial_migration` file.