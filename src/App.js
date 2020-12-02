 
import Web3 from 'web3';


import React, { useState,useEffect } from 'react';
import rvc from "./contracts/RVC.json"
 

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
  const [networkId,setNetworkId]=useState( "")
   

 //Function to check if account changed and set it to account state 
 const getRVCBalance=async ()=>{

  try {  
    if(networkId=="3"){
      const rvcContract=await new window.web3.eth.Contract(rvc.abi, rvc.address) 
      const balance=await rvcContract.methods.balanceOf(account).call()
    setBalance(window.web3.utils.fromWei( balance,'ether') )  
    }else{
      console.log("wrong network")
    }
   }
  catch(e){
    console.log(e.message)
  }
 
   
   
 }
 const writeFunction=async()=>{


  try {  
    if(networkId=="3"){
      
    
      
      const user="0xf26D566aF179f5499108C459ef41725F370447c9"
      const amount= 10*10**6//new BN(1234) ; 
      const rvcContract=await new window.web3.eth.Contract(rvc.abi, rvc.address) 
      const approvel=await rvcContract.methods.approve(user,amount).send({from:account})
    
      
     console.log(approvel)
    }else{
      console.log("wrong network")
    }
   }
  catch(e){
    console.log(e.message)
  }
  
 
 }
 
 const writeFunction2=async()=>{
  try {  
    if(networkId=="3"){
      const web3= new Web3
     
      const rvcContract=await new window.web3.eth.Contract(rvc.abi, rvc.address) 
      const txHash=await rvcContract.methods.Forcedistribute(true).send({from:account,value:web3.utils.toWei('0.1','ether')})
     
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
      setNetworkId(networkId)
    });
    window.ethereum.on('accountsChanged', function (accounts) {
      setAccount(accounts[0])
    
})  
   
      
    
  } ,[]);
 
const  connectWeb3=async()=>{
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum)
    await window.ethereum.enable()
   
    //getRVCBalance()  
  }
  else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider)
  }
  else {
    window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
  }
  getAccount()  
  await getRVCBalance()
}
  let content = (
    <React.Fragment>
      <p>{account}</p>
      <p>{balance}</p>
      <p>{ networks[networkId]}</p>
      <button id="test" onClick={writeFunction}>test</button>
      <button id="test1" onClick={writeFunction2}>test2</button>
      <button onClick={connectWeb3}>connect</button>
       
    </React.Fragment>
  );

 
  return content;
};

export default App;