import { gql } from "@apollo/client";

export const walletAddress = "5DfhGyQdFobKM8NsWvEeAKk5EQQgYe9AydgJ7rMB6E1EqRzV";

export const wsUrl = "wss://rpc-hex-devnet.avail.tools/ws";

export const rpcUrl = "https://ethereum-sepolia-fk242w.zeeve.net/7lzCqTItuQroOUEOQI5mBYFUxr0dY/";

export const explorerUrl = "https://explorer.avail.so/?rpc=wss%3A%2F%2Frpc-hex-devnet.avail.tools%2Fws#/explorer";

export const contractAddress = "0x8f3844eF066f1C5Cc7F8f28e3d449AC1cdC65C54";

export const contractABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "BadHash",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidMerkleProof",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "attestations",
    outputs: [
      {
        internalType: "uint256",
        name: "blockNumber",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "leafIndex",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "avail",
    outputs: [
      {
        internalType: "contract IAvailBridge",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getProcotolName",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IAvailBridge",
        name: "_avail",
        type: "address",
      },
      {
        internalType: "contract IVectorx",
        name: "_vectorx",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "vectorx",
    outputs: [
      {
        internalType: "contract IVectorx",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "hash",
        type: "bytes32",
      },
      {
        internalType: "bytes",
        name: "dataAvailabilityMessage",
        type: "bytes",
      },
    ],
    name: "verifyMessage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const GET_DATA = gql`
  query GetPolygonZkevmTransactions($last: Int!, $var: Boolean!) {
    allPolygonZkevmTransactionBatches(
      last: $last
      filter: { sequenceId: { isNull: $var }, verifyId: { isNull: $var } }
    ) {
      nodes {
        id
        hash
        data
        timestamp
        isSequence
        isVerify
        checkCount
        checkInfo
        sequencedAt
        verifiedAt
        verifyId
        sequenceId
      }
    }
  }
`;
