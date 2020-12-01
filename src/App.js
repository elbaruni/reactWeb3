 
import Web3 from 'web3';


import React, { useState,useEffect } from 'react';
import rvc from "./contracts/RVC.json"
import factory from "./contracts/Factory.json"
 

const App = props => {
  const [account,setAccount]=useState("")
 
  const [balance,setBalance]=useState(0)
   

 //Function to check if account changed and set it to account state 
 const getRVCBalance=async ()=>{
 
     const rvcContract=await new window.web3.eth.Contract(rvc.abi, rvc.address) 
      const b=await rvcContract.methods.balanceOf(account).call()
    setBalance(window.web3.utils.fromWei( b,'ether') )  
   
 }
 const writeFunction=async()=>{
  const web3= new Web3
  const BN = web3.utils.BN;

  
  const user="0xf26D566aF179f5499108C459ef41725F370447c9"
  const amount=new BN(1234) ;
  const rvcContract=await new window.web3.eth.Contract(rvc.abi, rvc.address) 
  const b=await rvcContract.methods.approve(user,amount).send({from:account})
 console.log(b)
 }
 const getAccount=async ()=>{

  const web3 = window.web3
  // Load account
  const accounts = await web3.eth.getAccounts()
  setAccount(accounts[0])
    window.ethereum.on('accountsChanged', function (accounts) {
        setAccount(accounts[0])
      
  })  
 }
  useEffect(() => {
   
      
   
      
    
  }, [ ]);
 
const  connectWeb3=async()=>{
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum)
    await window.ethereum.enable()
    getAccount()  
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
      <button id="test" onClick={writeFunction}>test</button>
      <button onClick={connectWeb3}>connect</button>
       
    </React.Fragment>
  );

 
  return content;
};

export default App;