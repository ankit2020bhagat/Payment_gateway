import { useEffect, useState } from "react";
import React from "react";
import "./styles/App.css";
import { ethers } from "ethers";
import payment from "./artifacts/contracts/Payment.sol/Payment.json";
import token from "./artifacts/contracts/mockToken.sol/MyToken.json";
// Constants
const PAYMENT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask -> https://metamask.io/");
        return;
      }

      // Fancy method to request access to account.
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      // Boom! This should print out public address once we authorize Metamask.
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const makePayment = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        console.log("token Address :", tokenAddress);
        const paymentContract = new ethers.Contract(
          PAYMENT_ADDRESS,
          payment.abi,
          signer
        );
        const tokenContract = new ethers.Contract(
          tokenAddress,
          token.abi,
          signer
        );
        const approveTxn = await tokenContract.approve(PAYMENT_ADDRESS, amount);
        await approveTxn.wait();
        const txn = await paymentContract.makePayment(
          tokenAddress,
          toAccount,
          amount
        );
        await txn.wait();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };
  const renderInputForm = () => {
    return (
      <div className="form-container">
        <div className="first-row">
          <input
            type="text"
            placeholder="tokenAddress"
            onChange={(e) => setTokenAddress(e.target.value)}
          />
          <input
            type="text"
            placeholder="toAddress"
            onChange={(e) => setToAccount(e.target.value)}
          />
        </div>

        <input
          type="text"
          placeholder="amount"
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="button-container">
          <button
            className="cta-button mint-button"
            disabled={null}
            onClick={makePayment}
          >
            Make Payment
          </button>
        </div>
      </div>
    );
  };

  const renderNotConnectedContainer = () => (
    <div className="connect-wallet-container">
      <img
        src="https://media.giphy.com/media/3ohhwytHcusSCXXOUg/giphy.gif"
        alt="Ninja donut gif"
      />
      {/* Call the connectWallet function we just wrote when the button is clicked */}
      <button
        onClick={connectWallet}
        className="cta-button connect-wallet-button"
      >
        Connect Wallet
      </button>
    </div>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <header>
            <div className="left">
              <p className="title">🐱‍👤 Payment Contract</p>
              <p className="subtitle">Make Payment with ERC20 token</p>
            </div>
          </header>
        </div>
        {!currentAccount && renderNotConnectedContainer()}
        {/* Render the input form if an account is connected */}
        {currentAccount && renderInputForm()}
      </div>
    </div>
  );
}

export default App;
