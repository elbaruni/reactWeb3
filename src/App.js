 
import Web3 from 'web3';


import React, { useState,useEffect } from 'react';
import rvc from "./contracts/RVC.json"
import factory from "./contracts/Factory.json"
 

const App = props => {
  const [account,setAccount]=useState("")
 
  const [balance,setBalance]=useState(0)
   

 //Function to check if account changed and set it to account state 
 const getRVCBalance=async ()=>{
    console.log(window.web3 )
     const rvcContract=await new window.web3.eth.Contract(rvc.abi, rvc.address) 
    const b=await rvcContract.methods.balanceOf(account).call()
    setBalance(window.web3.utils.fromWei( b,'ether') )
   console.log(rvcContract,b)  
 }
 
 const getAccount=()=>{
    window.ethereum.on('accountsChanged', function (accounts) {
        setAccount(accounts[0])
      
  })  
 }
  useEffect(() => {
    console.log(window.web3.currentProvider._state )
      getAccount()  
  /*   console.log(rvc) */
      
    
  }, [ ]);
 
const  connectWeb3=async()=>{
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum)
    await window.ethereum.enable()
    getRVCBalance()  
  }
  else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider)
  }
  else {
    window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
  }
  
}
  let content = (
    <React.Fragment>
      <p>{account}</p>
      <p>{balance}</p>
      <button onClick={connectWeb3}>Light Side</button>
       
    </React.Fragment>
  );

 
  return content;
};

export default App;