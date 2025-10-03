export const CONTRACT_ADDRESS = "0x833c1cA1A7f8cf8564Ba110DCAc1E6cD9bCcD2Dd" // replace after deploy

export const CONTRACT_ABI = [
  { "inputs": [ {"internalType":"string","name":"item","type":"string"}, {"internalType":"uint256","name":"reservePrice","type":"uint256"}, {"internalType":"uint256","name":"biddingPeriodSeconds","type":"uint256"} ], "name":"createAuction","outputs":[{"internalType":"uint256","name":"","type":"uint256"}], "stateMutability":"nonpayable","type":"function" },
  { "inputs": [ {"internalType":"uint256","name":"auctionId","type":"uint256"} ], "name":"placeBidMock","outputs":[], "stateMutability":"payable","type":"function" },
  { "inputs": [ {"internalType":"uint256","name":"auctionId","type":"uint256"}, {"components":[{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"struct externalEuint32","name":"encBid","type":"tuple"}, {"internalType":"bytes","name":"attestation","type":"bytes"} ], "name":"placeBidEncrypted","outputs":[], "stateMutability":"nonpayable","type":"function" },
  { "inputs": [ {"internalType":"uint256","name":"auctionId","type":"uint256"} ], "name":"finalize","outputs":[], "stateMutability":"nonpayable","type":"function" },
  { "inputs": [], "name":"withdraw","outputs":[], "stateMutability":"nonpayable","type":"function" }
]
