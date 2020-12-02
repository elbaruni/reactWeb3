import Web3 from 'web3';
import React, { useState,useEffect } from 'react';
import rcvr from "./contracts/RCVR.json";
import migration from "./contracts/Migration.json"

const networks={
  "1":"MainNet",
  "3":"Ropsten",
  "4":"Rinkeby",
  "5":"Görli" ,
  "42":"Kovan "
}

const App = props => {
  const [account,setAccount]=useState("")
  const [balance,setBalance]=useState(0)
  const [networkId,setNetworkId]=useState("")
  const [stake,setStake]=useState("")
  
  //Function to check if account changed and set it to account state 
 const getRCVRBalance=async ()=>{

  try {  
    if(networkId=="3"){
      const rcvrContract=await new window.web3.eth.Contract(rcvr.abi, rcvr.address) 
      const balance=await rcvrContract.methods.balanceOf(account).call()
      setBalance(window.web3.utils.fromWei( balance,'ether') )  
    } else {
      console.log("wrong network")
      setBalance(null)  
    }
  }
  catch(e){
    console.log(e.message)
  }
 }

 const createSafeStake=async()=>{
  try {  
    if(networkId=="3"){
      const web3= new Web3;
      const BN = web3.utils.BN;
      let amount = parseInt(stake);

      const rcvrContract=await new window.web3.eth.Contract(rcvr.abi, rcvr.address) 
      const txHash = await rcvrContract.methods.createSafeStake(web3.utils.toWei(`${amount}`, 'ether')).send({from:account})
      console.log(txHash.transactionHash);
    } else {
      console.log("wrong network")
    }
   }
  catch(e){
    console.log(e.message)
  }
 }

 const removeStake =async()=>{
  try {  
    if(networkId=="3"){  
      const web3= new Web3;
      const BN = web3.utils.BN;
      let amount = parseInt(stake);

      const rcvrContract=await new window.web3.eth.Contract(rcvr.abi, rcvr.address) 
      const txHash=await rcvrContract.methods.removeStake(web3.utils.toWei(`${amount}`, 'ether')).send({from:account})
      console.log(txHash.transactionHash)
    } else {
      console.log("wrong network")
    }
   }
  catch(e){
    console.log(e.message)
  }
 }

 const forceDistribute1=async()=>{
  try {  
    if(networkId=="3"){
      const web3= new Web3
     debugger
      const rcvrContract=await new window.web3.eth.Contract(rcvr.abi, rcvr.address) 
      const txHash=await rcvrContract.methods.Forcedistribute(true).send({from:account,value:web3.utils.toWei('0.1','ether')})
     
     console.log(txHash.transactionHash)
    }else{
      console.log("wrong network")
    }
   }
  catch(e){
    console.log(e.message)
  }
 }

 const forceDistribute2=async()=>{
  try {  
    if(networkId=="3"){
      const web3= new Web3
     
      const rcvrContract=await new window.web3.eth.Contract(rcvr.abi, rcvr.address) 
      const txHash=await rcvrContract.methods.Forcedistribute(false).send({from:account,value:web3.utils.toWei('0.1','ether')})
     
     console.log(txHash.transactionHash)
    }else{
      console.log("wrong network")
    }
   }
  catch(e){
    console.log(e.message)
  }
 }
 const migrate=async()=>{
  try {  
    if(networkId=="3"){
      const web3= new Web3
     
      const migrationContract=await new window.web3.eth.Contract(migration.abi, migration.address) 
      const txHash=await migrationContract.methods.migrate().send({from:account})
     
     console.log(txHash.transactionHash)
    }else{
      console.log("wrong network")
    }
   }
  catch(e){
    console.log(e.message)
  }
 }

 
 const getAccount=async ()=>{
  const web3 = window.web3
  // Load account
  const accounts = await web3.eth.getAccounts()
  console.log(accounts)
  setAccount(accounts[0])
 }
  useEffect(() => {
    setNetworkId(window.ethereum.networkVersion)
    window.ethereum.on('networkChanged', function(networkId){
      console.log('networkChanged',networkId);
      setNetworkId(networkId);
      getRCVRBalance(); 
    });
    window.ethereum.on('accountsChanged', function (accounts) {
      setAccount(accounts[0]);
      getRCVRBalance();
    });
  } ,[]);
 
const  connectWeb3=async()=>{
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum)
    await window.ethereum.enable()
  }
  else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider)
  }
  else {
    window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
  }
  getAccount()  
  await getRCVRBalance()
}
  let content = (
    <React.Fragment>
      <div  style={{padding:'30px'}}>
        <p>Address: {account}</p>
        <p>RCVR Balance: {balance}</p>
        <p>NetworkId: { networks[networkId]}</p>
        <p>         
          <button onClick={connectWeb3}>connect</button>
        </p>
        <hr/>
        <p>
          <input type="number" min="1" max="1000000" defaultValue={stake} onChange={(e) => setStake(e.target.value)}/>
          <br/>
          <button id="btn1" onClick={createSafeStake}>Create Stake</button>
          <button id="btn2" onClick={removeStake}>Remove Stake</button>
        </p>
        <p>
          <button id="btn3" onClick={forceDistribute1}>Force Calculation 1</button>
          <button id="btn4" onClick={forceDistribute2}>Force Calculation 2</button>
        </p>
        <hr/>
        <p>
          <button id="btn5" onClick={migrate}>Migrate</button>
        </p>
       </div>
    </React.Fragment>
  );
  return content;
};
export default App;