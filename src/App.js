import Web3 from 'web3';
import React, { useState, useEffect } from 'react';
import rcvr from "./contracts/RCVR.json";
import migration from "./contracts/Migration.json"
import deadtoken from "./contracts/DeadToken.json"
import BigNumber from 'bignumber.js';

const networks = {
  "1": "MainNet",
  "3": "Ropsten",
  "4": "Rinkeby",
  "5": "Görli",
  "42": "Kovan "
}

const App = props => {
  const [windowWeb3, setWindowWeb3] = useState(null)
  const [account, setAccount] = useState("")
  const [locked, setLocked] = useState(true)
  const [balance, setBalance] = useState(0)
  const [networkId, setNetworkId] = useState("")
  const [metamaskInstalled, setMetamaskInstalled] = useState(false)

  const [stake, setStake] = useState("")

  //Function to check if account changed and set it to account state 
  const createSafeStake = async () => {
    try {
      if (networkId == "4") {
        const web3 = new Web3;
        const BN = web3.utils.BN;
        let amount = parseInt(stake);

        const rcvrContract = await new window.web3.eth.Contract(rcvr.abi, rcvr.address)
        const txHash = await rcvrContract.methods.createSafeStake(web3.utils.toWei(`${amount}`, 'ether')).send({ from: account })
        console.log(txHash.transactionHash);
      } else {
        console.log("wrong network")
      }
    }
    catch (e) {
      console.log(e.message)
    }
  }

  const removeStake = async () => {
    try {
      if (networkId == "4") {
        const web3 = new Web3;
        const BN = web3.utils.BN;
        let amount = parseInt(stake);

        const rcvrContract = await new window.web3.eth.Contract(rcvr.abi, rcvr.address)
        const txHash = await rcvrContract.methods.removeStake(web3.utils.toWei(`${amount}`, 'ether')).send({ from: account })
        console.log(txHash.transactionHash)
      } else {
        console.log("wrong network")
      }
    }
    catch (e) {
      console.log(e.message)
    }
  }

  const forceDistribute1 = async () => {
    try {
      if (networkId == "4") {
        const web3 = new Web3
        const rcvrContract = await new window.web3.eth.Contract(rcvr.abi, rcvr.address)
        const txHash = await rcvrContract.methods.Forcedistribute(true).send({ from: account, value: web3.utils.toWei('0.1', 'ether') })

        console.log(txHash.transactionHash)
      } else {
        console.log("wrong network")
      }
    }
    catch (e) {
      console.log(e.message)
    }
  }

  const forceDistribute2 = async () => {
    try {
      if (networkId == "4") {
        const web3 = new Web3

        const rcvrContract = await new window.web3.eth.Contract(rcvr.abi, rcvr.address)
        const txHash = await rcvrContract.methods.Forcedistribute(false).send({ from: account, value: web3.utils.toWei('0.1', 'ether') })

        console.log(txHash.transactionHash)
      } else {
        console.log("wrong network")
      }
    }
    catch (e) {
      console.log(e.message)
    }
  }

  const approve = async () => {
    try {
      if (networkId == "4") {
        const web3 = new Web3;

        const maxAmount = new BigNumber(1).multipliedBy(new BigNumber(2).pow(256)).minus(1);
        const deadtokenContract = await new window.web3.eth.Contract(deadtoken.abi, deadtoken.address)
        const txHash = await deadtokenContract.methods.approve(migration.address, maxAmount.toString(10)).send({ from: account })

        console.log(txHash.transactionHash)
      } else {
        console.log("wrong network")
      }
    }
    catch (e) {
      console.log(e.message)
    }
  }

  const migrate = async () => {
    try {
      if (networkId == "4") {
        const web3 = new Web3

        const migrationContract = await new window.web3.eth.Contract(migration.abi, migration.address)
        const txHash = await migrationContract.methods.migrate().send({ from: account })

        console.log(txHash.transactionHash)
      } else {
        console.log("wrong network")
      }
    }
    catch (e) {
      console.log(e.message)
    }
  }

  useEffect(async () => {

    // const metamaskInstalled = typeof windowWeb3 !== 'undefined'
    if (windowWeb3) {
      const accounts = await windowWeb3.eth.getAccounts()
      if (typeof accounts != 'undefined' && accounts.length > 0) {
        const networkId = await windowWeb3.eth.net.getId()
        console.log(networkId)
        if (networkId == "4") {
          const account = accounts[0]
          const web3 = new Web3()
          const rvcContract = await new windowWeb3.eth.Contract(rcvr.abi, rcvr.address)
          const _balance = await rvcContract.methods.balanceOf(account).call()
          setAccount(accounts[0])
          setBalance(web3.utils.fromWei(String(_balance), 'ether'))
          setLocked(!windowWeb3.currentProvider._state.isUnlocked)
          setNetworkId(networkId)
        }
        else {
          setNetworkId(networkId)
          setBalance(0)
        }
      }
      else {
        setAccount('')
        setBalance(0)
        setLocked(!windowWeb3.currentProvider._state.isUnlocked)
      }
      window.ethereum.on('networkChanged', async function (netId) {
        const accounts = await windowWeb3.eth.getAccounts()
        if (typeof accounts != 'undefined' && accounts.length > 0) {
          const networkId = await windowWeb3.eth.net.getId()
          console.log(networkId)

          if (networkId == "4") {
            const account = accounts[0]
            const web3 = new Web3()
            const rvcContract = await new windowWeb3.eth.Contract(rcvr.abi, rcvr.address)
            const _balance = await rvcContract.methods.balanceOf(account).call()
            setAccount(accounts[0])
            setBalance(web3.utils.fromWei(String(_balance), 'ether'))
            setLocked(!windowWeb3.currentProvider._state.isUnlocked)
            setNetworkId(networkId)
          }
          else {
            setNetworkId(networkId)
            setBalance(0)
          }
        }
        setNetworkId(netId)
      });
      window.ethereum.on('accountsChanged', async function (accounts) {
        if (typeof accounts !== 'undefined' && accounts.length > 0) {
          const account = accounts[0]
          const web3 = new Web3()
          let _balance = 0
          if (networkId == "4") {
            const rvcContract = await new windowWeb3.eth.Contract(rcvr.abi, rcvr.address)
            _balance = await rvcContract.methods.balanceOf(account).call()
          }
          setAccount(accounts[0])
          setBalance(web3.utils.fromWei(String(_balance), 'ether'))
          setLocked(!windowWeb3.currentProvider._state.isUnlocked)
        }
        else {
          setWindowWeb3(null)
          setAccount('')
          setBalance(0)
          setLocked(true)
          setWindowWeb3(null)
        }
      });
    } else {
      try {
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum)

          setWindowWeb3(new Web3(window.ethereum))
          const web3 = new Web3()
          // Load account
          const accounts = await window.web3.eth.getAccounts()
          const networkId = await window.web3.eth.net.getId()
          const account = accounts[0]
          let _balance = 0
          if (networkId == "4") {
            const rvcContract = await new windowWeb3.eth.Contract(rcvr.abi, rcvr.address)
            _balance = await rvcContract.methods.balanceOf(account).call()
          }
          setAccount(accounts[0])
          setBalance(web3.utils.fromWei(String(_balance), 'ether'))
          setLocked(!windowWeb3.currentProvider._state.isUnlocked)
          setNetworkId(networkId)
        }
        else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider)
          setWindowWeb3(new Web3(window.web3.currentProvider))
          const web3 = new Web3()
          // Load account
          const accounts = await window.web3.eth.getAccounts()
          const networkId = await window.web3.eth.net.getId()
          const account = accounts[0]
          let _balance = 0
          if (networkId == "4") {
            const rvcContract = await new windowWeb3.eth.Contract(rcvr.abi, rcvr.address)
            _balance = await rvcContract.methods.balanceOf(account).call()

          }
          setLocked(!windowWeb3.currentProvider._state.isUnlocked)
          setAccount(accounts[0])
          setBalance(web3.utils.fromWei(String(_balance), 'ether'))
          setNetworkId(networkId)
        }
        else {
          // DO NOTHING...
        }
      }
      catch (e) {
        console.log(e.message)
      }
    }
  }, [windowWeb3]);

  const loadWeb3 = async () => {
    try {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum)
        setWindowWeb3(new Web3(window.ethereum))
        //window.web3 = new Web3(window.ethereum)
        await window.ethereum.enable()
      }
      else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider)
        setWindowWeb3(new Web3(window.web3.currentProvider))
        //  window.web3 = new Web3(window.web3.currentProvider)
      }
      else {
        // DO NOTHING...
      }
    }
    catch (e) {
      console.log(e.message)
    }
  }

  const loadBlockchainData = async () => {

    const web3 = new Web3()
    // Load account
    const accounts = await window.web3.eth.getAccounts()
    const networkId = await window.web3.eth.net.getId()
    const account = accounts[0]
    let _balance = 0
    if (networkId == "4") {
      const rvcContract = await new windowWeb3.eth.Contract(rcvr.abi, rcvr.address)
      _balance = await rvcContract.methods.balanceOf(account).call()
    }
    setLocked(!windowWeb3.currentProvider._state.isUnlocked)
    setAccount(accounts[0])
    setBalance(web3.utils.fromWei(String(_balance), 'ether'))

    setNetworkId(networkId)
  }
  const connectWeb3 = async () => {
    await loadWeb3()
    await loadBlockchainData()
  }

  let content = (
    <React.Fragment>
      <div style={{ padding: '30px' }}>
        <h1> RCVR token UI</h1>
        <p>Address: {account}</p>
        <p>RCVR Balance: {balance}</p>
        <p>NetworkId: {networks[networkId]}</p>
        <p> {!locked ? "connected" : "not connected"} </p>
        <p>
          <button onClick={connectWeb3} disabled={!locked}>connect</button>
        </p>
        <hr />
        <p>
          <input type="number" min="1" max="1000000" defaultValue={stake} onChange={(e) => setStake(e.target.value)} />
          <br />
          <button id="btn1" onClick={createSafeStake}>Create Stake</button>
          <button id="btn2" onClick={removeStake}>Remove Stake</button>
        </p>
        <p>
          <button id="btn3" onClick={forceDistribute1}>Force Calculation 1</button>
          <button id="btn4" onClick={forceDistribute2}>Force Calculation 2</button>
        </p>
        <hr />
        <p>
          <button id="btn5" onClick={approve}>Approve</button>
          <button id="btn6" onClick={migrate}>Migrate</button>
        </p>
        <hr />
      </div>
    </React.Fragment>
  );
  return content;
};
export default App;