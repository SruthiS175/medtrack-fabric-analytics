#!/bin/bash

CHANNEL_NAME=medtrackchannel
BLOCK_FILE=./channel-artifacts/${CHANNEL_NAME}.block

joinPeer() {
  ORG=$1
  PEER_ADDRESS=$2
  MSP=$3
  MSP_PATH=$4
  TLS_ROOT_CERT=$5

  export CORE_PEER_ADDRESS=$PEER_ADDRESS
  export CORE_PEER_LOCALMSPID=$MSP
  export CORE_PEER_MSPCONFIGPATH=$MSP_PATH
  export CORE_PEER_TLS_ROOTCERT_FILE=$TLS_ROOT_CERT

  peer channel join -b $BLOCK_FILE
  echo "✅ $PEER_ADDRESS joined the channel"
}

# Retailer
joinPeer "retailer" "peer0.retailer.medtrack.com:7051" "RetailerMSP" \
  "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/retailer.medtrack.com/users/Admin@retailer.medtrack.com/msp" \
  "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/retailer.medtrack.com/peers/peer0.retailer.medtrack.com/tls/ca.crt"

# Manufacturer
joinPeer "manufacturer" "peer0.manufacturer.medtrack.com:8051" "ManufacturerMSP" \
  "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.medtrack.com/users/Admin@manufacturer.medtrack.com/msp" \
  "/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/manufacturer.medtrack.com/peers/peer0.manufacturer.medtrack.com/tls/ca.crt"

# Add more orgs similarly: distributor, wholesaler, supplier, consumer
