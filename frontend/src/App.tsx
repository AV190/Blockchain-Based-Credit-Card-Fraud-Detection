/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import React, { Fragment } from 'react';
import { SnackbarProvider } from 'notistack';
import Header from './components/Header';
import CreditCardFraudDetection from './components/CreditCardFraudDetection';
import { useMetamask } from 'use-metamask';
import { Contract, providers } from 'ethers';
import { Route, Routes } from 'react-router-dom';
import CreditCardFraudDetectionAbi from './contracts/CreditCardFraudDetection.json';
import Details from 'components/Details';
import Home from 'Home';

const contract = "0x07f4DA34F3101F035Dcdf402DEDF7D3716de14Ec";

function App() {
  const { connect, metaState } = useMetamask();
  const web3 = metaState.web3 as providers.Web3Provider;
  const account = metaState.account[0];

  function connectWallet() {
    connect && connect(providers.Web3Provider);
  };

  async function getCard(): Promise<any> {
    try {
      console.log(account)
      return new Contract(contract, CreditCardFraudDetectionAbi.abi, web3.getSigner())
        .functions
        .getCard(
          account
        )
        .then((res) => {
          return res[0];
        });
    } catch (e) {
      console.error(e);
    }
  }

  async function addCard(
    card: string,
    gender: string,
    city: string,
    state: string,
    lat: string,
    long: string,
    city_pop: string,
    job: string,
  ): Promise<void> {
    try {
      return new Contract(contract, CreditCardFraudDetectionAbi.abi, web3.getSigner())
        .functions
        .addCard(
          card,
          gender,
          city,
          state,
          lat,
          long,
          city_pop,
          job
        );
    } catch (e) {
      console.error(e);
    }
  }

  async function getCardTransactions(card: string): Promise<any> {
    try {
      return new Contract(contract, CreditCardFraudDetectionAbi.abi, web3.getSigner())
        .functions
        .getCardTransactions(
          card
        )
        .then((res) => {
          return res[0];
        });
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Fragment>
      <Header
        connect={connectWallet}
        isConnected={!(!metaState.isConnected || !web3 || !account)}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/details" element={<Details
          getCard={getCard}
          addCard={addCard}
          getCardTransactions={getCardTransactions}
        />} />
        <Route path="/predict" element={<CreditCardFraudDetection
          getCard={getCard}
        />} />
      </Routes>
      <SnackbarProvider anchorOrigin={{
        "horizontal": "right",
        "vertical": "top"
      }} />
    </Fragment >
  );
}

export default App;
