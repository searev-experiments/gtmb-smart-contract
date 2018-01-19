// Requests an abstraction of the contract to tests
var GiveTheMoneyBack = artifacts.require("GiveTheMoneyBack");

contract('GiveTheMoneyBack', function(accounts) {

    it ('Non-backer can back up the request', function() {
      return GiveTheMoneyBack.new(accounts[1], 10, 'Lorem Ipsum', { from: accounts[0] })
      .then( function(instance) {
        return instance.backUp.call({from: accounts[2]});
      }).then(function(result) {
        assert.isTrue(result);
      });
    });

    it ('Cannot back up the request twice', function() {

      var meta;

      return GiveTheMoneyBack.new(accounts[1], 10, 'Lorem Ipsum', { from: accounts[0] })
      .then( function(instance) {
        meta = instance;
        return instance.backUp({from: accounts[2]});
      }).then(function(result) {
        assert.equal(result.logs[0].event, "Backed");
        return meta.backUp({from: accounts[2]});
      }).then(function(result) {
        assert.equal(result.logs[0], undefined);
      });

    });

    it ('Receiver cannot back up the request', function() {
      return GiveTheMoneyBack.new(accounts[1], 10, 'Lorem Ipsum', { from: accounts[0] })
      .then( function(instance) {
        return instance.backUp.call({from: accounts[1]});
      }).then(function(result) {
        assert.isFalse(result);
      });
    });

    it ('Receiver cannot send a different amount that the one required', function() {

      return GiveTheMoneyBack.new(accounts[1], 1, 'Lorem Ipsum', { from: accounts[0] })
      .then( function(instance) {
        return instance.payDebt.call({from: accounts[1], value: web3.toWei(0.5, 'ether')});
      }).then(function(result) {
        assert.isFalse(result);
      });

    });

    it ('Ether is evenly dispatched between the backers', function() {

      var meta;

      //Fetch the balance in ether of accounts 3 & 4
      var account_zero_starting_balance;
      var account_three_starting_balance;
      var account_four_starting_balance;

      return GiveTheMoneyBack.new(accounts[1], 1, 'Lorem Ipsum', { from: accounts[0] })
      // User 3 backs up the request
      .then( function(instance) {
        meta = instance;
        return meta.backUp({from: accounts[3]});
      })
      // User 4 backs up the request
      .then( function(result) {
        assert.equal(result.logs[0].event, "Backed");
        return meta.backUp({from: accounts[4]});
      })
      // User 1 pays
      .then( function(result) {
        assert.equal(result.logs[0].event, "Backed");

        // Estimate the balance of accounts 0, 3 and 4 before they receive the ether.
        account_zero_starting_balance = web3.eth.getBalance(accounts[0]).toNumber();
        account_three_starting_balance  = web3.eth.getBalance(accounts[3]).toNumber();
        account_four_starting_balance = web3.eth.getBalance(accounts[4]).toNumber();

        return meta.payDebt({from: accounts[1], value: web3.toWei(1, 'ether')});
      })
      // Checks the event has been emited, and get the amount to split between the backers. 
      .then(function(result) {
        assert.equal(result.logs[0].event, "MoneyGivenBack");

        // Checks the new balance is superior to the old one
        assert.isTrue(account_zero_starting_balance < web3.eth.getBalance(accounts[0]).toNumber());
        assert.isTrue(account_three_starting_balance < web3.eth.getBalance(accounts[3]).toNumber());
        assert.isTrue(account_four_starting_balance < web3.eth.getBalance(accounts[4]).toNumber());

        // Checks every account has earn as much ether
        assert.equal(account_three_starting_balance - web3.eth.getBalance(accounts[3]).toNumber(), account_zero_starting_balance - web3.eth.getBalance(accounts[0]).toNumber());
        assert.equal(account_three_starting_balance - web3.eth.getBalance(accounts[3]).toNumber(), account_four_starting_balance - web3.eth.getBalance(accounts[4]).toNumber());


      });
    });

});