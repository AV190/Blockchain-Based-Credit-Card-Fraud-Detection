// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract CreditCardFraudDetection {
  address public admin = 0x5076F4bff162BB2824A0164417953355FD46aaee;

  struct Card {
    address cardOwner;
    string card;
    string gender;
    string city;
    string state;
    string lat;
    string long;
    string city_pop;
    string job;
  }

  struct CardTransaction {
    uint256 id;
    string card;
    string trans_date_time;
    string category;
    string amt;
    string merch_lat;
    string merch_long;
    string result;
  }
  mapping(address => string) public addressToCard;
  mapping(string => Card) public cards;
  
  uint256 cardTransactionId;
  mapping(uint256 => CardTransaction) public cardTransactions;

  constructor() {
    cardTransactionId = 0;
  }

  function getCard(address userAddress) public view returns (Card memory) {
    return cards[addressToCard[userAddress]];
  }

  function addCard(
    string memory card,
    string memory gender,
    string memory city,
    string memory state,
    string memory lat,
    string memory long,
    string memory city_pop,
    string memory job
  ) public {
    cards[card] = Card(
      msg.sender,
      card,
      gender,
      city,
      state,
      lat,
      long,
      city_pop,
      job
    );
    addressToCard[msg.sender] = card;
  }

  function isAdmin(address adminAddress) private view returns (bool) {
    return adminAddress == admin;
  }

  function addCardTransaction(
    string memory card,
    string memory trans_date_time,
    string memory category,
    string memory amt,
    string memory merch_lat,
    string memory merch_long,
    string memory result
  ) public {
    require(isAdmin(msg.sender), "Only admin access");
    uint256 transactionId = cardTransactionId++;
    cardTransactions[transactionId] = CardTransaction(
      transactionId,
      card,
      trans_date_time,
      category,
      amt,
      merch_lat,
      merch_long,
      result
    );
  }

  function compareStrings(string memory a, string memory b) public view returns (bool) {
    return (keccak256(bytes((a))) == keccak256(bytes((b))));
  }

  function getCardTransactions(string memory card) public view returns (CardTransaction[] memory) {
    uint256 cardTransactionCount = 0;
    for(uint256 i = 0; i < cardTransactionId; i++){
      if (compareStrings(card, cardTransactions[i].card))
        cardTransactionCount++;
    }

    CardTransaction[] memory _cardTransactions = new CardTransaction[](cardTransactionCount);
    uint256 j = 0;
    for(uint256 i = 0; i < cardTransactionId; i++){
      if (compareStrings(card, cardTransactions[i].card)) {
        _cardTransactions[j] = cardTransactions[i];
        j++;
      }
    }

    return _cardTransactions;
  }
}
