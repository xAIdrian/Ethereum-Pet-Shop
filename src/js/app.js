App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return App.initWeb3();
  },

  initWeb3: function() {
    // is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // if no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    /*
    We first retrieve the artifact file for our smart contract. Artifacts are information about 
    our contract such as its deployed address and Application Binary Interface (ABI). 
    The ABI is a JavaScript object defining how to interact with the contract including its variables, 
    functions and their parameters. */
    $.getJSON('Adoption.json', function(data) {
      // get the necessary artifact file and instantiate it with TruffleContract
      var AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);

      // set the provider for our contract
      App.contracts.Adoption.setProvider(App.web3Provider);

      // use our contract to retrieve and mark the adopted pets
      return App.markAdopted();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  // getting the adopted pets and updating the ui
  markAdopted: function(adopters, account) {
    var adoptionInstance;

    // deploy contract
    App.contracts.Adoption.deployed()
    .then(function(instance) { 
        adoptionInstance = instance;
        // then immediatly call getAdopters and return. 
        // the returned resul is then passed as the parameter 
        // for the following THEN
        return adoptionInstance.getAdopters.call();
        /*
        Using call() allows us to read data from the blockchain 
        without having to send a full transaction, meaning we won't 
        have to spend any ether. */
      }
    ).then(function(adopters) {
        for (i = 0; i < adopters.length; i++) {
          if (adopters[i] != '0x0000000000000000000000000000000000000000') { // compared to empty address
            $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
          }
        }
      }
    ).catch(function(err) {
        console.log(err.message);
    })
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    var adoptionInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Adoption.deployed()
      .then(function(instance) {
          adoptionInstance = instance;
          // execute adopt as a transaction on the blockchain by sending account
          return adoptionInstance.adopt(petId, {from: account});
        }
      ).then(function(result) {
        return App.markAdopted();
      }).catch(function(err) {
        console.log(err.message)
      })
    })
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
