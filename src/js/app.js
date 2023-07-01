var name;

App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function () {
    return App.initWeb3();
  },

  initWeb3: function () {
    if (typeof web3 !== 'undefined') {
      const ethEnabled = () => {
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum);
          return true;
        }
        return false;
      };
      if (!ethEnabled()) {
        alert(
          'Please install an Ethereum-compatible browser or extension like MetaMask to use this dApp!'
        );
      }
      web3 = window.web3;
      App.web3Provider = web3.currentProvider;
    } else {
      App.web3Provider = new Web3.providers.HttpProvider(
        'http://localhost:7545'
      );
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function () {
    $.getJSON('Election.json', function (election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  listenForEvents: function () {
    App.contracts.Election.deployed().then(function (instance) {

      instance
        .votedEvent(
          {},
          {
            fromBlock: 0,
            toBlock: 'latest',
          }
        )
        .watch(function (error, event) {
          console.log('event triggered', event);
          App.render();
        });
    });
  },

  render: async () => {
    var electionInstance;
    var loader = $('#loader');
    var content = $('#content');

    loader.show();
    content.hide();

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      App.account = accounts[0];
      $('#accountAddress').html('Your Account: ' + App.account);
    } catch (error) {
      if (error.code === 4001) {
      }
      console.log(error);
    }

    App.contracts.Election.deployed()
      .then(function (instance) {
        electionInstance = instance;
        return electionInstance.candidatesCount();
      })
      .then(async (candidatesCount) => {
        const promise = [];
        for (var i = 1; i <= candidatesCount; i++) {
          promise.push(electionInstance.candidates(i));
        }

        const candidates = await Promise.all(promise);

        var candidatesResults = $('#candidatesResults');
        candidatesResults.empty();
        
        var candidateResultFinal = $('#candidateResultFinal');
        candidateResultFinal.empty()
        
        var candidateList = $('#candidateList');
        candidateList.empty();

        var candidatesSelect = $('#candidatesSelect');
        candidatesSelect.empty();

        console.log(candidates[0][1]);
        for (var i = 0; i < candidatesCount; i++) {
          var id = candidates[i][0];
          var name = candidates[i][1];
          var voteCount = candidates[i][2];
          var add = candidates[i][3];
          var phone = candidates[i][4];
          var candidateTemplate =
            '<tr><th>' +
            id +
            '</th><td>' +
            name +
            '</td><td>' +
            voteCount +
            '</td></tr>';

          candidatesResults.append(candidateTemplate);

          var candidateListTemp=
            '<tr><th>' +
            id +
            '</th><td>' +
            name +
            '</td><td>' +
            add +
            '</td><td>' +
            phone+
            '</td></tr>';

            candidateList.append(candidateListTemp);
          var candidateOption =
            "<option value='" + id + "' >" + name + '</ option>';
          candidatesSelect.append(candidateOption);
        }

        candidates.sort(function(x, y) {
          if (x[2]>y[2]) {
            return -1;
          }
          if (x[2]<y[2]) {
            return 1;
          }
          return 0;
        });

        for (var i = 0; i < candidatesCount; i++) {
          var id = candidates[i][0];
          var name = candidates[i][1];
          var voteCount = candidates[i][2];
          var add = candidates[i][3];
          var phone = candidates[i][4];
          var p=i+1;
          var candidateResultTemp=
            '<tr><th>' +
            p+
            '</th><td>' +
            id +
            '</th><td>' +
            name +
            '</td><td>' +
            add +
            '</td><td>' +
            phone +
            '</td><td>' +
            voteCount +
            '</td></tr>';

            candidateResultFinal.append(candidateResultTemp);
        }
        return electionInstance.voters(App.account);
      })
      .then(function (hasVoted) {
        if (hasVoted) {
          $('form').hide();
        }
        loader.hide();
        content.show();
      })
      .catch(function (error) {
        console.warn(error);
      });

  },
  payN: function () {
    // console.log("he he");
    var sellerAdd = $('#sellerAdd').val();
    var mon = web3.toBigNumber($('#mon').val());
    // console.log("bhaiya");
    console.log(sellerAdd);
    console.log(mon);

    var weiValue = web3.toWei(mon,'ether');
    App.contracts.Election.deployed()
      .then(function (instance) {
        return instance.payment(sellerAdd,{from: App.account,  value: weiValue});
      })
      .then(function (result) {
        console.log("he eh");
        window.location.replace("http://localhost:5000/paySuc");
        
      })
      .catch(function (err) {
        console.log("he he");
        console.error(err);
      });
  },
};

$(function () {
  $(window).on('load', function(){ 
    App.init();
  });
});

// app.post("/beta",(req,res)=>{
//   console.log(req.body);
//   var candidate = req.body;
//   name=candidate;
//  });

