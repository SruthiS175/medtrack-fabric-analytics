#!/bin/bash

CHANNEL_NAME=medtrackchannel
CC_NAME=medtrackcc
CC_VERSION=1.0
CC_SEQUENCE=1
CC_LABEL=${CC_NAME}_${CC_VERSION}
ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/orderer.medtrack.com/orderers/orderer1.orderer.medtrack.com/msp/tlscacerts/tlsca.orderer.medtrack.com-cert.pem

export CORE_PEER_ADDRESS=peer0.retailer.medtrack.com:7051
export CORE_PEER_LOCALMSPID=RetailerMSP
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/retailer.medtrack.com/users/Admin@retailer.medtrack.com/msp
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/retailer.medtrack.com/peers/peer0.retailer.medtrack.com/tls/ca.crt

PACKAGE_ID=$(peer lifecycle chaincode queryinstalled | grep "$CC_LABEL" | awk -F "[, ]+" '{print $3}')

peer lifecycle chaincode approveformyorg \
  -o orderer1.orderer.medtrack.com:7050 \
  --ordererTLSHostnameOverride orderer1.orderer.medtrack.com \
  --channelID $CHANNEL_NAME \
  --name $CC_NAME \
  --version $CC_VERSION \
  --package-id $PACKAGE_ID \
  --sequence $CC_SEQUENCE \
  --tls --cafile $ORDERER_CA

echo "✅ Chaincode approved by Retailer"
